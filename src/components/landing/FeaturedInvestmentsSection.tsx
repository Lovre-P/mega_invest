import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";

// Define Investment type based on usage in the original page.tsx
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

interface FeaturedInvestmentsSectionProps {
  featuredInvestments: Investment[];
  error: string | null;
}

export default function FeaturedInvestmentsSection({ featuredInvestments, error }: FeaturedInvestmentsSectionProps) {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Featured Investment
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Opportunities</span>
          </h2>
          <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Explore some of our most popular investment options, carefully curated for maximum growth potential.
          </p>
        </div>

        {error ? (
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
                </div>
              </div>
            </div>
          </div>
        ) : featuredInvestments && featuredInvestments.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredInvestments.map((investment: Investment) => (
              <Card key={investment.id} variant="investment" className="group">
                <div className="relative h-56 overflow-hidden rounded-t-2xl">
                  {investment.images && investment.images.length > 0 && investment.mainImageId ? (
                    <Image
                      src={investment.images.find(img => img.includes(investment.mainImageId!)) || investment.images[0]}
                      alt={investment.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      // No priority prop here, defaults to loading="lazy"
                    />
                  ) : (
                    <Image
                      src={`https://picsum.photos/seed/${100 + parseInt(investment.id.slice(-3), 36)}/800/400`}
                      alt={investment.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      // No priority prop here, defaults to loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <RiskBadge risk={investment.risk as "Low" | "Moderate" | "High"} /> {/* Cast risk to specific type if needed by RiskBadge */}
                  </div>
                </div>

                <CardContent className="p-8">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl mb-3">{investment.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed line-clamp-3">
                      {investment.description}
                    </CardDescription>
                  </CardHeader>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <p className="text-sm font-medium text-slate-600 mb-1">Expected Return</p>
                      <p className="text-lg font-bold text-emerald-700">{investment.expectedReturn}</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <p className="text-sm font-medium text-slate-600 mb-1">Minimum</p>
                      <p className="text-lg font-bold text-blue-700">{investment.minimumInvestment}</p>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-sm font-medium text-slate-600 mb-1">Category</p>
                    <p className="text-base font-semibold text-purple-700">{investment.category}</p>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    asChild
                  >
                    <Link href={`/investments/${investment.id}`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Learn More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">No featured investments available at the moment.</p>
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link href="/investments">View All Investments</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <Button
            variant="outline"
            size="lg"
            asChild
          >
            <Link href="/investments">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              View All Opportunities
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
