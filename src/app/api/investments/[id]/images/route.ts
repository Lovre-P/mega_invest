import { NextRequest, NextResponse } from 'next/server';
import { getInvestmentById, updateInvestment } from '@/lib/db';
import { saveImage, deleteImage } from '@/lib/image-utils';
import { Investment } from '@/lib/db-query';

/**
 * GET /api/investments/[id]/images
 * Get all images for an investment
 */
export async function GET(
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
  
  // Return the images
  return NextResponse.json({
    images: investment.images || [],
    mainImageId: investment.mainImageId || null
  });
}

/**
 * POST /api/investments/[id]/images
 * Upload a new image for an investment
 */
export async function POST(
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
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Save the image
    const imageMetadata = await saveImage(file, id);
    
    if (!imageMetadata) {
      return NextResponse.json(
        { error: 'Failed to save image' },
        { status: 500 }
      );
    }
    
    // Update the investment with the new image
    const images = investment.images || [];
    const updatedInvestment: Partial<Investment> = {
      images: [...images, imageMetadata.path]
    };
    
    // If this is the first image, set it as the main image
    if (images.length === 0 && !investment.mainImageId) {
      updatedInvestment.mainImageId = imageMetadata.id;
    }
    
    // Update the investment
    const success = updateInvestment(id, updatedInvestment);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update investment with new image' },
        { status: 500 }
      );
    }
    
    // Return the updated investment
    return NextResponse.json({
      success: true,
      image: imageMetadata
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/investments/[id]/images?filename=xxx
 * Delete an image from an investment
 */
export async function DELETE(
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
  
  // Get the filename from the query parameters
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  
  if (!filename) {
    return NextResponse.json(
      { error: 'No filename provided' },
      { status: 400 }
    );
  }
  
  // Extract the actual filename from the path
  const filenameOnly = filename.split('/').pop();
  
  if (!filenameOnly) {
    return NextResponse.json(
      { error: 'Invalid filename' },
      { status: 400 }
    );
  }
  
  // Delete the image
  const success = deleteImage(id, filenameOnly);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
  
  // Update the investment to remove the image
  const images = investment.images || [];
  const updatedImages = images.filter(img => !img.includes(filenameOnly));
  
  // Check if the main image was deleted
  let mainImageId = investment.mainImageId;
  if (mainImageId && filename.includes(mainImageId)) {
    mainImageId = updatedImages.length > 0 ? updatedImages[0].split('/').pop()?.split('.')[0] : undefined;
  }
  
  // Update the investment
  const updateSuccess = updateInvestment(id, {
    images: updatedImages,
    mainImageId
  });
  
  if (!updateSuccess) {
    return NextResponse.json(
      { error: 'Failed to update investment after deleting image' },
      { status: 500 }
    );
  }
  
  // Return success
  return NextResponse.json({ success: true });
}
