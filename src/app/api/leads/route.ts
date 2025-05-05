import { NextRequest, NextResponse } from 'next/server';
import { getLeads, createLead } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const leads = getLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const lead = await request.json();
    
    // Validate required fields
    if (!lead.name || !lead.email || !lead.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const success = createLead(lead);
    
    if (success) {
      return NextResponse.json(
        { message: 'Lead created successfully' },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
