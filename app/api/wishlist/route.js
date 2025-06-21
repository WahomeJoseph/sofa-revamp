import { auth } from "@/auth.config";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB()
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "User Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const userId = session.user.id
    const productId = await req.json()

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        wishlist: productId
      }
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add product to wishlist" },
      { status: 500 }
    );
  }
}

// get wishlist items
export async function GET() {
  await connectDB();
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "User Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const user = await User.findById(session.user.id).populate('wishlist');
    return NextResponse.json(
      { wishlist: user.wishlist },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// delete wishlist item
export async function DELETE(req) {
  await connectDB()
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "User Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const productId = await req.json()
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is missing" },
        { status: 400 }
      )
    }

    await User.findByIdAndUpdate(session?.user.id, {
      $pull: { wishlist: productId },
    })
    return NextResponse.json(
      {
        success: true,
        message: "Product removed from wishlist"
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove product from wishlist" },
      { status: 500 }
    );
  }
}