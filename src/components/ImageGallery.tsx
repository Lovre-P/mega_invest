"use client";

import { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ImageGalleryProps {
  images: string[];
  mainImageId?: string;
}

export default function ImageGallery({ images, mainImageId }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // If no images, return null
  if (!images || images.length === 0) {
    return null;
  }
  
  // Find the main image, or use the first image if no main image is set
  const mainImage = mainImageId 
    ? images.find(img => img.includes(mainImageId)) || images[0]
    : images[0];
  
  // Handle thumbnail click
  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };
  
  // Close the modal
  const closeModal = () => {
    setSelectedImage(null);
  };
  
  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative h-80 sm:h-96 md:h-[400px] overflow-hidden rounded-xl">
        <Image 
          src={mainImage}
          alt="Investment main image"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          className="object-cover cursor-pointer"
          onClick={() => setSelectedImage(mainImage)}
        />
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 ${
                image === mainImage ? 'border-black' : 'border-transparent'
              }`}
              onClick={() => handleThumbnailClick(image)}
            >
              <Image 
                src={image}
                alt={`Investment image ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Modal for full-size image */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <div className="relative w-full h-full max-h-[80vh]">
              <Image 
                src={selectedImage}
                alt="Investment image full size"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
