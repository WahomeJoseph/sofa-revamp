'use client'

import React, { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet'
import { Button } from '../ui/button'
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Input } from '../ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { clearCart, removeFromCart, updateQuantity } from '@/lib/features/Productslice'
import { Separator } from '../ui/separator'

export default function Cart({ children }) {
    const [openCart, setOpenCart] = useState(false)
    const [cartCount, setCartCount] = useState([])
    const { pending } = useFormStatus()

    const dispatch = useDispatch()
    const items = useSelector((state) => state.cart?.items) || []

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    useEffect(() => {
        const totalItems = items.reduce((total, item) => total + item.quantity, 0)
        setCartCount(totalItems)
    }, [items])

    const handleUpdateQuantity = (id, quantity) => {
        if (quantity < 1) return
        dispatch(updateQuantity({ id, quantity: Number(quantity) }))
        toast.success("Item quantity has been updated", { duration: 3000, })
    }

    const handleRemoveItem = (id) => {
        console.log("Removing item with ID:", id)
        dispatch(removeFromCart(id))
        toast.success('Item removed from cart', { duration: 3000 })
    }

    const handleClearCart = () => {
        dispatch(clearCart())
        toast.success('Cart has been cleared!', { duration: 3000 })
    }

    return (
        <>
            <Sheet open={openCart} onOpenChange={setOpenCart}>
                <SheetTrigger asChild>
                    {children}
                </SheetTrigger>

                <SheetContent className="flex flex-col left-[50%] overflow-y-auto translate-x-[-50%] w-full max-w-[90vw] md:max-w-2xl lg:max-w-3xl rounded-lg top-[50%] translate-y-[-50%] shadow-xl h-[90vh] max-h-[800px] bg-white border border-amber-600/10 text-gray-900">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold">Your Shopping Cart ({cartCount})</SheetTitle>
                    </SheetHeader>

                    <Separator className="my-4 bg-gray-600/20" />

                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                            <ShoppingCart className="h-12 w-12 text-gray-800 mb-4" />
                            <p className="text-lg font-medium">Your cart is empty</p>
                            <p className="text-sm mb-6">Start shopping to add items</p>
                            <Button
                                asChild
                                onClick={() => setOpenCart(false)}
                                className="mt-4 bg-gray-900 text-white shadow-lg hover:bg-gray-950">
                                    <Link href='/shop'>Shop Now</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 overflow-y-auto py-4">
                                {items.map((item, index) => (
                                    <div
                                        key={`${item.id ?? item.name}-${item.addedAt ?? item.quantity}-${index}`}

                                        className="flex items-center gap-4 p-3 mb-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                                        {item.image && (
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-600">KES {item.price.toLocaleString()}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || pending}
                                                    className="h-8 w-10">
                                                    <Minus size={24} />
                                                </Button>
                                                <Input
                                                    min="1"
                                                    max={item.stockQuantity}
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleUpdateQuantity(item.id, Math.max(1, Math.min(item.stockQuantity, Number(e.target.value))))
                                                    }
                                                    className="w-16 h-8 text-center"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stockQuantity || pending}
                                                    className="h-8 w-10">
                                                    <Plus size={24} />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="font-medium text-gray-600">
                                                KES {(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-gray-600">Subtotal ({cartCount} items)</p>
                                    <p className="text-lg font-bold text-gray-700">
                                        KES {total.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleClearCart}
                                        className="flex-1 text-red-600 hover:bg-red-100">
                                        Clear Cart
                                    </Button>
                                    <Button
                                        asChild
                                        onClick={() => setOpenCart(false)}
                                        className="flex-1 bg-gray-900 hover:bg-gray-950 text-white">
                                        <Link href="/checkout">
                                            Proceed to Checkout
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}