import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    service: { 
        type: String, 
        enum: ['Sofa Revamp', 'Custom Sofa Design', 'Sofa Cleaning'],
        required: true 
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String, required: true },
    preferredContact: { 
        type: String, 
        enum: ['email', 'phone', 'whatsapp'],
        required: true, 
        default: 'email' 
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);