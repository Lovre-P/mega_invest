"use client";

import { useState } from "react";
import Link from "next/link";
import { submitInvestmentProposal } from "@/app/actions";

export default function SubmitInvestmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    expectedReturnMin: "",
    expectedReturnMax: "",
    minimumInvestment: "",
    category: "",
    risk: "Moderate",
    detailedDescription: "",
    submitterEmail: "",
    submitterName: "",
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

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
    setFormError("");

    try {
      const result = await submitInvestmentProposal(formData);
      
      if (result.success) {
        setFormSuccess(true);
        // Reset form
        setFormData({
          title: "",
          description: "",
          expectedReturnMin: "",
          expectedReturnMax: "",
          minimumInvestment: "",
          category: "",
          risk: "Moderate",
          detailedDescription: "",
          submitterEmail: "",
          submitterName: "",
        });
      } else {
        setFormError(result.message || "Failed to submit investment proposal");
      }
    } catch (error) {
      console.error("Error submitting investment:", error);
      setFormError("An error occurred while submitting the investment proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Submit Your Investment Opportunity
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Have an investment opportunity you'd like to share? Submit it for review by our team.
          </p>
          
          {formSuccess ? (
            <div className="mt-10 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Submission successful</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Thank you for submitting your investment opportunity. Our team will review it and get back to you soon.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <Link
                        href="/investments"
                        className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                      >
                        View Investments
                      </Link>
                      <button
                        type="button"
                        onClick={() => setFormSuccess(false)}
                        className="ml-3 rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                      >
                        Submit Another
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              {formError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{formError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-b border-gray-900/10 pb-8">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Your Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Please provide your contact information so we can follow up with you.
                </p>
                
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="submitterName" className="block text-sm font-medium leading-6 text-gray-900">
                      Full name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="submitterName"
                        id="submitterName"
                        required
                        value={formData.submitterName}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="submitterEmail" className="block text-sm font-medium leading-6 text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="submitterEmail"
                        id="submitterEmail"
                        required
                        value={formData.submitterEmail}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-900/10 pb-8">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Investment Details</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Provide information about your investment opportunity.
                </p>
                
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                      Investment Title
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
                  
                  <div className="col-span-full">
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
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Brief description of the investment opportunity (100-150 characters).
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
                        <option value="Bonds">Bonds</option>
                        <option value="Other">Other</option>
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
                        value={formData.minimumInvestment}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
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
                        step="0.1"
                        value={formData.expectedReturnMin}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
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
                        step="0.1"
                        value={formData.expectedReturnMax}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-full">
                    <label htmlFor="detailedDescription" className="block text-sm font-medium leading-6 text-gray-900">
                      Detailed Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="detailedDescription"
                        name="detailedDescription"
                        rows={6}
                        required
                        value={formData.detailedDescription}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Provide a detailed description of the investment opportunity, including its benefits, risks, and potential returns.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <Link
                  href="/investments"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
