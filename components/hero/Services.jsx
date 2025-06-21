"use client"

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Sparkles, Truck, Clock, Shield, Star, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Professional Sofa Cleaning",
      description:
        "Deep cleaning service that removes stains, odors, and allergens while preserving fabric quality.",
      icon: Sparkles,
      price: "From KES 4999",
      duration: "2-3 hours",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop",
      features: [
        "Eco-friendly products",
        "Stain removal",
        "Fabric protection",
        "Same-day service",
      ],
      badge: "Popular",
    },
    {
      id: 2,
      title: "Sofa Revamp & Restoration",
      description:
        "Complete makeover service including reupholstering, frame repair, and custom modifications.",
      icon: Wrench,
      price: "From KES 19999",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
      features: [
        "Custom fabrics",
        "Frame repair",
        "Cushion replacement",
        "Design consultation",
      ],
      badge: "Premium",
    },
    {
      id: 3,
      title: "White Glove Delivery",
      description:
        "Hassle-free premium delivery service with professional setup and placement in your home or office.",
      icon: Truck,
      price: "From KES 2999",
      duration: "Same day",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
      features: [
        "Professional assembly",
        "Room placement",
        "Packaging removal",
        "Damage protection",
      ],
      badge: "Fast",
    },
  ];

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl text-gray-900 font-bold mb-1">Premium Services</h2>
          <p className="text-base font-medium text-muted-foreground max-w-2xl mx-auto">
            Complete care for your furniture investment with our professional services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={true}
                />
                <Badge
                  className={`absolute top-3 left-3 ${service.badge === "Popular"
                    ? "bg-blue-500"
                    : service.badge === "Premium"
                      ? "bg-purple-500"
                      : "bg-green-500"
                    }`}>
                  {service.badge}
                </Badge>
              </div>

              <CardHeader>
                <div className="flex items-center gap-3 mb-0">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-base font-light text-muted-foreground">{service.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">What's included:</h4>
                  <ul className="text-sm font-light text-muted-foreground space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Shield className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xl font-bold text-primary">{service.price}</span>
                  <Link
                    href='/contact'
                    size="sm" className="group/btn p-2 rounded bg-gray-900 text-white">
                    Book Now
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Guarantee */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gray-900/5 border-primary/20">
            <CardContent className="p-8">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Customer Satisfaction Guarantee</h3>
              <p className="text-gray-900 text-base font-medium text-muted-foreground mb-2">
                Not happy with our service? We'll make it right or provide a full refund.
              </p>
              <Link href='/contact'>
                <Button 
                size="lg"
                variant="outline"
                className='bg-gray-900 hover:bg-gray-950 text-white text-base py-6 px-auto'>
                  Reach Out For Support and Queries
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};