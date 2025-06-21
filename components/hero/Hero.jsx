import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero(){
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-sofa-cream to-background min-h-[600px] flex items-center"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Luxury Sofas for
              <span className="text-primary block">Modern Living</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Discover our premium collection of handcrafted sofas designed for comfort, 
              style, and durability. Transform your living space today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group hover-scale">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="hover-scale">
                View Collection
              </Button>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-sofa-secondary to-sofa-accent">
              <img
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Sofa"
                className="w-full h-full object-cover image-fade"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};