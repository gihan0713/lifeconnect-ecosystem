import { UserPlus, Lightbulb, Users, Rocket, DollarSign, Vote } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Join & Create Profile",
    description: "Sign up securely with face + ID verification. Share your skills, resources, and income goals.",
    color: "primary",
  },
  {
    icon: Lightbulb,
    title: "Post Your Need",
    description: "Share your project idea. Our AI breaks it down into actionable steps, resources, and team needs.",
    color: "accent",
  },
  {
    icon: Users,
    title: "Get Matched",
    description: "Connect with the right people, suppliers, investors, and mentors for your project automatically.",
    color: "success",
  },
  {
    icon: Rocket,
    title: "Execute Together",
    description: "Collaborate using built-in project management tools. Track progress, tasks, and contributions.",
    color: "primary",
  },
  {
    icon: DollarSign,
    title: "Earn Income",
    description: "Revenue is distributed: 85% to you, 10% to city development, 5% to platform sustainability.",
    color: "success",
  },
  {
    icon: Vote,
    title: "Build Your City",
    description: "Vote on how city funds are used. See real impact on infrastructure, education, and healthcare.",
    color: "accent",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Six simple steps from idea to impact—transforming your skills into income while building thriving communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const gradientClass = 
              step.color === "primary" ? "bg-gradient-hero" :
              step.color === "accent" ? "bg-gradient-accent" :
              "bg-gradient-success";

            return (
              <div
                key={index}
                className="relative bg-card rounded-2xl p-8 border border-border shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${gradientClass} shadow-md flex-shrink-0`}>
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-muted-foreground mb-2">
                      Step {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
