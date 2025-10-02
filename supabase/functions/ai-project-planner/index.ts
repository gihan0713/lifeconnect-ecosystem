import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get project details
    const { data: project, error: projectError } = await supabaseClient
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError) throw projectError;

    // Call AI to break down project
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const systemPrompt = `You are an expert project planner. Break down projects into actionable tasks with priorities, time estimates, and required skills/resources. Return structured data.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Break down this project into 5-8 actionable tasks:\n\nTitle: ${project.title}\nDescription: ${project.description}\nCategory: ${project.category}\nBudget: ${project.estimated_budget}\n\nFor each task, provide: title, description, priority (high/medium/low), estimated_hours, required_skills (array), and required_resources (array).`
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_project_plan",
            description: "Create a structured project plan with tasks",
            parameters: {
              type: "object",
              properties: {
                tasks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] },
                      estimated_hours: { type: "number" },
                      required_skills: { type: "array", items: { type: "string" } },
                      required_resources: { type: "array", items: { type: "string" } }
                    },
                    required: ["title", "description", "priority", "estimated_hours"]
                  }
                },
                timeline_weeks: { type: "number" },
                team_size_recommended: { type: "number" }
              },
              required: ["tasks", "timeline_weeks", "team_size_recommended"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "create_project_plan" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices[0].message.tool_calls?.[0];
    const planData = JSON.parse(toolCall.function.arguments);

    console.log("AI Plan generated:", planData);

    return new Response(JSON.stringify(planData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-project-planner:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});