'use client'

import { useState } from "react";
import { Eye, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ProductModal from "./ProductModal";

// Dummy product example
const dummyProduct = {
  id: 1,
  name: "Luxury Sofa",
  image: "/sofa.jpg",
  badge: "New",
  price: 350,
  originalPrice: 500,
  rating: 4.5,
  reviews: 12,
  colors: ["#000000", "#C0C0C0", "#8B4513"],
  sizes: ["Small", "Medium", "Large"],
  description: "Premium quality sofa with luxurious fabric and comfortable seating",
  category: "Living Room",
  inStock: true
};

export default function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="p-4">
      {/* Product Card */}
      <div className="group relative bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 w-[250px] overflow-hidden">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={dummyProduct.image}
            alt={dummyProduct.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badge */}
          {dummyProduct.badge && (
            <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
              {dummyProduct.badge}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={() => handleOpenModal(dummyProduct)}
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              {dummyProduct.category}
            </span>
          </div>

          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12 text-sm">
            {dummyProduct.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(dummyProduct.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({dummyProduct.reviews})
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">${dummyProduct.price}</span>
            {dummyProduct.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${dummyProduct.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}