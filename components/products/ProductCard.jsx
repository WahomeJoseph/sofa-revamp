'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishList } from '../../lib/features/Productslice';
import { selectIsWishlisted } from '../../lib/features/Productslice'; // Import selector
import { toast } from 'sonner';
import ProductModal from './ProductModal';
import { useSession } from 'next-auth/react';

export default function ProductCard({ product, setSelectedProduct }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const isFavorited = useSelector(state =>
    selectIsWishlisted(state, product._id, userId)
  )

  const handleCart = () => {
    if (!product.inStock) return;
    setLoading(true);
    try {
      dispatch(
        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          images: product.images?.[0],
          stockQuantity: product.stockQuantity,
          inStock: product.inStock,
        })
      );
      toast.success(`${product.name} added to cart!`, {
        description: `$${product.price}`,
      });
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!product || !product._id) {
      console.error('Invalid product data:', product);
      toast.error('Cannot add invalid product to wishlist');
      return;
    }

    try {
      if (status === 'loading') return; 
      const payload = userId
        ? { userId, product }
        : { product };

      dispatch(addToWishList(payload));
      toast.success(`${product.name} ${isFavorited ? 'removed from' : 'added to'} wishlist!`);
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    if (setSelectedProduct) setSelectedProduct(product);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Card
      className='group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className='absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10'>
        <Button
          size='icon'
          variant='secondary'
          onClick={handleToggleFavorite}
          className={`h-10 w-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm ${isFavorited ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-100'}`}>
          <Heart
            size={24}
            className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-white text-white' : 'text-gray-600 hover:text-red-500'}`}
          />
        </Button>
        <Button
          size='icon'
          variant='secondary'
          onClick={openModal}
          className='h-10 w-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm'
        >
          <Eye size={20} />
        </Button>
      </div>
      <CardContent className='p-0 relative aspect-square w-full overflow-hidden'>
        <Link href={`/products/${product._id}`} aria-label={`View details for ${product.name}`}>
          <div className='relative aspect-square w-full overflow-hidden'>
            <Image
              src={product?.images?.length > 0 ? product.images[0] : '/placeholder.jpg'}
              alt={product?.name || 'Sofa Image'}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover transition-transform duration-500 group-hover:scale-105'
              priority
            />
            {!product.inStock && (
              <Badge variant='destructive' className='absolute top-3 left-3 px-2 py-0.5 text-xs'>
                Out of Stock
              </Badge>
            )}
            {product.stockQuantity < 10 && product.inStock && (
              <Badge className='absolute top-3 left-3 px-2 py-0.5 text-xs bg-green-700 text-white'>
                Only {product.stockQuantity} left
              </Badge>
            )}
          </div>
        </Link>
        {isHovered && product.inStock && (
          <div className='absolute bottom-0 left-0 w-full p-2 bg-white bg-opacity-90'>
            <Button
              onClick={handleCart}
              className='w-full bg-gray-900 hover:bg-gray-900 text-white transition-colors'
              disabled={loading || !product.inStock}
              aria-label={`Add ${product.name} to cart`}>
              {loading ? (
                <>
                  <ShoppingCart />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className='h-4 w-4 mr-2' />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className='p-4 flex flex-col gap-2'>
        <div className='text-xs text-gray-500 uppercase tracking-wide font-medium'>{product.category}</div>
        <h3 className='font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors'>
          <Link href={`/products/${product._id}`}>{product.name}</Link>
        </h3>
        <div className='flex items-center gap-1'>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className='text-sm text-gray-600 ml-1'>
            {typeof product.rating === 'number'
              ? product.rating.toFixed(1)
              : 'N/A'} ({product.reviews ?? 0})
          </span>

        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xl font-bold text-gray-900'>${product.price}</span>
          {product.originalPrice && (
            <span className='text-sm text-gray-500 line-through'>${product.originalPrice}</span>
          )}
        </div>
      </CardFooter>
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </Card>
  );
}