"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SkeletonGrid } from "@/components/SkeletonLoader";

export default function Home() {
  const [featuredInvestments, setFeaturedInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured investments from the API
  useEffect(() => {
    const fetchFeaturedInvestments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Only fetch active investments
        const response = await fetch('/api/investments?status=Active');
        const data = await response.json();

        if (response.ok) {
          // Get 3 random investments to feature
          const shuffled = [...data.investments].sort(() => 0.5 - Math.random());
          setFeaturedInvestments(shuffled.slice(0, 3));
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

    fetchFeaturedInvestments();
  }, []);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Premium Investment Opportunities
            </h1>
            <p className="mt-6 text-xl font-medium">
              Mega Invest provides carefully selected investment opportunities for discerning investors.
              Grow your wealth with our expert-backed portfolio options.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/investments"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
              >
                View Opportunities
              </Link>
              <Link
                href="/contact"
                className="rounded-md bg-transparent px-6 py-3 text-base font-semibold text-white border-2 border-white shadow-sm hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Mega Invest
            </h2>
            <p className="mt-4 text-lg text-gray-800 font-medium">
              We offer a range of benefits that set us apart from other investment platforms.
            </p>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">High Returns</h3>
              <p className="mt-2 text-gray-800 flex-grow">
                Our investment opportunities are carefully selected to maximize returns while managing risk.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Secure Investments</h3>
              <p className="mt-2 text-gray-800 flex-grow">
                Security is our priority. We thoroughly vet all investment opportunities for safety and reliability.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Expert Guidance</h3>
              <p className="mt-2 text-gray-800 flex-grow">
                Our team of financial experts provides personalized guidance to help you make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Investments Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Investment Opportunities
            </h2>
            <p className="mt-4 text-lg text-gray-800 font-medium">
              Explore some of our most popular investment options.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <LoadingSpinner size="large" text="Loading investment opportunities..." />
              <div className="mt-12 w-full">
                <SkeletonGrid count={3} columns={3} />
              </div>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-3xl mt-8">
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
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredInvestments.map((investment: any) => (
                <div key={investment.id} className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg border border-gray-200">
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
                        src={`https://picsum.photos/seed/${100 + parseInt(investment.id.slice(-3), 36)}/800/400`}
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
                      <h3 className="text-xl font-semibold text-gray-900">{investment.title}</h3>
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
                      <Link
                        href={`/investments/${investment.id}`}
                        className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors duration-200"
                      >
                        Learn more <span className="ml-1" aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/investments"
              className="rounded-md bg-black px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800"
            >
              View All Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start investing?
            </h2>
            <p className="mt-6 text-lg text-gray-100 font-medium">
              Join thousands of investors who trust Mega Invest with their financial future.
              Our team is ready to help you find the perfect investment opportunities.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-black shadow-sm hover:bg-gray-100"
              >
                Contact an Advisor
              </Link>
              <Link
                href="/investments"
                className="rounded-md bg-transparent px-6 py-3 text-base font-semibold text-white border-2 border-white shadow-sm hover:bg-white/10"
              >
                Browse Investments
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
