'use client'

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import ProductModal from "./ProductModal";

export default function FeaturedProducts() {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const products = [
        {
            id: 1,
            name: "Modern Minimalist Sofa",
            price: 1299,
            originalPrice: 1599,
            rating: 4.8,
            reviews: 124,
            image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop",
            colors: ["#8B4513", "#2C2C2C", "#F5F5DC"],
            sizes: ["2-Seater", "3-Seater", "L-Shape"],
            badge: "Best Seller",
        },
        {
            id: 2,
            name: "Classic Leather Chesterfield",
            price: 2199,
            originalPrice: null,
            rating: 4.9,
            reviews: 89,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
            colors: ["#8B4513", "#2C2C2C"],
            sizes: ["2-Seater", "3-Seater"],
            badge: "Premium",
        },
        {
            id: 3,
            name: "Scandinavian Fabric Sofa",
            price: 899,
            originalPrice: 1099,
            rating: 4.7,
            reviews: 67,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
            colors: ["#F5F5DC", "#808080", "#4169E1"],
            sizes: ["2-Seater", "3-Seater"],
            badge: "Sale",
        },
        {
            id: 4,
            name: "Contemporary Sectional",
            price: 1799,
            originalPrice: null,
            rating: 4.6,
            reviews: 156,
            image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
            colors: ["#2C2C2C", "#F5F5DC", "#8B4513"],
            sizes: ["L-Shape", "U-Shape"],
            badge: "New",
        },
    ];

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collections</h2>
                    <p className="text-md text-muted-foreground max-w-2xl mx-auto">
                        Handpicked sofas that combine exceptional craftsmanship with timeless design
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                <Badge
                                    className={`absolute top-3 left-3 ${product.badge === "Sale" ? "bg-red-500 text-white" :
                                        product.badge === "New" ? "bg-green-500 text-white" :
                                            product.badge === "Premium" ? "bg-purple-500 text-white" :
                                                "bg-blue-500 text-white"
                                        }`}>
                                    {product.badge}
                                </Badge>

                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-10 w-10 bg-gray-500/20 rounded-full">
                                        <Heart size={30} />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-10 w-10 bg-gray-500/20 rounded-full"
                                        onClick={() => setSelectedProduct(product)}>
                                        <Eye size={30} />
                                    </Button>
                                </div>

                                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 hover:scale-105 rounded-full cursor-pointer group-hover:bg-gray-900 text-white transition-opacity duration-300">
                                    <Button className="w-full" size="lg">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Quick Add
                                    </Button>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {product.name}
                                </h3>

                                <div className="flex items-center gap-1 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(product.rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {product.rating} ({product.reviews})
                                    </span>
                                </div>

                                <div className="flex gap-1 mb-3">
                                    {product.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold">${product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-sm text-muted-foreground line-through">
                                            ${product.originalPrice}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href='/shop'>
                        <Button size="lg" variant="outline" className="cursor-pointer hover:bg-gray-950/10">View All Products</Button>
                    </Link>
                </div>
            </div>

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </section>
    );
};
