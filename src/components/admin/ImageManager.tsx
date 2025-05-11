"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { XMarkIcon, CheckCircleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface ImageManagerProps {
  investmentId: string;
  images: string[];
  mainImageId?: string;
  onImagesChange: (images: string[], mainImageId?: string) => void;
}

export default function ImageManager({ 
  investmentId, 
  images, 
  mainImageId, 
  onImagesChange 
}: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Validate file type and size
      const file = files[0];
      
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed');
        setIsUploading(false);
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setUploadError('File size exceeds the 5MB limit');
        setIsUploading(false);
        return;
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload the image
      const response = await fetch(`/api/investments/${investmentId}/images`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update the images list
      const newImages = [...images, data.image.path];
      const newMainImageId = mainImageId || data.image.id;
      
      onImagesChange(newImages, newMainImageId);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle image deletion
  const handleDeleteImage = async (imagePath: string) => {
    try {
      // Extract the filename from the path
      const filename = imagePath.split('/').pop();
      
      if (!filename) {
        throw new Error('Invalid image path');
      }
      
      // Delete the image
      const response = await fetch(`/api/investments/${investmentId}/images?filename=${encodeURIComponent(imagePath)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }
      
      // Update the images list
      const newImages = images.filter(img => img !== imagePath);
      
      // If the main image was deleted, set a new main image
      let newMainImageId = mainImageId;
      if (mainImageId && imagePath.includes(mainImageId)) {
        newMainImageId = newImages.length > 0 
          ? newImages[0].split('/').pop()?.split('.')[0] 
          : undefined;
      }
      
      onImagesChange(newImages, newMainImageId);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };
  
  // Handle setting main image
  const handleSetMainImage = async (imagePath: string) => {
    try {
      // Extract the image ID from the path
      const filename = imagePath.split('/').pop();
      if (!filename) {
        throw new Error('Invalid image path');
      }
      
      const imageId = filename.split('.')[0];
      
      // Set the main image
      const response = await fetch(`/api/investments/${investmentId}/images/main`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set main image');
      }
      
      // Update the main image ID
      onImagesChange(images, imageId);
    } catch (error) {
      console.error('Error setting main image:', error);
      alert('Failed to set main image');
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Images</h3>
      
      {/* Image upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Image (Max 5MB)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
        {uploadError && (
          <p className="text-red-500 text-sm">{uploadError}</p>
        )}
      </div>
      
      {/* Image gallery */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`relative group rounded-md overflow-hidden border-2 ${
                mainImageId && image.includes(mainImageId) ? 'border-indigo-500' : 'border-gray-200'
              }`}
            >
              <div className="relative h-32 w-full">
                <Image 
                  src={image}
                  alt={`Investment image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              
              {/* Image actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  {/* Set as main image button */}
                  {(!mainImageId || !image.includes(mainImageId)) && (
                    <button
                      type="button"
                      onClick={() => handleSetMainImage(image)}
                      className="p-1.5 bg-white rounded-full text-gray-700 hover:text-indigo-500"
                      title="Set as main image"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                  
                  {/* Delete image button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image)}
                    className="p-1.5 bg-white rounded-full text-gray-700 hover:text-red-500"
                    title="Delete image"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Main image indicator */}
              {mainImageId && image.includes(mainImageId) && (
                <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 text-white text-xs text-center py-1">
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No images uploaded yet</p>
      )}
    </div>
  );
}
