import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Package, Wrench, Grid3x3, Globe, Bot, GraduationCap, Wand2, Leaf, Store, Users, Building2 } from "lucide-react";

const categories = [
  {
    title: "Digital Products Place",
    description: "Discover and create amazing digital products",
    icon: Package,
    url: "https://prodige-maker-ai.lovable.app",
  },
  {
    title: "Minitools",
    description: "Essential tools for everyday productivity",
    icon: Wrench,
    url: "https://ultimate-ai-toolkit.lovable.app/",
  },
  {
    title: "Super App",
    description: "All-in-one platform for your daily needs",
    icon: Grid3x3,
    url: "https://nexus-life-grid.lovable.app/",
  },
  {
    title: "Global Portal",
    description: "Connect and collaborate worldwide",
    icon: Globe,
    url: "https://thinkglobal.lovable.app/",
  },
  {
    title: "AI Tools List",
    description: "Comprehensive directory of AI-powered tools",
    icon: Bot,
    url: "https://freeai-portal.lovable.app/",
  },
  {
    title: "STEM Education",
    description: "Innovative learning resources for STEM subjects",
    icon: GraduationCap,
    url: "https://stemedu.lovable.app/",
  },
  {
    title: "Medium Tools",
    description: "Creative tools for content creators",
    icon: Wand2,
    url: "https://gen-wiz-web.lovable.app/",
  },
  {
    title: "Future Earth",
    description: "Sustainable solutions for our planet",
    icon: Leaf,
    url: "https://earthfuture.lovable.app/",
  },
  {
    title: "Tradenest Market Place",
    description: "Global marketplace for trading and commerce",
    icon: Store,
    url: "https://tradenest-global-hub.lovable.app/",
  },
  {
    title: "Team up",
    description: "Collaborate and bring ideas to life together",
    icon: Users,
    url: "https://invest-a-idea.lovable.app/",
  },
  {
    title: "Property",
    description: "Find and connect with property opportunities",
    icon: Building2,
    url: "https://lanka-crib-connect.lovable.app/",
  },
];

const Categories = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Ecosystem</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover powerful platforms and tools to enhance your projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <a
                key={index}
                href={category.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 hover:border-primary/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {category.title}
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      Visit Platform
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
