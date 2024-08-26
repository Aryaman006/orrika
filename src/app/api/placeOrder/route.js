import { NextResponse } from 'next/server';
import { databases } from '../../../context/appwrite';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { userId, cart, total, shippingAddress, paymentMethod } = await req.json();

    // Format the shipping address to a single string within 50 characters
    const formattedAddress = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.pincode}, Ph: ${shippingAddress.phone}`;

    // Map cart items to product details as strings
    const productDetails = cart.map(item => JSON.stringify({
      productId: item.productId,
      color: item.variant.color,
      size: item.variant.size,
      quantity: item.quantity,
      image: item.imageUrl,
      price: item.variant.price || item.price
    }));
console.log(formattedAddress)
    // Create a unique ID for the order
    const orderId = crypto.randomUUID();

    // Save the order to Appwrite
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_ORDERS_ID,
      orderId, // Unique ID for the order
      {
        user: userId, // String
        products: productDetails, // String[] (Array of Strings)
        totalPrice: total, // Integer
        status: 'pending', // Enum (pending by default)
        paymentStatus: paymentMethod, // String
        shippingAddress: formattedAddress, // String (Max 50 characters)
      }
    );

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
