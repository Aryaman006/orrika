import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req) {
  try {
    const { paths } = await req.json(); // Extract paths from request body

    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ error: 'Invalid paths' }, { status: 400 });
    }

    // Trigger revalidation for each path
    await Promise.all(paths.map(path => revalidatePath(path)));

    return NextResponse.json({ message: `Revalidation triggered for ${paths.length} paths successfully` });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
