import { NextRequest, NextResponse } from 'next/server';
import { getInvestmentById, updateInvestment, deleteInvestment } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const investment = getInvestmentById(id);
    
    if (!investment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ investment });
  } catch (error) {
    console.error(`Error fetching investment with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch investment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updatedInvestment = await request.json();
    
    // Validate required fields
    if (!updatedInvestment.title || !updatedInvestment.description || !updatedInvestment.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const success = updateInvestment(id, updatedInvestment);
    
    if (success) {
      return NextResponse.json(
        { message: 'Investment updated successfully' }
      );
    } else {
      return NextResponse.json(
        { error: 'Investment not found or update failed' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error updating investment with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update investment' },
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
    const success = deleteInvestment(id);
    
    if (success) {
      return NextResponse.json(
        { message: 'Investment deleted successfully' }
      );
    } else {
      return NextResponse.json(
        { error: 'Investment not found or delete failed' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error deleting investment with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete investment' },
      { status: 500 }
    );
  }
}
