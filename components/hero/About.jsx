import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Users, Heart, Shield, Minus } from 'lucide-react';
import ImageSlider from './ImageSlider';

export default function About() {
  const stats = [
    {
      number: '5+',
      label: 'Years Experience',
      icon: Award,
      description: 'Decade of excellence',
    },
    {
      number: '500+',
      label: 'Happy Customers',
      icon: Users,
      description: 'Satisfied families',
    },
    {
      number: '50+',
      label: 'Sofa Models',
      icon: Heart,
      description: 'Unique designs',
    },
    {
      number: '24/7',
      label: 'Customer Support',
      icon: Shield,
      description: 'Always here for you',
    },
  ];

  const features = [
    'Premium leather and fabric selection',
    'Handcrafted by skilled artisans',
    'Sustainable manufacturing process',
    'Lifetime warranty on frame',
  ];

  return (
    <section id="about" className="py-10 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-25" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-gray-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Badge variant="secondary" className="mb-1 text-xl font-medium">
            Our Story
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
            Crafting Comfort Since 2020
          </h2>
          <p className="text-base text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Where exceptional design meets uncompromising comfort
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Content Side */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <p className="text-base font-medium text-slate-700 leading-relaxed">
                At <span className="font-bold text-gray-950">SofaLux</span>, we believe that every home deserves exceptional furniture. Our journey began
                with a simple mission: to create sofas that combine timeless design, superior comfort,
                and lasting quality.
              </p>
              <p className="text-base font-medium text-slate-700 leading-relaxed">
                Each piece is carefully crafted by skilled artisans using premium materials sourced
                from around the world. From the initial design concept to the final quality check,
                we ensure every sofa meets our exacting standards.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <h3 className="flex items-center text-xl font-semibold text-slate-900 mb-4"> <Minus /> What Sets Us Apart <Minus /></h3>
              <div className="grid gap-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm border border-slate-200/50 hover:bg-white/80 transition-all duration-300">
                    <div className="w-2 h-2 bg-gray-600 rounded-full" />
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative animate-scale-in">
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50">
                <ImageSlider />
              </div>

              {/* Floating Quality Badge */}
              <Card className="absolute z-50 -bottom-8 -left-8 p-6 bg-white/95 backdrop-blur-sm shadow-2xl border-0 ring-1 ring-slate-200/50 hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Award className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900">Premium Quality</div>
                      <div className="text-sm text-slate-600">Handcrafted Excellence</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Decorative Element */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-gray-400 to-indigo-500 rounded-full opacity-20 blur-xl" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="group text-center p-8 border-0 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-slate-200/50 hover:ring-gray-300/50 transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-0 space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mb-1">{stat.label}</div>
                    <div className="text-xs text-slate-600">{stat.description}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}