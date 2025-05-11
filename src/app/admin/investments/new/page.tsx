"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default function NewInvestmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [mainImageId, setMainImageId] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expectedReturnMin: "",
    expectedReturnMax: "",
    minimumInvestment: "",
    category: "",
    risk: "Moderate",
    status: "Draft",
    detailedDescription: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Generate a temporary ID for the investment
      const tempId = 'temp-' + Date.now();

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);

      // Add the image to the list
      const newImages = [...images, imageUrl];
      setImages(newImages);

      // If this is the first image, set it as the main image
      if (images.length === 0 && !mainImageId) {
        setMainImageId(tempId);
      }

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error handling image:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the expected return range
      const expectedReturn = `${formData.expectedReturnMin}-${formData.expectedReturnMax}% annually`;

      // Format the minimum investment with dollar sign
      const minimumInvestment = `$${formData.minimumInvestment}`;

      // Create the investment object to send to the API
      const investmentData = {
        title: formData.title,
        description: formData.description,
        expectedReturn,
        minimumInvestment,
        category: formData.category,
        risk: formData.risk,
        status: formData.status,
        detailedDescription: formData.detailedDescription,
        images: images,
        mainImageId: mainImageId,
      };

      // Call the API to create the investment
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investmentData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the investments page
        router.push("/admin/investments");
      } else {
        alert(`Failed to create investment: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error creating investment:", error);
      alert('An error occurred while creating the investment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Add New Investment Opportunity
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/admin/investments"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">Basic Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly on the investment opportunities page.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                  Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Short Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of the investment opportunity. This will appear in cards and listings.
                </p>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="detailedDescription" className="block text-sm font-medium leading-6 text-gray-900">
                  Detailed Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="detailedDescription"
                    name="detailedDescription"
                    rows={6}
                    value={formData.detailedDescription}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Comprehensive description of the investment opportunity. This will appear on the detail page.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                  Category
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  >
                    <option value="">Select a category</option>
                    <option value="Technology">Technology</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Energy">Energy</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Global">Global</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="risk" className="block text-sm font-medium leading-6 text-gray-900">
                  Risk Level
                </label>
                <div className="mt-2">
                  <select
                    id="risk"
                    name="risk"
                    required
                    value={formData.risk}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Moderate-High">Moderate-High</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                  Status
                </label>
                <div className="mt-2">
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">Financial Details</h3>
              <p className="mt-1 text-sm text-gray-500">
                Provide the financial details of the investment opportunity.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="expectedReturnMin" className="block text-sm font-medium leading-6 text-gray-900">
                  Expected Return (Min %)
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="expectedReturnMin"
                    id="expectedReturnMin"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.expectedReturnMin}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="expectedReturnMax" className="block text-sm font-medium leading-6 text-gray-900">
                  Expected Return (Max %)
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="expectedReturnMax"
                    id="expectedReturnMax"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.expectedReturnMax}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="minimumInvestment" className="block text-sm font-medium leading-6 text-gray-900">
                  Minimum Investment ($)
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="minimumInvestment"
                    id="minimumInvestment"
                    required
                    min="0"
                    step="1000"
                    value={formData.minimumInvestment}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">Images</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload images for this investment opportunity. The first image will be used as the main image.
              </p>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="images" className="block text-sm font-medium leading-6 text-gray-900">
                Upload Images
              </label>
              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
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
                <p className="mt-2 text-sm text-red-500">{uploadError}</p>
              )}

              {/* Image preview */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group rounded-md overflow-hidden border-2 border-gray-200"
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

                      {/* Main image indicator */}
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 text-white text-xs text-center py-1">
                          Main Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-2 text-xs text-gray-500">
                Note: Images will be permanently associated with the investment after saving. You can add more images or set a main image later.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end gap-x-3">
            <Link
              href="/admin/investments"
              className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-black py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
