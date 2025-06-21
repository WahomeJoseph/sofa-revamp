"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const backgroundImages = [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=800&fit=crop"
];

export default function Homes() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Image Slider */}
            <div className="absolute inset-0 z-0">
                {backgroundImages.map((image, index) => (
                    <div
                        key={image}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={image}
                            alt={`Luxurious living room ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    Transform Your
                    <span className="block bg-white/5 text-amber-600">
                        Living or Office Space
                    </span>
                </h1>

                <p className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto text-gray-200">
                    Discover premium sofas crafted for comfort, style, and durability. From modern minimalist to classic elegance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href='/shop'>
                        <Button size="lg" className="bg-gray-900 text-lg px-8 py-6 cursor-pointer">
                            Shop Collection
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>

                    <Link href='/contact'>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6 cursor-pointer bg-white/20 border-white/20 text-white hover:bg-gray-900 hover:text-white">
                            Contact Us
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
                    <div>
                        <div className="text-3xl font-bold">500+</div>
                        <div className="text-sm text-gray-300">Happy Customers</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">50+</div>
                        <div className="text-sm text-gray-300">Sofa Models</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">5★</div>
                        <div className="text-sm text-gray-300">Average Rating</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">24/7</div>
                        <div className="text-sm text-gray-300">Support</div>
                    </div>
                </div>
            </div>

            {/* Slider Indicators */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
                {backgroundImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};