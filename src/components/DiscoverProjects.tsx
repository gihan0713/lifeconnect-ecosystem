import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, MapPin, Wallet, Loader2 } from "lucide-react";

const DiscoverProjects = () => {
  const { toast } = useToast();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("match-projects");
      
      if (error) throw error;
      setMatches(data.matches || []);
    } catch (error: any) {
      toast({ title: "Error loading matches", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Discover Projects</h2>
          <p className="text-muted-foreground">Projects matched to your skills and resources</p>
        </div>
        <Button onClick={fetchMatches} variant="outline">
          Refresh Matches
        </Button>
      </div>

      {matches.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No Matches Yet</h3>
            <p className="text-muted-foreground">
              Update your profile with skills and resources to find matching projects
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Match: {project.match_score}%</Badge>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {project.match_reasons?.map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {project.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </div>
                  )}
                  {project.estimated_budget && (
                    <div className="flex items-center gap-1">
                      <Wallet className="h-4 w-4" />
                      ${project.estimated_budget.toLocaleString()}
                    </div>
                  )}
                </div>

                <Button variant="hero" className="w-full">
                  Apply to Join
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverProjects;