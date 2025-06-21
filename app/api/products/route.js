import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, slug, description, price, category, images, material, colors, seatingCapacity,
            features, stockQuantity, inStock, brand, warranty, reviews } = body;
        // Validate required fields
        if (!name || !slug || !description || !price || !category || !images || !material || !colors || !seatingCapacity
            || !features || !stockQuantity || !inStock || !brand || !warranty || !reviews
        ) {
            return NextResponse.json({ message: 'Please fill all the required fields' }, { status: 400 });
        }
        const newProduct = await Product.create({
            name,
            slug,
            description,
            price,
            category,
            images,
            material,
            colors,
            seatingCapacity,
            features,
            stockQuantity,
            inStock,
            brand,
            warranty,
            reviews
        });
        return NextResponse.json(
            { 
                message: 'Product created successfully', 
                product: newProduct
             },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating product:', error.message);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// get all products
export async function GET() {
    try {
      await connectDB()
      const products = await Product.find().lean()
      return NextResponse.json(
        { message: 'Products fetched successfully', products },
        { status: 200 }
      )
    } catch (error) {
      console.error('GET error:', error)
      return NextResponse.json(
        { message: 'Internal server error', details: error.message },
        { status: 500 }
      )
    }
  }