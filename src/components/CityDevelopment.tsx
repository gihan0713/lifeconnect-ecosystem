import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, ThumbsUp, ThumbsDown, TrendingUp } from "lucide-react";

const CityDevelopment = () => {
  const { toast } = useToast();
  const [funds, setFunds] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [userVotes, setUserVotes] = useState<any[]>([]);

  useEffect(() => {
    fetchCityData();
  }, []);

  const fetchCityData = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch city funds
    const { data: fundsData } = await supabase
      .from("city_development_funds")
      .select("*")
      .order("total_amount", { ascending: false });
    setFunds(fundsData || []);

    // Fetch city projects
    const { data: projectsData } = await supabase
      .from("city_projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects(projectsData || []);

    // Fetch user votes
    if (user) {
      const { data: votesData } = await supabase
        .from("votes")
        .select("*")
        .eq("user_id", user.id);
      setUserVotes(votesData || []);
    }
  };

  const handleVote = async (projectId: string, voteValue: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in to vote", variant: "destructive" });
      return;
    }

    const existingVote = userVotes.find(v => v.city_project_id === projectId);
    if (existingVote) {
      toast({ title: "You've already voted on this project", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("votes")
      .insert({
        user_id: user.id,
        city_project_id: projectId,
        vote: voteValue
      });

    if (error) {
      toast({ title: "Failed to vote", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Vote recorded!", description: "Thank you for participating" });
      fetchCityData();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">City Development</h2>
        <p className="text-muted-foreground">Vote on community projects and track fund distribution</p>
      </div>

      {/* City Funds Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {funds.slice(0, 3).map((fund) => (
          <Card key={fund.id}>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {fund.location}
              </CardDescription>
              <CardTitle className="text-3xl">${Number(fund.available_amount).toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Collected</span>
                  <span className="font-medium">${Number(fund.total_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Allocated</span>
                  <span className="font-medium">${Number(fund.allocated_amount).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* City Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Community Projects</CardTitle>
          <CardDescription>Vote on how city development funds should be used</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No city projects yet</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => {
                const hasVoted = userVotes.some(v => v.city_project_id === project.id);
                const totalVotes = (project.votes_for || 0) + (project.votes_against || 0);
                const approvalRate = totalVotes > 0 
                  ? Math.round((project.votes_for / totalVotes) * 100) 
                  : 0;

                return (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={project.status === "approved" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4" />
                          <span>{approvalRate}% approval</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Requested Amount</p>
                          <p className="text-xl font-bold">${Number(project.requested_amount).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(project.id, true)}
                            disabled={hasVoted}
                            className="gap-2"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            {project.votes_for || 0}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(project.id, false)}
                            disabled={hasVoted}
                            className="gap-2"
                          >
                            <ThumbsDown className="h-4 w-4" />
                            {project.votes_against || 0}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CityDevelopment;