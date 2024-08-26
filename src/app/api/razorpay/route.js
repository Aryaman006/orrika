import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { cart, totalAmount, shippingAddress } = await req.json();
    const amountInPaise = totalAmount * 100; // Convert amount to paise

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: crypto.randomUUID(),
    };

    const order = await razorpay.orders.create(options);
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ error: 'Error creating order' }), { status: 500 });
  }
}
