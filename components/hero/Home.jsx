"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Users, Award, Headphones } from "lucide-react"

const backgroundImages = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=800&fit=crop",
]

const stats = [
  { icon: Users, value: "500+", label: "Happy Customers" },
  { icon: Award, value: "50+", label: "Sofa Models" },
  { icon: Star, value: "5★", label: "Average Rating" },
  { icon: Headphones, value: "24/7", label: "Support" },
]

export default function Homes() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1))
    }, 6000) // Increased interval for better UX

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
              index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Luxurious living room ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div
        className={`relative z-10 container mx-auto px-4 text-center text-white transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mb-4">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-amber-300 border border-white/20">
            Premium Furniture Collection
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight">
          Transform Your
          <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mt-2">
            Living Space
          </span>
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl font-light mb-12 max-w-4xl mx-auto text-gray-100 leading-relaxed">
          Discover premium sofas crafted for comfort, style, and durability.
          <span className="block mt-2 text-amber-200">From modern minimalist to classic elegance.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <Link href="/shop">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
            >
              Shop Collection
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="group text-lg px-10 py-7 rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Contact Us
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 mb-6 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Icon className="h-8 w-8 mx-auto mb-3 text-amber-400 group-hover:text-amber-300 transition-colors" />
                <div className="text-3xl lg:text-4xl font-bold mb-2 text-white">{stat.value}</div>
                <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`transition-all duration-300 rounded-full border-2 hover:scale-110 ${
              index === currentImageIndex
                ? "w-12 h-4 bg-white border-white"
                : "w-4 h-4 bg-white/30 border-white/50 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

