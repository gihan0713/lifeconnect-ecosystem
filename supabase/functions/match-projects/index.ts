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
    const authHeader = req.headers.get("authorization");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Get user profile
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Get all active projects
    const { data: projects } = await supabaseClient
      .from("projects")
      .select("*")
      .eq("status", "active")
      .neq("creator_id", user.id);

    // Simple matching algorithm based on skills and resources
    const matches = (projects || []).map(project => {
      let score = 0;
      const reasons = [];

      // Match skills
      const userSkills = profile?.skills || [];
      const projectSkills = project.required_skills || [];
      const skillMatches = userSkills.filter((skill: string) => 
        projectSkills.includes(skill)
      );
      score += skillMatches.length * 10;
      if (skillMatches.length > 0) {
        reasons.push(`Skills match: ${skillMatches.join(", ")}`);
      }

      // Match resources
      const userResources = profile?.resources || [];
      const projectResources = project.required_resources || [];
      const resourceMatches = userResources.filter((resource: string) => 
        projectResources.includes(resource)
      );
      score += resourceMatches.length * 8;
      if (resourceMatches.length > 0) {
        reasons.push(`Resources match: ${resourceMatches.join(", ")}`);
      }

      // Location match
      if (profile?.location && project.location && 
          profile.location.toLowerCase() === project.location.toLowerCase()) {
        score += 15;
        reasons.push("Same location");
      }

      // Category relevance (simple keyword matching)
      if (profile?.bio && profile.bio.toLowerCase().includes(project.category.toLowerCase())) {
        score += 5;
        reasons.push("Related to your interests");
      }

      return {
        ...project,
        match_score: score,
        match_reasons: reasons
      };
    });

    // Sort by match score and return top matches
    const topMatches = matches
      .filter(m => m.match_score > 0)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 10);

    console.log(`Found ${topMatches.length} project matches for user ${user.id}`);

    return new Response(JSON.stringify({ matches: topMatches }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in match-projects:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});