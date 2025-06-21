'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishList, selectIsWishlisted, addToCart } from '@/lib/features/Productslice';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export default function ProductModal({ product, isOpen, onClose }) {
    const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const { data: session, status } = useSession();
    const userId = session?.user?.id;

    if (!product) return null;
    const reviews = [
        {
            id: 1,
            user: 'Sarah Johnson',
            rating: 5,
            comment: 'Absolutely love this sofa! The quality is outstanding and it\'s incredibly comfortable.',
            date: '2024-01-15',
        },
        {
            id: 2,
            user: 'Mike Chen',
            rating: 4,
            comment: 'Great value for money. Delivery was quick and assembly was straightforward.',
            date: '2024-01-10',
        },
    ];

    // Read wishlist state directly
    const wishlist = useSelector((state) => state.product.wishlist || []);
    const isFavorited = useSelector((state) =>
        selectIsWishlisted(state, product._id, userId)
    );

    const handleToggleFavorite = () => {
        if (!product || !product._id) {
            console.error('Invalid product data:', product);
            toast.error('Cannot add invalid product to wishlist');
            return;
        }
        try {
            if (status === loading) return;
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
    // const handleToggleFavorite = () => {
    //     dispatch(addToWishList(product));
    //     toast.success(`${product.name} ${isFavorited ? 'removed from' : 'added to'} wishlist!`);
    // };

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className='max-w-4xl max-h-[90vh] bg-white overflow-y-auto'
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#111827 #F9FAFB',
                }}>
                <style>
                    {`
            .max-w-4xl::-webkit-scrollbar {
              width: 8px;
            }
            .max-w-4xl::-webkit-scrollbar-track {
              background: #F9FAFB;
              border-radius: 10px;
            }
            .max-w-4xl::-webkit-scrollbar-thumb {
              background: #111827;
              border-radius: 10px;
              transition: background 0.3s;
            }
            .max-w-4xl::-webkit-scrollbar-thumb:hover {
              background: #1F2937;
            }
          `}
                </style>
                <DialogHeader>
                    <DialogTitle className='text-2xl font-bold'>{product.name}</DialogTitle>
                </DialogHeader>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    {/* Product Images */}
                    <div className='space-y-4'>
                        <div className='relative rounded-xl overflow-hidden'>
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={100}
                                height={100}
                                priority
                                className='w-full h-96 object-cover transition-opacity hover:opacity-90'
                            />
                            {product.badge && (
                                <Badge className='absolute bg-gray-900 text-white top-3 left-3 px-3 py-1'>
                                    {product.badge}
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className='grid grid-cols-4 gap-3'>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className='relative rounded-md overflow-hidden cursor-pointer group'>
                                    <Image
                                        src={product.images[0]}
                                        alt={`${product.name} view ${i}`}
                                        width={100}
                                        height={100}
                                        priority
                                        className='w-full h-20 object-cover transition-all group-hover:opacity-80'
                                    />
                                    <div className='absolute inset-0 bg-gray-900/30 bg-opacity-0 group-hover:bg-opacity-10 transition-all' />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className='space-y-6'>
                        <div className='flex items-center gap-2'>
                            <div className='flex'>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className='text-sm text-gray-600'>
                                {product.rating} ({product.reviews} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className='flex items-center gap-3'>
                            <span className='text-3xl font-bold text-gray-900'>${product.price}</span>
                            {product.originalPrice && (
                                <span className='text-xl text-gray-500 line-through'>${product.originalPrice}</span>
                            )}
                            {product.originalPrice && (
                                <span className='text-sm font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded'>
                                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className='text-gray-600'>
                            Experience ultimate comfort with our premium {product.name.toLowerCase()}.
                            Crafted with the finest materials and attention to detail.
                        </p>

                        {/* Color Selection */}
                        {product.colors?.length > 0 && (
                            <div className='space-y-3'>
                                <h4 className='font-semibold text-gray-900'>Color: {selectedColor}</h4>
                                <div className='flex gap-3'>
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === color ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setSelectedColor(color)}>
                                            {selectedColor === color && <Check className='h-4 w-4 text-white' strokeWidth={3} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {product.sizes?.length > 0 && (
                            <div className='space-y-3'>
                                <h4 className='font-semibold text-gray-900'>Size: {selectedSize}</h4>
                                <div className='flex flex-wrap gap-2'>
                                    {product.sizes.map((size) => (
                                        <Button
                                            key={size}
                                            variant={selectedSize === size ? 'default' : 'outline'}
                                            size='sm'
                                            className={`transition-all ${selectedSize === size ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'}`}
                                            onClick={() => setSelectedSize(size)}>
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className='space-y-3'>
                            <h4 className='font-semibold text-gray-900'>Quantity</h4>
                            <div className='flex items-center gap-3'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='rounded-full'
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                    <Minus className='h-4 w-4' />
                                </Button>
                                <span className='w-12 text-center font-medium text-gray-900'>{quantity}</span>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    className='rounded-full'
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus className='h-4 w-4' />
                                </Button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className='flex gap-3 pt-2'>
                            <Button
                                onClick={handleCart}
                                className='flex-1 h-12 bg-gray-900 hover:bg-gray-900 text-white transition-colors'
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
                        </div>

                        {/* Features */}
                        <div className='grid grid-cols-3 gap-4 pt-4 border-t border-gray-100'>
                            {[
                                { icon: <Truck className='h-6 w-6' />, text: 'Free Delivery' },
                                { icon: <Shield className='h-6 w-6' />, text: '2 Year Warranty' },
                                { icon: <RotateCcw className='h-6 w-6' />, text: '30 Day Returns' },
                            ].map((item, index) => (
                                <div key={index} className='text-center p-2 rounded-lg hover:bg-gray-50 transition-colors'>
                                    <div className='mx-auto mb-2 text-primary'>{item.icon}</div>
                                    <p className='text-xs text-gray-600'>{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs
                    defaultValue='description'
                    className='mt-8'
                    onValueChange={(value) => setActiveTab(value)}>
                    <TabsList className='grid w-full grid-cols-3 bg-gray-50'>
                        {[
                            { value: 'description', label: 'Description' },
                            { value: 'specifications', label: 'Specifications' },
                            { value: 'reviews', label: `Reviews (${reviews.length})` },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={`transition-all ${activeTab === tab.value ? 'bg-gray-900 shadow-sm text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value='description' className='mt-6'>
                        <Card className='border-gray-100'>
                            <CardContent className='p-6'>
                                <p className='text-gray-600'>
                                    This premium sofa combines contemporary design with unmatched comfort.
                                    Featuring high-quality materials, sturdy construction, and elegant aesthetics,
                                    it\'s the perfect addition to any modern living space.
                                </p>
                                <ul className='mt-4 space-y-2 text-gray-600'>
                                    <li className='flex items-start'>
                                        <Check className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                                        <span>100% premium fabric upholstery</span>
                                    </li>
                                    <li className='flex items-start'>
                                        <Check className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                                        <span>Solid hardwood frame construction</span>
                                    </li>
                                    <li className='flex items-start'>
                                        <Check className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                                        <span>High-density foam cushions for optimal comfort</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='specifications' className='mt-6'>
                        <Card className='border-gray-100'>
                            <CardContent className='p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div className='space-y-3'>
                                        <h4 className='font-semibold text-gray-900'>Dimensions</h4>
                                        <div className='space-y-1 text-gray-600'>
                                            <p>Length: 220cm</p>
                                            <p>Width: 90cm</p>
                                            <p>Height: 85cm</p>
                                            <p>Seat Height: 45cm</p>
                                        </div>
                                    </div>
                                    <div className='space-y-3'>
                                        <h4 className='font-semibold text-gray-900'>Materials</h4>
                                        <div className='space-y-1 text-gray-600'>
                                            <p>Frame: Solid hardwood</p>
                                            <p>Upholstery: Premium fabric</p>
                                            <p>Filling: High-density foam</p>
                                            <p>Legs: Polished metal</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='reviews' className='mt-6'>
                        <div className='space-y-4'>
                            {reviews.map((review) => (
                                <Card key={review.id} className='border-gray-100'>
                                    <CardContent className='p-6'>
                                        <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-3'>
                                            <div className='flex items-center gap-2'>
                                                <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium'>
                                                    {review.user.charAt(0)}
                                                </div>
                                                <span className='font-semibold text-gray-900'>{review.user}</span>
                                            </div>
                                            <div className='flex items-center gap-2 sm:ml-auto'>
                                                <div className='flex'>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className='text-sm text-gray-500'>{review.date}</span>
                                            </div>
                                        </div>
                                        <p className='text-gray-600'>{review.comment}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}