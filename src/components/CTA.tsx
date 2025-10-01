import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const benefits = [
  "Start earning from your skills immediately",
  "Connect with opportunities in your area",
  "Contribute to real community development",
  "Track your impact with transparent analytics",
];

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-foreground">
              Free to Join • Start Earning Today
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground animate-slide-up">
            Ready to Turn Your Skills Into Income?
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
            Join thousands building sustainable income while creating positive change in their communities.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-left p-4 rounded-xl bg-card border border-border animate-fade-in"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "600ms" }}>
            <Button size="lg" variant="hero" className="group shadow-lg" onClick={() => window.location.href = '/auth'}>
              Create Your Profile
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Start with zero investment
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
