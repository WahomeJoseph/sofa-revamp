'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import AccountNav from '../sign/Account';
import { ThemeProvider } from '../theme/ThemeProvider';
import { ThemeToggle } from '../theme/ThemeToggle';
import Cart from '../products/Cart';
import { useSession } from 'next-auth/react';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const items = useSelector((state) => state.cart.items) || 0;

    const { data: session } = useSession();

    const wishlistItems = useSelector((state) => {
        const userId = session?.user?.id;
        if (userId) {
            return state.product?.userWishlists?.[userId]?.length || 0;
        }
        return state.product?.wishlist?.length || 0;
    });

    useEffect(() => {
        const totalItems = items.reduce((total, item) => total + item.quantity, 0)
        setCartCount(totalItems)
    }, [items])

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <ThemeProvider defaultTheme='light'>
            <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm'>
                <div className='absolute top-3 right-3 z-20'>
                    <ThemeToggle />
                </div>
                <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex h-16 items-center justify-between'>
                        {/* Logo Section */}
                        <div className='flex items-center ml-0'>
                            <a href='/' className='flex-shrink-0'>
                                <h1 className='text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-950 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-200'>
                                    SofaRevamp
                                </h1>
                            </a>
                        </div>

                        <nav className='hidden lg:flex items-center space-x-8 flex-1 justify-center'>
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className='text-sm font-medium text-gray-950 hover:text-gray-900 transition-colors duration-200 relative group'>
                                    {item.name}
                                    <span className='absolute inset-x-0 -bottom-1 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center'></span>
                                </a>
                            ))}
                        </nav>

                        <div className='flex items-center justify-center space-x-3 mr-0'>
                            {/* Wishlist */}
                            <Link
                                href='/wishlist'
                                className='relative flex justify-center items-center hover:bg-slate-100 transition-colors duration-200 rounded-full h-10 w-10'>
                                <Heart className='h-5 w-5 text-slate-600 hover:text-red-500 transition-colors duration-200' />
                                {wishlistItems > 0 && (
                                    <Badge className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500 hover:bg-red-600 text-white border-2 border-white'>
                                        {wishlistItems}
                                    </Badge>
                                )}
                            </Link>

                            {/* Cart */}
                            <Cart>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative flex justify-center items-center hover:bg-slate-100 transition-colors duration-200 rounded-full h-10 w-10">
                                    <ShoppingCart size={30} className='h-5 w-5 text-slate-600 hover:text-red-500 transition-colors duration-200' />
                                    {cartCount > 0 && (
                                        <Badge className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500 hover:bg-red-600 text-white border-2 border-white'>
                                            {cartCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Cart>
                            <div className='flex justify-center items-center'>
                                <AccountNav />
                            </div>

                            {/* Mobile Menu Trigger */}
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        className='lg:hidden hover:bg-slate-100 transition-colors duration-200 rounded-full h-10 w-10 ml-0'>
                                        <Menu className='h-5 w-5 text-slate-600' />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side='right' className='w-80 bg-white'>
                                    <div className='flex flex-col space-y-6 mt-8'>
                                        {/* Mobile Search */}
                                        {/* <div className='relative'>
                                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
                                        <Input
                                            placeholder='Search luxury sofas...'
                                            className='pl-10 rounded-full border-slate-200 bg-slate-50'
                                        />
                                    </div> */}

                                        {/* Mobile Navigation */}
                                        <nav className='flex flex-col space-y-4 pt-4 border-t border-slate-200'>
                                            {navigation.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className='text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-slate-50'
                                                    onClick={() => setIsMenuOpen(false)}>
                                                    {item.name}
                                                </a>
                                            ))}
                                        </nav>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>
        </ThemeProvider>
    );
}