import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    userEmail: { type: String, required: false },
    orderNumber: {
        type: String,
        unique: true,
        default: () => {
            const date = new Date();
            return `ORD-${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}${date.getDate()
            .toString().padStart(2, '0')}-${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`;
        }
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    deliveryMethod: {
        type: String,
        enum: ['Standard', 'Express'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Mpesa'],
        required: true
    },
    paymentTime: {
        type: String,
        enum: ['Pay Now', 'Pay On Delivery'],
        required: true
    },
    orderItems: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                required: true,
                ref: 'Product' 
            },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);