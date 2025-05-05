"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewInvestmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expectedReturnMin: "",
    expectedReturnMax: "",
    minimumInvestment: "",
    category: "",
    risk: "Moderate",
    status: "Draft",
    featuredImage: null,
    detailedDescription: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              <h3 className="text-base font-semibold leading-6 text-gray-900">Featured Image</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload an image that represents this investment opportunity.
              </p>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="featuredImage" className="block text-sm font-medium leading-6 text-gray-900">
                Image
              </label>
              <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 hover:text-gray-700"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
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
