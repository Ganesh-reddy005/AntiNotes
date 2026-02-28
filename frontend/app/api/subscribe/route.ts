import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Subscriber from '@/models/Subscriber';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    // 1. Basic Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // 2. Check for Duplicates
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: "You're already on the list!" }, { status: 200 });
    }

    // 3. Create Subscriber
    await Subscriber.create({ email });

    return NextResponse.json({ success: true, message: "Welcome to the beta." }, { status: 201 });

  } catch (error) {
    console.error('Subscribe Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}