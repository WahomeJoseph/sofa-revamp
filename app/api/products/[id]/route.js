import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const { id } = await params

        let product;

        if (id) {
            product = await Product.findById(id);
        } else if (slug) {
            product = await Product.findOne({ slug });
        }

        if (!product) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}