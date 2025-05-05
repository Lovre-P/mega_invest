import { NextRequest, NextResponse } from 'next/server';
import { getLeadById, deleteLead } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const lead = getLeadById(id);
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ lead });
  } catch (error) {
    console.error(`Error fetching lead with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const success = deleteLead(id);
    
    if (success) {
      return NextResponse.json(
        { message: 'Lead deleted successfully' }
      );
    } else {
      return NextResponse.json(
        { error: 'Lead not found or delete failed' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error deleting lead with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
