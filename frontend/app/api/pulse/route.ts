import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PulseVote from '@/models/PulseVote';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { category } = await req.json();

    // 1. Validation
    if (!['logic', 'syntax'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // 2. Create Vote
    await PulseVote.create({ category });

    // 3. Get Updated Counts (to show the user live results)
    const logicCount = await PulseVote.countDocuments({ category: 'logic' });
    const syntaxCount = await PulseVote.countDocuments({ category: 'syntax' });

    return NextResponse.json({ 
      success: true, 
      counts: { logic: logicCount, syntax: syntaxCount } 
    });

  } catch (error) {
    console.error('Pulse Vote Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Optional: GET endpoint to load initial stats
export async function GET() {
  try {
    await connectDB();
    const logicCount = await PulseVote.countDocuments({ category: 'logic' });
    const syntaxCount = await PulseVote.countDocuments({ category: 'syntax' });

    return NextResponse.json({ logic: logicCount, syntax: syntaxCount });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}