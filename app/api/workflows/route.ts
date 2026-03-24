import { NextResponse } from 'next/server';
import { createWorkflow, getWorkflows } from '@/lib/demo-store';

const DEMO_USER_ID = 'demo-user-123';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const workflow = createWorkflow(body);
    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}

export async function GET(_request: Request) {
  try {
    const workflows = getWorkflows(DEMO_USER_ID);
    return NextResponse.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}
