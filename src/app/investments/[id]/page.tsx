"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function InvestmentDetailPage({ params }: { params: { id: string } }) {
  const [investment, setInvestment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/investments/${params.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setInvestment(data.investment);
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
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !investment) {
    return (
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {error || "Investment not found"}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We couldn't find the investment you're looking for. Please try again or browse our other opportunities.
            </p>
            <div className="mt-10">
              <Link
                href="/investments"
                className="rounded-md bg-black px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800"
              >
                View All Investments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Back button */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/investments"
          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-black"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to all investments
        </Link>
      </div>

      {/* Hero section */}
      <div className="bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {investment.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-100 font-medium">
              {investment.description}
            </p>
          </div>
        </div>
      </div>

      {/* Investment details */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Investment Details</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Category</p>
                  <p className="text-base font-semibold text-gray-900">{investment.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Risk Level</p>
                  <p className="text-base font-semibold text-gray-900">{investment.risk}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="text-base font-semibold text-gray-900">{investment.status}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Financial Details</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Expected Return</p>
                  <p className="text-base font-semibold text-green-600">{investment.expectedReturn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Minimum Investment</p>
                  <p className="text-base font-semibold text-gray-900">{investment.minimumInvestment}</p>
                </div>
              </div>
            </div>
          </div>

          {investment.detailedDescription && (
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Description</h3>
              <div className="mt-4 prose prose-sm max-w-none text-gray-700">
                <p>{investment.detailedDescription}</p>
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="rounded-md bg-black px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800"
            >
              Speak to an Advisor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
