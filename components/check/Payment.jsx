"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { X, Phone, Truck, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { toast } from "sonner"

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess, orderData, paymentMethod }) {
    const [selectedMethod, setSelectedMethod] = useState(
        paymentMethod === "Mpesa" ? "mpesa" : "pay_on_delivery"
    )
    const [phoneNumber, setPhoneNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState("idle")

    const handlePayment = async () => {
        if (selectedMethod === "mpesa" && (!phoneNumber || phoneNumber.length < 10)) {
            toast.error("Please enter a valid M-Pesa phone number")
            return
        }
        setLoading(true)
        setPaymentStatus("processing")

        try {
            if (selectedMethod === "mpesa") {
                const res = await fetch('http://localhost:3001/api/mpesa', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phone: phoneNumber.replace(/\D/g, ""),
                        amount: orderData.total,
                    })
                })
            }

            if (res.ok) {
                setPaymentStatus("success");
                toast.success(
                    selectedMethod === "mpesa"
                        ? "Payment initiated! Check your phone for M-Pesa prompt"
                        : "Order confirmed! Payment will be collected on delivery"
                );
            }

            // onPaymentSuccess({
            //     method: selectedMethod,
            //     amount: orderData.total,
            //     transactionId: selectedMethod === "mpesa" ? `MPESA-${Date.now()}` : null,
            //     phoneNumber: selectedMethod === "mpesa" ? phoneNumber : null
            // })

            setTimeout(onClose, 3000)
        } catch (error) {
            setPaymentStatus("error")
            toast.error("Payment failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white border-0 shadow-2xl rounded-xl max-w-md w-full mx-4 overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                {/* Header */}
                <div className="p-6 border-b border-border/60">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-foreground">
                            Complete Payment
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-muted transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Total: KES {orderData.total.toLocaleString()}
                    </p>
                </div>

                {/* Payment Content */}
                <div className="p-6 space-y-6">
                    {/* Payment Method Selection */}
                    <RadioGroup
                        value={selectedMethod}
                        onValueChange={setSelectedMethod}
                        className="space-y-4"
                        disabled={loading}>
                        {/* M-Pesa Option */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <div
                                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedMethod === "mpesa"
                                    ? 'border-primary/20 bg-gray-100'
                                    : 'border-border/60 bg-gray-50 hover:border-primary/40'
                                    }`}
                            >
                                <RadioGroupItem
                                    value="mpesa"
                                    id="mpesa"
                                    className="text-green-600"
                                />
                                <label htmlFor="mpesa" className="flex-1 cursor-pointer ml-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-green-600/10">
                                            <Phone className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Pay with M-Pesa</p>
                                            <p className="text-sm text-muted-foreground">Instant mobile payment</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </motion.div>

                        {/* Pay on Delivery Option */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <div
                                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedMethod === "pay_on_delivery"
                                    ? 'border-primary/20 bg-gray-100'
                                    : 'border-border/60 bg-gray-50 hover:border-primary/40'
                                    }`}
                            >
                                <RadioGroupItem
                                    value="pay_on_delivery"
                                    id="pay_on_delivery"
                                    className="text-green-600"
                                />
                                <label htmlFor="pay_on_delivery" className="flex-1 cursor-pointer ml-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-green-600/10">
                                            <Truck className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Pay on Delivery</p>
                                            <p className="text-sm text-muted-foreground">Cash payment when order arrives</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </motion.div>
                    </RadioGroup>

                    {/* M-Pesa Phone Number Input */}
                    {selectedMethod === "mpesa" && (
                        <div className="space-y-3">
                            <label htmlFor="mpesa-phone" className="text-sm font-semibold text-foreground/90 tracking-wide">
                                M-Pesa Phone Number
                            </label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                <Input
                                    id="mpesa-phone"
                                    type="tel"
                                    placeholder="254712345678"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="pl-10 h-12 border-0 bg-muted/40 focus:bg-background/80 transition-all duration-300 focus:ring-2 focus:ring-primary/30 rounded-xl text-base shadow-sm hover:shadow-md"
                                    disabled={loading}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Enter your Safaricom M-Pesa registered number
                            </p>
                        </div>
                    )}

                    {/* Pay on Delivery Info */}
                    {selectedMethod === "pay_on_delivery" && (
                        <Card className="bg-muted/20 border-border/60 rounded-xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-foreground flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Truck className="w-5 h-5 text-primary" />
                                    </div>
                                    Pay on Delivery
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <p className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        Payment will be collected when your order is delivered
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        Cash payment accepted
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        Please have exact amount ready
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        Delivery fee may apply
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Payment Status Messages */}
                    {paymentStatus === "processing" && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500 text-sm flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing payment... Please wait
                        </div>
                    )}

                    {paymentStatus === "success" && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Payment successful! Your order is being processed.
                        </div>
                    )}
                </div>

                {/* Footer with Action Buttons */}
                <div className="p-6 border-t border-border/60 bg-card">
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 border-border/60 hover:bg-muted/60 hover:border-border transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-sm hover:shadow-md"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePayment}
                            disabled={
                                loading ||
                                (selectedMethod === "mpesa" && !phoneNumber)
                            }
                            className="flex-1 h-12 bg-gray-900 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl rounded-xl"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-3">
                                    <Loader2 className="w-5 h-5 border border-gray-600 border-t-gray-600 rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </div>
                            ) : selectedMethod === "mpesa" ? (
                                "Pay with M-Pesa"
                            ) : (
                                "Confirm Order"
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}