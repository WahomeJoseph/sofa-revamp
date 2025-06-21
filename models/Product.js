import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: [
      "L-Shaped",
      "U-Shaped",
      "Recliner",
      "Sofa Bed",
      "Loveseat",
      "Stationary",
      "Corner",
      "Single-Seater",
      "Chesterfield",
      "Modular",
    ],
    required: true,
  },
  images: [{ type: String }],
  material: {
    type: String,
    enum: ["Leather", "Fabric", "Velvet", "Microfiber", "Wood", "Metal"],
    required: true,
  },
  colors: [{ type: String }],
  seatingCapacity: { type: Number, required: true },
  features: [{ type: String }],
  stockQuantity: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  brand: { type: String },
  warranty: { type: String },
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models?.Product || mongoose.model("Product", ProductSchema);
export const Reviews = mongoose.models?.Reviews || mongoose.model("Reviews", reviewSchema);