'use client'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Toaster, toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio'
import { Separator } from '../ui/separator'
import { CheckCircle, Truck, CreditCard, Phone, ShoppingBag, User, Calendar, Mail, MapPin, Shield, AlertCircle } from 'lucide-react'
import Payment from './Payment'
import { Button } from "@/components/ui/button"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Checkout() {
    const [loading, setLoading] = useState(false)
    const [showPayment, setShowPayment] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        deliveryMethod: '',
        paymentMethod: '',
        paymentTime: ''
    })

    const router = useRouter()
    const cartItems = useSelector((state) => state.cart.items)
    const { data: session, status } = useSession()

    // Form validation states
    const [touched, setTouched] = useState({})
    const [errors, setErrors] = useState({})
    const [formComplete, setFormComplete] = useState(false)

    // Redirect unauthenticated users
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/checkout')
            toast.error('Please log in to proceed to checkout')
        }
    }, [status, router])

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryFee = formData.deliveryMethod === 'Express' ? 2500 : formData.deliveryMethod === 'Standard' ? 1500 : 0
    const tax = subtotal * 0.10
    const total = subtotal + deliveryFee + tax

    // Check if form is disabled (not authenticated)
    const isFormDisabled = status !== 'authenticated'

    // Validate form fields
    useEffect(() => {
        const validateForm = () => {
            const newErrors = {}
            if (touched.name && !formData.name) newErrors.name = 'Name is required'
            if (touched.email) {
                if (!formData.email) {
                    newErrors.email = 'Email is required'
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Please enter a valid email'
                }
            }
            if (touched.phone && !formData.phone) newErrors.phone = 'Phone number is required'
            if (touched.address && !formData.address) newErrors.address = 'Address is required'

            setErrors(newErrors)

            // Check if form is complete
            const isComplete =
                formData.name &&
                formData.email &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
                formData.phone &&
                formData.address &&
                formData.deliveryMethod &&
                formData.paymentMethod &&
                formData.paymentTime

            setFormComplete(isComplete)
        }

        validateForm()
    }, [formData, touched])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setTouched((prev) => ({ ...prev, [name]: true }))
    }

    const handleBlur = (e) => {
        const { name } = e.target
        setTouched((prev) => ({ ...prev, [name]: true }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check authentication first
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/checkout');
            toast.error('Please log in to continue with checkout');
            return;
        }

        if (status === 'loading') {
            toast.loading('Checking authentication...');
            return;
        }

        // Validate all fields are touched
        const allFields = {
            name: true,
            email: true,
            phone: true,
            address: true,
        };
        setTouched(allFields);

        if (!formComplete) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        setLoading(true);

        try {
            // Prepare order data
            const orderData = {
                userId: session?.user?.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                deliveryMethod: formData.deliveryMethod,
                paymentMethod: formData.paymentMethod,
                paymentTime: formData.paymentTime,
                orderItems: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || item.images?.[0] || '/placeholder.jpg'
                })),
                totalAmount: total,
                status: formData.paymentTime === 'Pay Now' ? 'Pending Payment' : 'Processing'
            };

            // Handle different payment flows
            if (formData.paymentTime === 'Pay Now') {
                // Show payment modal for immediate payment
                setShowPayment(true);
            } else {
                // For Pay On Delivery, create the order directly
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to create order');
                }

                // Success - redirect to order confirmation
                toast.success('Order placed successfully!', {
                    description: 'Your order is being processed',
                    duration: 5000,
                });
                router.push(`/orders/${data.order._id}`);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentResult) => {
        setLoading(true);
        try {
            // Prepare order data with payment info
            const orderData = {
                userId: session?.user?.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                deliveryMethod: formData.deliveryMethod,
                paymentMethod: formData.paymentMethod,
                paymentTime: formData.paymentTime,
                paymentResult: paymentResult,
                orderItems: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || item.images?.[0] || '/placeholder.jpg'
                })),
                totalAmount: total,
                status: 'Processing'
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create order after payment');
            }

            // Success - redirect to order confirmation
            toast.success('Payment and order completed successfully!', {
                description: 'Thank you for your purchase!',
                duration: 5000,
            });
            router.push(`/orders/${data.order._id}`);
        } catch (error) {
            console.error('Payment success error:', error);
            toast.error(error.message || 'Failed to complete order after payment');
        } finally {
            setLoading(false);
            setShowPayment(false);
        }
    };

    if (status !== 'authenticated') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Please sign in to checkout</h2>
                    <p className="text-muted-foreground mb-6">You need to be logged in to complete your purchase</p>
                    <Button
                        onClick={() => router.push('/login?callbackUrl=/checkout')}
                        className="w-full"
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 py-8 px-4 relative overflow-hidden">
            <Toaster position="top-center" richColors />
            <Payment
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                onPaymentSuccess={handlePaymentSuccess}
                orderData={{
                    total,
                    customerInfo: formData,
                    items: cartItems
                }}
                paymentMethod={formData.paymentMethod}
            />

            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Complete Your Purchase</h1>
                    <p className="text-muted-foreground mt-2">Review your order and enter your details</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form Sections */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}>
                            <Card className="border-0 shadow-2xl bg-card/90 backdrop-blur-xl overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl text-foreground">Customer Information</CardTitle>
                                            <CardDescription className="text-muted-foreground">Please fill in required details</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 gap-5">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-semibold text-foreground/90 tracking-wide flex items-center gap-2">
                                                    Full Name
                                                </label>
                                                <div className="relative group">
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        disabled={isFormDisabled}
                                                        className={`pl-10 h-12 border-0 bg-muted/40 focus:bg-background/80 transition-all duration-300 focus:ring-2 focus:ring-primary/30 rounded-xl text-base shadow-sm hover:shadow-md ${touched.name && errors.name ? 'focus:ring-red-500/30' : ''
                                                            }`}
                                                        placeholder="John Doe"
                                                        required
                                                    />
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                                </div>
                                                {touched.name && errors.name && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="text-xs text-red-500 flex items-center gap-1 mt-1"
                                                    >
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.name}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-semibold text-foreground/90 tracking-wide flex items-center gap-2">
                                                Email
                                            </label>
                                            <div className="relative group">
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    disabled={isFormDisabled}
                                                    className={`pl-10 h-12 border-0 bg-muted/40 focus:bg-background/80 transition-all duration-300 focus:ring-2 focus:ring-primary/30 rounded-xl text-base shadow-sm hover:shadow-md ${touched.email && errors.email ? 'focus:ring-red-500/30' : ''
                                                        }`}
                                                    placeholder="your.email@example.com"
                                                    required
                                                />
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                            </div>
                                            {touched.email && errors.email && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="text-xs text-red-500 flex items-center gap-1 mt-1"
                                                >
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.email}
                                                </motion.p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-semibold text-foreground/90 tracking-wide flex items-center gap-2">
                                                Phone Number
                                            </label>
                                            <div className="relative group">
                                                <Input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    disabled={isFormDisabled}
                                                    className={`pl-10 h-12 border-0 bg-muted/40 focus:bg-background/80 transition-all duration-300 focus:ring-2 focus:ring-primary/30 rounded-xl text-base shadow-sm hover:shadow-md ${touched.phone && errors.phone ? 'focus:ring-red-500/30' : ''
                                                        }`}
                                                    placeholder="+254 700 000 000"
                                                    required
                                                />
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                            </div>
                                            {touched.phone && errors.phone && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="text-xs text-red-500 flex items-center gap-1 mt-1"
                                                >
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.phone}
                                                </motion.p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="address"
                                                className="text-sm font-semibold text-foreground/90 tracking-wide flex items-center gap-2"
                                            >
                                                Delivery Address
                                            </label>
                                            <div className="relative group">
                                                <Input
                                                    id="address"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    disabled={isFormDisabled}
                                                    className={`pl-10 h-12 border-0 bg-muted/40 focus:bg-background/80 transition-all duration-300 focus:ring-2 focus:ring-primary/30 rounded-xl text-base shadow-sm hover:shadow-md ${touched.address && errors.address ? 'focus:ring-red-500/30' : ''
                                                        }`}
                                                    placeholder="4th St, Paradise Apartment 4B"
                                                    required
                                                />
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                            </div>
                                            {touched.address && errors.address && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="text-xs text-red-500 flex items-center gap-1 mt-1"
                                                >
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.address}
                                                </motion.p>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Delivery Options Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}>
                            <Card className="border-0 shadow-2xl bg-card/90 backdrop-blur-xl overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Truck className="h-5 w-5 text-gray-900" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl text-foreground">Delivery Options</CardTitle>
                                            <CardDescription className="text-muted-foreground">
                                                Choose your preferred delivery method
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <RadioGroup
                                        value={formData.deliveryMethod}
                                        onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        disabled={isFormDisabled || loading}
                                    >
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <label
                                                htmlFor="standard"
                                                className={`flex flex-col p-5 border rounded-xl cursor-pointer transition-all ${formData.deliveryMethod === 'Standard'
                                                    ? 'border-primary/20 bg-primary/10'
                                                    : 'border-border/60 bg-muted/20 hover:border-primary/40'
                                                    }`}
                                            >
                                                <div className="flex items-start">
                                                    <RadioGroupItem value="Standard" id="standard" className="mt-1" disabled={isFormDisabled} />
                                                    <div className="ml-3">
                                                        <span className="font-medium text-foreground">Standard Delivery</span>
                                                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                                            <span>3-5 business days</span>
                                                        </div>
                                                        <p className="text-sm font-medium mt-3 text-primary">KES 1,500</p>
                                                    </div>
                                                </div>
                                            </label>
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <label
                                                htmlFor="express"
                                                className={`flex flex-col p-5 border rounded-xl cursor-pointer transition-all ${formData.deliveryMethod === 'Express'
                                                    ? 'border-primary/20 bg-primary/10'
                                                    : 'border-border/60 bg-muted/20 hover:border-primary/40'
                                                    }`}
                                            >
                                                <div className="flex items-start">
                                                    <RadioGroupItem value="Express" id="express" className="mt-1" disabled={isFormDisabled} />
                                                    <div className="ml-3">
                                                        <span className="font-medium text-foreground">Express Delivery</span>
                                                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                                            <span>1-2 business days</span>
                                                        </div>
                                                        <p className="text-sm font-medium mt-3 text-primary">KES 2,500</p>
                                                    </div>
                                                </div>
                                            </label>
                                        </motion.div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Payment Method Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <Card className="border-0 shadow-2xl bg-card/90 backdrop-blur-xl overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <CreditCard className="h-5 w-5 text-gray-900" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl text-foreground">Payment Method</CardTitle>
                                            <CardDescription className="text-muted-foreground">Select how you'd like to pay</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <RadioGroup
                                        value={formData.paymentMethod}
                                        onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        disabled={isFormDisabled || loading}
                                    >
                                        {/* Card Payment Option */}
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <div
                                                className={`flex flex-col p-5 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'Card'
                                                    ? 'border-primary/20 bg-primary/10'
                                                    : 'border-border/60 bg-muted/20 hover:border-primary/40'
                                                    }`}
                                            >
                                                <label htmlFor="card" className="flex items-start cursor-pointer">
                                                    <RadioGroupItem value="Card" id="card" className="mt-1" disabled={isFormDisabled} />
                                                    <div className="ml-3">
                                                        <span className="font-medium text-foreground">Credit/Debit Card</span>
                                                        <p className="text-sm text-muted-foreground mt-1">Pay securely with your card</p>
                                                        <div className="flex space-x-2 mt-3">
                                                            <div className="px-2 py-1 bg-muted rounded flex items-center justify-center text-xs text-foreground/80 border border-border">
                                                                VISA
                                                            </div>
                                                            <div className="px-2 py-1 bg-muted rounded flex items-center justify-center text-xs text-foreground/80 border border-border">
                                                                DISCOVER
                                                            </div>
                                                            <div className="px-2 py-1 bg-muted rounded flex items-center justify-center text-xs text-foreground/80 border border-border">
                                                                MASTERCARD
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </motion.div>

                                        {/* M-Pesa Payment Option */}
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <div
                                                className={`flex flex-col p-5 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'Mpesa'
                                                    ? 'border-primary/20 bg-primary/10'
                                                    : 'border-border/60 bg-muted/20 hover:border-primary/40'
                                                    }`}
                                            >
                                                <label htmlFor="mpesa" className="flex items-start cursor-pointer">
                                                    <RadioGroupItem value="Mpesa" id="mpesa" className="mt-1" disabled={isFormDisabled} />
                                                    <div className="ml-3">
                                                        <span className="font-medium text-foreground">M-Pesa</span>
                                                        <p className="text-sm text-muted-foreground mt-1">Pay using M-Pesa mobile money</p>
                                                        <div className="px-3 py-1 bg-[#1a7f36] rounded mt-3 inline-flex items-center justify-center text-xs text-white font-medium">
                                                            M-PESA
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </motion.div>
                                    </RadioGroup>

                                    {/* Payment timing options */}
                                    <RadioGroup
                                        value={formData.paymentTime}
                                        onValueChange={(value) => setFormData({ ...formData, paymentTime: value })}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
                                        disabled={isFormDisabled || loading}>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <div
                                                className={`flex flex-col p-5 border rounded-xl cursor-pointer transition-all ${formData.paymentTime === 'Pay Now'
                                                    ? 'border-primary/20 bg-primary/10'
                                                    : 'border-border/60 bg-muted/20 hover:border-primary/40'
                                                    }`}>
                                                <label htmlFor="pay-now" className="flex items-start cursor-pointer">
                                                    <RadioGroupItem value="Pay Now" id="pay-now" className="mt-1" disabled={isFormDisabled} />
                                                    <div className="ml-3">
                                                        <span className="font-medium text-foreground">Pay Now</span>
                                                        <p className="text-sm text-muted-foreground mt-1">Make instant payment</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <div
                                                className={`flex flex-col p-5 border rounded-xl cursor-pointer transition-all ${formData.paymentTime === 'Pay On Delivery'
                                                    ? 'border-primary/20 bg-primary/10'
                                                    : 'border-border/60 bg-muted/20 hover:border-primary/40'
                                                    }`}
                                            >
                                                <label htmlFor="pay-on-delivery" className="flex items-start cursor-pointer">
                                                    <RadioGroupItem value="Pay On Delivery" id="pay-on-delivery" className="mt-1" disabled={isFormDisabled} />
                                                    <div className="ml-3">
                                                        <span className="font-medium text-foreground">Pay On Delivery</span>
                                                        <p className="text-sm text-muted-foreground mt-1">Make payment on goods delivery</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </motion.div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="sticky top-6">
                            <Card className="border-0 shadow-2xl bg-card/90 backdrop-blur-xl overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <ShoppingBag className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl text-foreground">Order Summary</CardTitle>
                                            <CardDescription className="text-muted-foreground">
                                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="space-y-5">
                                        <div className="max-h-80 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                            {cartItems.length === 0 ? (
                                                <p className="text-center text-muted-foreground py-4">Your cart is empty</p>
                                            ) : (
                                                <AnimatePresence>
                                                    {cartItems.map((item, index) => (
                                                        <motion.div
                                                            key={item.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="flex gap-4 p-3 rounded-lg bg-muted/20 border border-border/60 hover:border-primary/40 transition-all duration-200">
                                                            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0 border border-border relative">
                                                                {item.image || item.images?.[0] ? (
                                                                    <Image
                                                                        src={item.image || item.images[0]}
                                                                        alt={item.name}
                                                                        className="object-cover"
                                                                        fill
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium line-clamp-2 text-foreground">{item.name}</p>
                                                                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                                                    <span className="px-2 py-0.5 bg-muted rounded-full text-xs border border-border">
                                                                        Qty: {item.quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-medium text-primary">
                                                                    KES {(item.price * item.quantity).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            )}
                                        </div>

                                        <div className="p-4 rounded-lg bg-muted/20 border border-border/60 space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span className="text-foreground">KES {subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">VAT (10%)</span>
                                                <span className="text-foreground">KES {tax.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Delivery</span>
                                                <span className="text-foreground">KES {deliveryFee.toLocaleString()}</span>
                                            </div>
                                            <Separator className="bg-border/60" />
                                            <div className="flex justify-between font-medium text-lg pt-2">
                                                <span className="text-foreground">Total</span>
                                                <span className="text-primary">KES {total.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {status !== 'authenticated' ? (
                                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-center">
                                                <p>You need to sign in to complete your order</p>
                                                <Button
                                                    onClick={() => router.push('/login?callbackUrl=/checkout')}
                                                    className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white w-full"
                                                >
                                                    Sign In
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={handleSubmit}
                                                className="w-full h-14 bg-gray-900 text-white border-gray-500 font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl rounded-xl"
                                                disabled={loading || cartItems.length === 0 || !formComplete || status !== 'authenticated'}
                                            >
                                                {loading ? (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-5 h-5 border border-gray-900 border-t-primary-foreground rounded-full animate-spin"></div>
                                                        <span>Processing...</span>
                                                    </div>
                                                ) : (
                                                    "Complete Order"
                                                )}
                                            </Button>
                                        )}

                                        <div className="flex flex-col space-y-3 mt-4">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                                                <span>Free returns within 30 days</span>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Truck className="h-4 w-4 mr-2 text-primary" />
                                                <span>Delivery tracking included</span>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Shield className="h-4 w-4 mr-2 text-primary" />
                                                <span>Secure payment processing</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-muted-foreground text-center">
                                            By completing your order, you agree to our Terms of Service and Privacy Policy.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    )
}