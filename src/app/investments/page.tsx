// This is a Server Component
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic"; // Import dynamic
import { getInvestmentsByStatus } from "@/lib/server-db"; 
import type { Metadata } from 'next';

// Dynamically import CTA sections
const DynamicSubmitInvestmentCTA = dynamic(() => import('@/components/investments/SubmitInvestmentCallToAction'), {
  loading: () => <div className="h-48 bg-gray-100 flex items-center justify-center"><p>Loading...</p></div>,
});

const DynamicSpeakToAdvisorCTA = dynamic(() => import('@/components/investments/SpeakToAdvisorCallToAction'), {
  loading: () => <div className="h-64 bg-gray-50 flex items-center justify-center"><p>Loading...</p></div>,
});

// Define Investment type based on expected structure
interface Investment {
  id: string;
  title: string;
  description: string;
  expectedReturn: string;
  minimumInvestment: string;
  category: string;
  risk: string;
  status: string;
  images?: string[];
  mainImageId?: string;
}

export const metadata: Metadata = {
  title: 'Investment Opportunities | Mega Invest',
  description: 'Explore our carefully selected investment opportunities designed to help you grow your wealth.',
};

// This page will now be server-rendered (SSR by default, or SSG if no dynamic functions are used and not configured otherwise)
export default async function InvestmentsPage() {
  // Fetch "Active" investments directly on the server
  // Error handling should be implemented within getInvestmentsByStatus or via Next.js error boundaries
  const investments: Investment[] = await getInvestmentsByStatus('Active'); 
  // const isLoading = false; // No longer needed with server fetching for initial load
  // const error = null; // Error handling would be different with server fetching

  // Note: If getInvestmentsByStatus throws an error, Next.js error handling (e.g., error.tsx) would take over.
  // If it returns an empty array or null, the page should handle that gracefully.

  return (
    <div className="bg-white">
      {/* Hero section - remains the same */}
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

      {/* 
        The isLoading and error states are removed because data fetching is now server-side.
        If an error occurs during server-side fetching, Next.js error handling (e.g., error.tsx) should catch it.
        If investments array is empty, the map function will simply render nothing, or you can add a specific message.
      */}
      <>
        {/* Filters section - simplified for now, can be enhanced with Client Components later */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {investments ? investments.length : 0} opportunities available
            </h2>
            {/* 
              The select dropdown for sorting is removed for now as it requires client-side state and logic.
              This can be added back as a separate Client Component.
            */}
          </div>
        </div>

        {/* Investments grid */}
        {investments && investments.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {investments.map((investment: Investment) => ( // Added Investment type
              <Link
                href={`/investments/${investment.id}`}
                className="block group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                key={investment.id}
              >
                <div className="relative h-48 overflow-hidden">
                  {investment.images && investment.images.length > 0 && investment.mainImageId ? (
                    <Image
                      src={investment.images.find(img => img.includes(investment.mainImageId!)) || investment.images[0]}
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
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">No Investments Available</h2>
            <p className="mt-2 text-gray-500">Please check back later for new investment opportunities.</p>
          </div>
        )}

        {/* Dynamically imported Submit Investment CTA */}
        <DynamicSubmitInvestmentCTA />

        {/* Dynamically imported Speak to Advisor CTA */}
        <DynamicSpeakToAdvisorCTA />
      </>
      {/* Removed the closing parenthesis for the ternary operator that was here before */}
    </div>
  );
}
            </div>
          </div>
        </div>
      </>
      {/* Removed the closing parenthesis for the ternary operator that was here before */}
    </div>
  );
}
