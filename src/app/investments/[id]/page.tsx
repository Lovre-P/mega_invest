// Removed "use client" to make it a Server Component

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ImageGallery from "@/components/ImageGallery"; // This is a Client Component
import { getInvestmentById, getInvestments } from "@/lib/server-db"; // Server-side data fetching
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from 'next';

// Define Investment type based on expected structure from getInvestmentById
interface Investment {
  id: string;
  title: string;
  description: string;
  expectedReturn: string;
  minimumInvestment: string;
  category: string;
  risk: string;
  status: string; // Assuming status is part of the fetched data
  detailedDescription: string;
  images?: string[]; // Assuming images is an array of strings
  mainImageId?: string; // Assuming mainImageId is a string
  // Add any other fields that are used in the component
}

interface InvestmentDetailPageProps {
  params: { id: string };
}

// Function to generate static paths
export async function generateStaticParams() {
  const investments = await getInvestments(); // Fetch all investments
  return investments.map((investment) => ({
    id: investment.id,
  }));
}

// Function to generate metadata
export async function generateMetadata(
  { params }: InvestmentDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const investment = await getInvestmentById(id);

  if (!investment) {
    return {
      title: "Investment Not Found",
      description: "The requested investment could not be found.",
    };
  }

  return {
    title: `${investment.title} | Mega Invest`,
    description: investment.description,
    openGraph: {
      title: investment.title,
      description: investment.description,
      images: investment.images && investment.mainImageId 
        ? [investment.images.find(img => img.includes(investment.mainImageId)) || investment.images[0]] 
        : [`https://picsum.photos/seed/${300 + parseInt(id.slice(-3), 36)}/1200/600`],
    },
  };
}


export default async function InvestmentDetailPage({ params }: InvestmentDetailPageProps) {
  const id = params.id;
  const investment: Investment | undefined = await getInvestmentById(id);

  if (!investment) {
    notFound(); // Use Next.js notFound for 404
  }

  // No isLoading or error states needed here as data is fetched server-side
  // If investment is not found, notFound() will handle it.
  // Error handling for getInvestmentById should be done within the function or by Next.js error boundaries.

  // The 'error' variable from client-side fetching is no longer relevant in this server component context
  // for the primary data. If the data fetch fails, it would typically result in a build error for SSG
  // or a server error caught by Next.js error handling for SSR.
  // For this SSG setup, if getInvestmentById returns undefined, notFound() is called.

  if (!investment) { // This check is technically redundant due to notFound() above but good for clarity
    return (
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Investment not found
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

      {/* Investment image gallery */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {investment.images && investment.images.length > 0 ? (
            <ImageGallery
              images={investment.images}
              mainImageId={investment.mainImageId}
            />
          ) : (
            <div className="relative h-80 sm:h-96 md:h-[400px] overflow-hidden rounded-xl">
              <Image
                src={`https://picsum.photos/seed/${300 + parseInt(id.slice(-3), 36)}/1200/600`}
                alt={investment.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-cover"
              />
            </div>
          )}
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
              href={`/contact?investmentId=${investment.id}&investmentTitle=${encodeURIComponent(investment.title)}`}
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
