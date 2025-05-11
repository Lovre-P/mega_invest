import { NextRequest, NextResponse } from 'next/server';
import { getInvestmentById, updateInvestment } from '@/lib/db';

/**
 * PUT /api/investments/[id]/images/main
 * Set the main image for an investment
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  // Get the investment
  const investment = getInvestmentById(id);
  
  if (!investment) {
    return NextResponse.json(
      { error: 'Investment not found' },
      { status: 404 }
    );
  }
  
  try {
    // Parse the request body
    const { imageId } = await request.json();
    
    if (!imageId) {
      return NextResponse.json(
        { error: 'No image ID provided' },
        { status: 400 }
      );
    }
    
    // Verify that the image exists in the investment's images
    const images = investment.images || [];
    const imageExists = images.some(img => img.includes(imageId));
    
    if (!imageExists) {
      return NextResponse.json(
        { error: 'Image not found in this investment' },
        { status: 404 }
      );
    }
    
    // Update the investment with the new main image
    const success = updateInvestment(id, {
      mainImageId: imageId
    });
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update main image' },
        { status: 500 }
      );
    }
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting main image:', error);
    return NextResponse.json(
      { error: 'Failed to set main image' },
      { status: 500 }
    );
  }
}
