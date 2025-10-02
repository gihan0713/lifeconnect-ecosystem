import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Users, Wallet, Calendar, MapPin, Sparkles, Loader2 } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [aiPlan, setAiPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*, profiles(*), project_members(*, profiles(*))")
      .eq("id", id)
      .single();

    if (error) {
      toast({ title: "Error loading project", variant: "destructive" });
      navigate("/dashboard");
    } else {
      setProject(data);
    }
    setLoading(false);
  };

  const generateAIPlan = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-project-planner", {
        body: { projectId: id }
      });

      if (error) throw error;
      setAiPlan(data);
      toast({ title: "AI plan generated!", description: "Your project has been broken down into actionable tasks" });
    } catch (error: any) {
      toast({ title: "Failed to generate plan", description: error.message, variant: "destructive" });
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Project Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{project.status}</Badge>
              <Badge variant="outline">{project.category}</Badge>
            </div>
            <h1 className="text-4xl font-bold">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {project.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </div>
              )}
              {project.estimated_budget && (
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  ${project.estimated_budget.toLocaleString()} budget
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {project.project_members?.length || 0} team members
              </div>
            </div>
          </div>

          {/* AI Planning Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Project Planning
                  </CardTitle>
                  <CardDescription>
                    Let AI break down your project into actionable tasks
                  </CardDescription>
                </div>
                <Button onClick={generateAIPlan} disabled={generating} variant="hero">
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Plan"
                  )}
                </Button>
              </div>
            </CardHeader>
            {aiPlan && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <p className="text-2xl font-bold">{aiPlan.timeline_weeks} weeks</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recommended Team Size</p>
                    <p className="text-2xl font-bold">{aiPlan.team_size_recommended} people</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Tasks</h3>
                  {aiPlan.tasks?.map((task: any, index: number) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>
                            {task.priority}
                          </Badge>
                        </div>
                        <CardDescription>{task.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{task.estimated_hours} hours</span>
                        </div>
                        {task.required_skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.required_skills.map((skill: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              {project.project_members?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No team members yet</p>
              ) : (
                <div className="space-y-3">
                  {project.project_members?.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {member.profiles?.full_name?.[0] || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.profiles?.full_name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{member.contribution_percentage}%</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;