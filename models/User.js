import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: false },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: false },
    acceptTerms: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema)