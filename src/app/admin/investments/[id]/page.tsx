"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";

export default function EditInvestmentPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
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
    isVisible: true,
  });

  // Fetch the investment data
  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/investments/${id}`);
        const data = await response.json();

        if (response.ok) {
          const investment = data.investment;
          
          // Parse expected return (format: "10-15% annually")
          let expectedReturnMin = "";
          let expectedReturnMax = "";
          if (investment.expectedReturn) {
            const match = investment.expectedReturn.match(/(\d+)-(\d+)%/);
            if (match) {
              expectedReturnMin = match[1];
              expectedReturnMax = match[2];
            }
          }

          // Parse minimum investment (format: "$10000")
          let minimumInvestment = "";
          if (investment.minimumInvestment) {
            minimumInvestment = investment.minimumInvestment.replace(/[^0-9]/g, "");
          }

          // Set form data
          setFormData({
            title: investment.title || "",
            description: investment.description || "",
            expectedReturnMin,
            expectedReturnMax,
            minimumInvestment,
            category: investment.category || "",
            risk: investment.risk || "Moderate",
            status: investment.status || "Draft",
            detailedDescription: investment.detailedDescription || "",
            isVisible: investment.status === "Active",
          });
        } else {
          setError(data.error || "Failed to fetch investment details");
        }
      } catch (error) {
        console.error("Error fetching investment:", error);
        setError("An error occurred while fetching the investment details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestment();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isVisible = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      isVisible,
      status: isVisible ? "Active" : "Inactive",
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

      // Call the API to update the investment
      const response = await fetch(`/api/investments/${id}`, {
        method: 'PUT',
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
        setError(`Failed to update investment: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating investment:", error);
      setError('An error occurred while updating the investment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Edit Investment Opportunity
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

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">There was an error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly on the website.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Short Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of the investment opportunity. This will be displayed in the investment cards.
                </p>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="detailedDescription" className="block text-sm font-medium text-gray-700">
                  Detailed Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="detailedDescription"
                    name="detailedDescription"
                    rows={6}
                    value={formData.detailedDescription}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Detailed information about the investment opportunity. This will be displayed on the investment detail page.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Investment Details</h3>
              <p className="mt-1 text-sm text-gray-500">
                Financial and categorization information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="expectedReturnMin" className="block text-sm font-medium text-gray-700">
                  Expected Return (Min %)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="expectedReturnMin"
                    id="expectedReturnMin"
                    min="0"
                    max="100"
                    value={formData.expectedReturnMin}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="expectedReturnMax" className="block text-sm font-medium text-gray-700">
                  Expected Return (Max %)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="expectedReturnMax"
                    id="expectedReturnMax"
                    min="0"
                    max="100"
                    value={formData.expectedReturnMax}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="minimumInvestment" className="block text-sm font-medium text-gray-700">
                  Minimum Investment ($)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="minimumInvestment"
                    id="minimumInvestment"
                    min="0"
                    value={formData.minimumInvestment}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="risk" className="block text-sm font-medium text-gray-700">
                  Risk Level
                </label>
                <div className="mt-1">
                  <select
                    id="risk"
                    name="risk"
                    value={formData.risk}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  >
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="isVisible"
                    name="isVisible"
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={handleToggleVisibility}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-900">
                    Visible on public site
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  When checked, this investment will be visible to visitors on the public site.
                </p>
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
