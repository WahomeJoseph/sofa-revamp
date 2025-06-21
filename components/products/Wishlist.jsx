'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import { addToCart, selectUserWishlist, removeFromWishList, setUserWishlist } from '@/lib/features/Productslice';
import { toast, Toaster } from 'sonner';
import { useSession } from 'next-auth/react';

export default function Wishlist() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { data: session, status } = useSession();
    const userId = session?.user?.id;

    // Select the user's wishlist from the Redux store
    const wishlist = useSelector((state) => selectUserWishlist(state, userId)) || [];

    useEffect(() => {
        if (status === 'authenticated' || !userId) return
        const loadWishList = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/wishlist');
                const data = await res.json();
                console.log('Wishlist Products:', data)

                if (!res.ok) throw new Error(data.message || 'Failed to fetch wishlist');

                // Update Redux state
                dispatch(setUserWishlist({ userId, products: data.wishlist }));
                // Update localStorage
                const currentWishlists = JSON.parse(localStorage.getItem('userWishlists') || '{}');
                localStorage.setItem('userWishlists', JSON.stringify({
                    ...currentWishlists,
                    [userId]: data.wishlist
                }));
            } catch (error) {
                console.error('Failed to load wishlist:', error);
                toast.error('Failed to load wishlist');
            } finally {
                setLoading(false);
            }
        };
        loadWishList()
    }, [status, userId, dispatch]);

    const handleCart = (product) => {
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

    const handleRemoveFromWishlist = async (product) => {
        if (!userId) return;

        try {
            // Optimistic update
            const currentWishlist = [...wishlist];
            const updatedWishlist = currentWishlist.filter(item => item._id !== product._id);

            dispatch(setUserWishlist({ userId, products: updatedWishlist }));

            // Update localStorage
            const currentWishlists = JSON.parse(localStorage.getItem('userWishlists') || '{}');
            localStorage.setItem('userWishlists', JSON.stringify({
                ...currentWishlists,
                [userId]: updatedWishlist
            }));

            // API call
            const response = await fetch('/api/wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId: product._id }),
            });

            if (!response.ok) {
                throw new Error('Failed to update wishlist');
            }

            toast.success(`${product.name} removed from wishlist!`);
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Failed to update wishlist');
            // Revert optimistic update if error occurs
            dispatch(setUserWishlist({ userId, products: wishlist }));
        }
    };

    // Render a message if the user is not authenticated
    if (!userId) {
        return (
            <div className='container mx-auto px-4 py-8 text-center'>
                <h1 className='text-2xl font-bold mb-4'>Please Sign In</h1>
                <p className='text-gray-600 mb-6'>You need to be logged in to view your wishlist.</p>
                <Link
                    href='/login'
                    className='bg-gray-900 p-3 rounded shadow-lg hover:bg-gray-950 text-white'>
                    <span>Sign In</span>
                </Link>
            </div>
        );
    }

    // Render this message if wishlist is loading
    if (loading) {
        return (
            <div className='container mx-auto px-4 py-8 text-center'>
                <p className='text-gray-600'>Loading wishlist...</p>
            </div>
        );
    }

    // Render a message if the wishlist is empty
    if (wishlist.length === 0) {
        return (
            <div className='container mx-auto px-4 py-8 text-center'>
                <h1 className='text-2xl font-bold mb-4'>Your Wishlist is Empty</h1>
                <p className='text-gray-600 mb-6'>Add some items to your wishlist to see them here.</p>
                <Button asChild className='bg-gray-900 shadow-lg hover:bg-gray-950 text-white'>
                    <Link href='/shop'>Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    // Render the wishlist items
    return (
        <div className='container mx-auto px-4 py-8'>
            <Toaster position='top-center' richColors />
            <h1 className='text-2xl font-bold mb-6'>Your Wishlist ({wishlist.length})</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {wishlist.map((product) => (
                    <Card
                        key={product._id}
                        product={product}
                        className='overflow-hidden group hover:shadow-lg transition-shadow'>
                        <CardContent className='p-0 relative'>
                            <Link href={`/products/${product._id}`} className='block'>
                                <div className='relative aspect-square'>
                                    <Image
                                        src={product.images?.[0] || '/placeholder.jpg'}
                                        alt={product.name || 'Product image'}
                                        fill
                                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                                    />
                                </div>
                            </Link>
                            {/* Remove button on hover */}
                            <div className='absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                <Button
                                    onClick={() => handleRemoveFromWishlist(product)}
                                    variant='ghost'
                                    className='w-full text-red-600 hover:bg-red-50'>
                                    <Heart className='h-4 w-4 mr-2 fill-current' />
                                    Remove
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className='p-4 flex flex-col gap-3'>
                            <h3 className='font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors'>
                                <Link href={`/products/${product._id}`}>{product.name}</Link>
                            </h3>
                            <div className='flex items-center gap-2'>
                                <span className='text-xl font-bold text-gray-900'>${product.price}</span>
                                {product.originalPrice && (
                                    <span className='text-sm text-gray-500 line-through'>${product.originalPrice}</span>
                                )}
                            </div>
                            <Button
                                onClick={() => handleCart(product)}
                                className='w-full bg-gray-900 hover:bg-gray-900 text-white transition-colors'
                                disabled={loading || !product.inStock}
                                aria-label={`Add ${product.name} to cart`}>
                                <ShoppingCart className='h-4 w-4 mr-2' />
                                Add to Cart
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
