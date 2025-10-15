import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (2MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 2MB' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // send the blob URL to backend
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN || 'http://localhost:8080'}/user/profile-picture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Forward cookies from the original request
          'Cookie': request.headers.get('cookie') || '',
        },
        credentials: 'include',
        body: JSON.stringify({ url: blob.url }),
      }
    );

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();

    return NextResponse.json({ url: data.url || blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
