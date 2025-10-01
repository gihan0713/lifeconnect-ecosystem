import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-collaboration.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="People collaborating on projects" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              85% You • 10% City • 5% Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent leading-tight">
            Connect. Create. Grow Together.
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            LifeConnect Global connects your skills, resources, and dreams with opportunities—creating income for you, development for your city, and sustainability for all.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" variant="hero" className="group">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-hero mx-auto mb-4">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Direct Income for You</div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-success mx-auto mb-4">
                <Building2 className="h-6 w-6 text-success-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">10%</div>
              <div className="text-sm text-muted-foreground">City Development Fund</div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-accent mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">5%</div>
              <div className="text-sm text-muted-foreground">Platform Growth</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
