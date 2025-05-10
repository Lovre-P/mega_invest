"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch investments from the API
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setIsLoading(true);
        // Only fetch active investments
        const response = await fetch('/api/investments?status=Active');
        const data = await response.json();

        if (response.ok) {
          setInvestments(data.investments);
        } else {
          console.error('Failed to fetch investments:', data.error);
        }
      } catch (error) {
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
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
                  className="rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-black focus:ring-black"
                  defaultValue="featured"
                >
                  <option value="featured">Featured</option>
                  <option value="return-high">Highest Return</option>
                  <option value="return-low">Lowest Return</option>
                  <option value="investment-low">Lowest Investment</option>
                  <option value="risk-low">Lowest Risk</option>
                </select>
              </div>
            </div>
          </div>

          {/* Investments grid */}
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="h-48 bg-gray-200 group-hover:opacity-90"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900">
                        <Link href={`/investments/${investment.id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {investment.title}
                        </Link>
                      </h3>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        investment.risk === "Low"
                          ? "bg-green-100 text-green-800"
                          : investment.risk === "Moderate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {investment.risk}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600 line-clamp-3">
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
                      <Link
                        href={`/investments/${investment.id}`}
                        className="text-sm font-semibold text-black hover:text-gray-700"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
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
