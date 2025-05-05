import { NextRequest, NextResponse } from 'next/server';
import { getInvestments, createInvestment } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const investments = getInvestments();
    
    // Handle query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const risk = searchParams.get('risk');
    
    let filteredInvestments = investments;
    
    if (category) {
      filteredInvestments = filteredInvestments.filter(
        (investment: any) => investment.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (status) {
      filteredInvestments = filteredInvestments.filter(
        (investment: any) => investment.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    if (risk) {
      filteredInvestments = filteredInvestments.filter(
        (investment: any) => investment.risk.toLowerCase() === risk.toLowerCase()
      );
    }
    
    return NextResponse.json({ investments: filteredInvestments });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const investment = await request.json();
    
    // Validate required fields
    if (!investment.title || !investment.description || !investment.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const success = createInvestment(investment);
    
    if (success) {
      return NextResponse.json(
        { message: 'Investment created successfully' },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to create investment' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating investment:', error);
    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    );
  }
}
