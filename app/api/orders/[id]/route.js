import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import Order from "@/models/Orders";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, email, phone, address, deliveryMethod, paymentMethod, paymentTime, orderItems, totalAmount } = body;

        // Validate required fields
        if (!name || !email || !phone || !address || !deliveryMethod || !paymentMethod || !paymentTime || !totalAmount) {
            return NextResponse.json({ message: "Please fill all the fields" }, { status: 400 });
        }

        // Validate order items
        if (!orderItems || orderItems.length === 0) {
            return NextResponse.json({ message: "Please add items to your cart" }, { status: 400 });
        }

        // Check if similar order already exists
        const existingOrder = await Order.findOne({
            email,
            phone,
            'orderItems': {
                $all: orderItems.map(item => ({
                    $elemMatch: {
                        productId: item.productId,
                        quantity: item.quantity
                    }
                }))
            },
            totalAmount
        });

        if (existingOrder) {
            return NextResponse.json(
                {
                    message: "An order with these details already exists.Proceed to create a new one.",
                    existingOrder: {
                        orderNumber: existingOrder.orderNumber,
                        _id: existingOrder._id,
                    }
                },
                { status: 409 }
            );
        }

        // Create new order if none exists
        const newOrder = await Order.create({
            name,
            email,
            phone,
            address,
            deliveryMethod,
            paymentMethod,
            paymentTime,
            orderItems,
            totalAmount,
            status: 'Processing'
        });

        return NextResponse.json(
            {
                message: "Order placed successfully",
                order: {
                    orderNumber: newOrder.orderNumber,
                    _id: newOrder._id,
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// get orders
export async function GET(request, { params }) {
  try {
    await connectDB();

    const orderId = await params.id;

    if (!orderId) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    const order = await Order.findById(orderId).lean();
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Order fetched successfully!',
      order,
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch order", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

