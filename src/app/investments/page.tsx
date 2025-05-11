"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SkeletonGrid } from "@/components/SkeletonLoader";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch investments from the API
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Only fetch active investments
        const response = await fetch('/api/investments?status=Active');
        const data = await response.json();

        if (response.ok) {
          setInvestments(data.investments);
        } else {
          setError(data.error || 'Failed to fetch investments');
          console.error('Failed to fetch investments:', data.error);
        }
      } catch (error) {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Error fetching investments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Investment Opportunities
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-100 font-medium">
              Explore our carefully selected investment opportunities designed to help you grow your wealth.
              Our team of experts has vetted each option for potential returns and risk management.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="large" text="Loading investment opportunities..." />
            <div className="mt-12 w-full">
              <SkeletonGrid count={6} columns={3} />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading investments</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filters section */}
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {investments.length} opportunities available
              </h2>
              <div className="mt-4 sm:mt-0 flex items-center">
                <span className="mr-2 text-sm text-gray-700">Sort by:</span>
                <select
                  className="rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-black focus:ring-black text-gray-900 bg-white"
                  defaultValue="featured"
                >
                  <option value="featured" className="text-gray-900">Featured</option>
                  <option value="return-high" className="text-gray-900">Highest Return</option>
                  <option value="return-low" className="text-gray-900">Lowest Return</option>
                  <option value="investment-low" className="text-gray-900">Lowest Investment</option>
                  <option value="risk-low" className="text-gray-900">Lowest Risk</option>
                </select>
              </div>
            </div>
          </div>

          {/* Investments grid */}
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {investments.map((investment) => (
                <Link
                  href={`/investments/${investment.id}`}
                  className="block group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                  key={investment.id}
                >
                  <div className="relative h-48 overflow-hidden">
                    {investment.images && investment.images.length > 0 && investment.mainImageId ? (
                      <Image
                        src={investment.images.find(img => img.includes(investment.mainImageId)) || investment.images[0]}
                        alt={investment.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={`https://picsum.photos/seed/${200 + parseInt(investment.id.slice(-3), 36)}/800/400`}
                        alt={investment.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {investment.title}
                      </h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        investment.risk === "Low"
                          ? "bg-green-100 text-green-800"
                          : investment.risk === "Moderate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {investment.risk}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700 line-clamp-3">
                      {investment.description}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Expected Return</p>
                        <p className="text-sm font-semibold text-green-700">{investment.expectedReturn}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Minimum</p>
                        <p className="text-sm font-semibold text-gray-900">{investment.minimumInvestment}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Category</p>
                      <p className="text-sm font-semibold text-gray-900">{investment.category}</p>
                    </div>
                    <div className="mt-6">
                      <span
                        className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm group-hover:bg-gray-800 transition-colors duration-200"
                      >
                        Learn more <span className="ml-1">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Submit Investment CTA */}
          <div className="bg-gray-100 py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Have an investment opportunity to share?
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  Submit your investment opportunity for review by our team.
                </p>
                <div className="mt-6 flex items-center justify-center">
                  <Link
                    href="/submit-investment"
                    className="rounded-md bg-black px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800"
                  >
                    Submit Investment
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CTA section */}
          <div className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Not sure which investment is right for you?
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Our investment advisors can help you find the perfect opportunity based on your financial goals,
                  risk tolerance, and investment timeline.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
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
        </>
      )}
    </div>
  );
}
