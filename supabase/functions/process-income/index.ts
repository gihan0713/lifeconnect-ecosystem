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
    const { projectId, amount } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get project and members
    const { data: project } = await supabaseClient
      .from("projects")
      .select("*, project_members(*)")
      .eq("id", projectId)
      .single();

    if (!project) throw new Error("Project not found");

    // Calculate distribution: 85% team, 10% city, 5% platform
    const teamShare = amount * 0.85;
    const cityShare = amount * 0.10;
    const platformShare = amount * 0.05;

    // Get project location for city fund
    const location = project.location || "Global";

    // Get or create city fund
    let { data: cityFund } = await supabaseClient
      .from("city_development_funds")
      .select("*")
      .eq("location", location)
      .single();

    if (!cityFund) {
      const { data: newFund } = await supabaseClient
        .from("city_development_funds")
        .insert({ location, total_amount: 0, allocated_amount: 0, available_amount: 0 })
        .select()
        .single();
      cityFund = newFund;
    }

    // Update city fund
    await supabaseClient
      .from("city_development_funds")
      .update({
        total_amount: (cityFund.total_amount || 0) + cityShare,
        available_amount: (cityFund.available_amount || 0) + cityShare
      })
      .eq("id", cityFund.id);

    // Record city contribution transaction
    await supabaseClient
      .from("income_transactions")
      .insert({
        project_id: projectId,
        amount: cityShare,
        transaction_type: "city_contribution",
        description: `City fund contribution from project: ${project.title}`
      });

    // Record platform fee transaction
    await supabaseClient
      .from("income_transactions")
      .insert({
        project_id: projectId,
        amount: platformShare,
        transaction_type: "platform_fee",
        description: `Platform fee from project: ${project.title}`
      });

    // Distribute to team members based on contribution percentage
    const members = project.project_members || [];
    const totalContribution = members.reduce((sum: number, m: any) => 
      sum + (m.contribution_percentage || 0), 0
    );

    for (const member of members) {
      const percentage = (member.contribution_percentage || 0) / totalContribution;
      const memberShare = teamShare * percentage;

      await supabaseClient
        .from("income_transactions")
        .insert({
          project_id: projectId,
          user_id: member.user_id,
          amount: memberShare,
          transaction_type: "project_income",
          description: `Income from project: ${project.title}`
        });
    }

    // Update project total income
    await supabaseClient
      .from("projects")
      .update({
        total_income: (project.total_income || 0) + amount
      })
      .eq("id", projectId);

    console.log(`Processed ${amount} income for project ${projectId}: Team=${teamShare}, City=${cityShare}, Platform=${platformShare}`);

    return new Response(
      JSON.stringify({
        success: true,
        distribution: {
          team: teamShare,
          city: cityShare,
          platform: platformShare
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in process-income:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});