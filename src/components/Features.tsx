import { Sparkles, Target, Shield, Globe, BarChart3, Heart } from "lucide-react";
import cityImage from "@/assets/city-development.jpg";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    description: "Intelligent algorithms connect you with the perfect collaborators, resources, and opportunities.",
  },
  {
    icon: Target,
    title: "Project Management",
    description: "Built-in tools to track tasks, milestones, and team contributions in real-time.",
  },
  {
    icon: Shield,
    title: "Secure & Verified",
    description: "Face + ID verification, transparent income distribution, and community trust systems.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Start local, grow global. Connect villages, cities, and countries in one ecosystem.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track your income, project progress, and city development impact with detailed dashboards.",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "Vote on city development projects and see the direct impact of your work on your community.",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Features List */}
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Powerful tools designed to turn your skills and ideas into sustainable income while building better communities.
            </p>

            <div className="grid gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-4 items-start p-4 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={cityImage}
                alt="City development visualization"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Overlay Stats */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-card/90 backdrop-blur-md rounded-2xl p-6 border border-border shadow-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">85%</div>
                      <div className="text-xs text-muted-foreground">Your Income</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success mb-1">10%</div>
                      <div className="text-xs text-muted-foreground">City Fund</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent mb-1">5%</div>
                      <div className="text-xs text-muted-foreground">Platform</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
