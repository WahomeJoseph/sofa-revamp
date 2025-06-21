'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LogOut, User, ShoppingBag } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { Separator } from '../ui/separator';

export default function AccountNav() {
    const { data: session } = useSession();
    const router = useRouter();

    const avatarFallback =
        session?.user?.username?.charAt(0)?.toUpperCase() ||
        session?.user?.email?.charAt(0)?.toUpperCase() ||
        'User'

    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false });
            toast.success('Signed out successfully');
            router.push('/');
        } catch (error) {
            toast.error('Could not sign out');
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 relative">
            <Toaster position="top-center" richColors />

            {session ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='ghost'
                            className='flex items-center gap-3 p-2 rounded-full focus:ring-1 focus:ring-gray-900 transition-all duration-200'>
                            <Avatar className='h-9 w-9'>
                                <AvatarImage src={session.user?.image || undefined} alt={session.user?.username || 'User'} />
                                <AvatarFallback className='bg-gray-900 text-white font-semibold text-lg'>
                                    {avatarFallback}
                                </AvatarFallback>
                            </Avatar>
                            <span className='text-sm font-medium hidden md:block'>
                                {session.user?.username || session.user?.email?.split('@')[0] || 'User'}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-56 p-1.5 bg-white shadow-xl border border-gray-100 rounded-xl mt-2 animate-fade-in">
                        <div className="px-3 py-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {session.user?.username || 'My Account'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {session.user?.email}
                            </p>
                        </div>

                        <Separator className="bg-gray-100 my-1" />

                        <DropdownMenuItem asChild>
                            <Link
                                href="/account"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200/20 rounded-md transition-colors duration-200">
                                <User className="h-4 w-4 text-gray-900" />
                                Profile
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link
                                href="/orders"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200/20 rounded-md transition-colors duration-200">
                                <ShoppingBag className="h-4 w-4 text-gray-900" />
                                Orders
                            </Link>
                        </DropdownMenuItem>

                        <Separator className="bg-gray-100 my-1" />

                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-700/20 rounded-md transition-colors duration-200">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex justify-center items-center gap-2">
                    <Link
                        href="/login"
                        className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200">
                        <User className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors duration-200" />
                    </Link>
                </div>
            )}
        </div>
    );
}