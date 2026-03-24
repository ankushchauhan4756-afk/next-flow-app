import { NextResponse } from 'next/server';
import crypto from 'crypto';

const DEMO_USER_ID = 'demo-user-123';
const TRANSLOADIT_KEY = process.env.NEXT_PUBLIC_TRANSLOADIT_KEY;
const TRANSLOADIT_SECRET = process.env.TRANSLOADIT_SECRET;

export async function POST(request: Request) {
  try {
    const userId = DEMO_USER_ID; // Demo mode
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filename, filesize, filetype } = await request.json();

    if (!TRANSLOADIT_KEY || !TRANSLOADIT_SECRET) {
      throw new Error('Transloadit credentials not configured');
    }

    // Create assembly request
    const params = {
      auth: {
        key: TRANSLOADIT_KEY,
      },
      steps: {
        upload: {
          robot: '/upload/handle',
        },
        store: {
          use: 'upload',
          robot: '/store/aws/s3',
          credentials: 'awsS3',
          path: `nextflow/${userId}/${filename}`,
        },
      },
      expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    };

    // Sign the assembly
    const signature = crypto
      .createHmac('sha384', TRANSLOADIT_SECRET)
      .update(JSON.stringify(params))
      .digest('base64');

    const response = await fetch('https://api2.transloadit.com/assemblies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        signature,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize Transloadit assembly');
    }

    const data = await response.json();

    return NextResponse.json({
      assembly_id: data.assembly_id,
      assembly_url: data.assembly_url,
      upload_url: data.uploads_url,
    });
  } catch (error) {
    console.error('Error initializing upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize upload' },
      { status: 500 }
    );
  }
}
