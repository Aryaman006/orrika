import crypto from 'crypto';
import { databases } from '../../../context/appwrite';

export async function POST(req) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, user, products, total, shippingAddress } = await req.json();

    // Extract productId, color, and size from each product
    const productDetails = products.map(product =>
      JSON.stringify({
        productId: product.productId,
        color: product.variant.color,
        size: product.variant.size,
        quantity: product.quantity,
        image: product.post[0]
    }));

    const generated_signature = crypto.createHmac('sha256', process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Store order details in Appwrite
      const order = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_ORDERS_ID,
        crypto.randomUUID(), // Use a unique ID for the order
        {
          user: user,
          products: productDetails, // Store productId, color, size, and quantity
          totalPrice: total,
          status: 'completed',
          paymentStatus: 'paid',
          shippingAddress: shippingAddress,
        }
      );

      return new Response(JSON.stringify({ status: 'success', order }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ status: 'failure', message: 'Invalid signature' }), { status: 400 });
    }
  } catch (error) {
    console.error('Error storing order:', error);
    return new Response(JSON.stringify({ status: 'error', message: 'Order could not be saved' }), { status: 500 });
  }
}

export async function GET(req) {
  return new Response(JSON.stringify({ status: 'error', message: 'Method not allowed' }), { status: 405 });
}
