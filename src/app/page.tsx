// This is a Server Component
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic"; // Import dynamic
import { Button } from "@/components/ui/Button";
// Card components are used by FeaturedInvestmentsSection, which will be dynamically imported
// RiskBadge is used by FeaturedInvestmentsSection
import { getInvestmentsByStatus } from "@/lib/server-db"; 
import type { Metadata } from 'next';

// Dynamically import the sections
const DynamicFeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'), {
  loading: () => <div className="h-96 bg-gray-100 flex items-center justify-center"><p>Loading Features...</p></div>,
});

const DynamicFeaturedInvestmentsSection = dynamic(() => import('@/components/landing/FeaturedInvestmentsSection'), {
  loading: () => <div className="h-96 bg-gray-100 flex items-center justify-center"><p>Loading Investments...</p></div>,
});

const DynamicCallToActionSection = dynamic(() => import('@/components/landing/CallToActionSection'), {
  loading: () => <div className="h-64 bg-gray-100 flex items-center justify-center"><p>Loading Call to Action...</p></div>,
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
  // Add other fields if necessary
}

export const metadata: Metadata = {
  title: 'Mega Invest | Premium Investment Opportunities',
  description: 'Mega Invest provides carefully selected investment opportunities for discerning investors. Grow your wealth with our expert-backed portfolio options.',
};

async function getFeaturedInvestments() {
  try {
    const activeInvestments: Investment[] = await getInvestmentsByStatus('Active');
    if (activeInvestments && activeInvestments.length > 0) {
      const shuffled = [...activeInvestments].sort(() => 0.5 - Math.random());
      return { investments: shuffled.slice(0, 3), error: null };
    }
    return { investments: [], error: 'No active investments found to feature.' };
  } catch (error) {
    console.error('Error fetching featured investments:', error);
    return { investments: [], error: 'Failed to fetch featured investments.' };
  }
}

export default async function Home() {
  const { investments: featuredInvestments, error } = await getFeaturedInvestments();

  return (
    <div className="flex flex-col">
      {/* Hero Section - remains the same */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 gradient-hero"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 animate-fade-in-up">
              Premium Investment
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Opportunities
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl font-medium text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Mega Invest provides carefully selected investment opportunities for discerning investors.
              Grow your wealth with our expert-backed portfolio options.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <Button
                variant="accent"
                size="lg"
                asChild
              >
                <Link href="/investments">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  View Opportunities
                </Link>
              </Button>
              <Button
                variant="glass"
                size="lg"
                asChild
              >
                <Link href="/contact">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Us
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="glass-card p-4 rounded-xl">
                <div className="text-2xl font-bold text-white">$50M+</div>
                <div className="text-blue-200 text-sm">Assets Managed</div>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="text-2xl font-bold text-white">1000+</div>
                <div className="text-blue-200 text-sm">Happy Investors</div>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="text-2xl font-bold text-white">15%</div>
                <div className="text-blue-200 text-sm">Avg. Returns</div>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="text-2xl font-bold text-white">5+</div>
                <div className="text-blue-200 text-sm">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
              Why Choose
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Mega Invest</span>
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
              We offer a range of benefits that set us apart from other investment platforms.
              Experience the future of investing with our cutting-edge approach.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card variant="feature" className="group">
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">High Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Our investment opportunities are carefully selected to maximize returns while managing risk through advanced analytics and market research.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card variant="feature" className="group">
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">Secure Investments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Security is our priority. We thoroughly vet all investment opportunities for safety and reliability using institutional-grade due diligence.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card variant="feature" className="group">
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">Expert Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Our team of financial experts provides personalized guidance to help you make informed decisions with 24/7 support and consultation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Investments Section */}
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

          {/* 
            isLoading and client-side error display are removed. 
            Server-side error or empty state is handled below.
          */}
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
                    {/* "Try again" button might not be suitable here if data is server-fetched and static for the request. 
                        A link to refresh or contact support might be better if this error persists.
                        For now, removing the button as it implies client-side refetching. */}
                  </div>
                </div>
              </div>
            </div>
          ) : featuredInvestments && featuredInvestments.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredInvestments.map((investment: Investment) => ( // Added Investment type
                <Card key={investment.id} variant="investment" className="group">
                  <div className="relative h-56 overflow-hidden rounded-t-2xl">
                    {investment.images && investment.images.length > 0 && investment.mainImageId ? (
                      <Image
                        src={investment.images.find(img => img.includes(investment.mainImageId!)) || investment.images[0]}
                        alt={investment.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <Image
                        src={`https://picsum.photos/seed/${100 + parseInt(investment.id.slice(-3), 36)}/800/400`}
                        alt={investment.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <RiskBadge risk={investment.risk} />
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
              {/* Optionally, link to all investments page */}
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link href="/investments">View All Investments</Link>
                </Button>
              </div>
            </div>
          )}

          <div className="mt-16 text-center">
            {/* This button is fine as is, links to another page */}
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

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8">
              Ready to Start
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Investing?</span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 font-medium mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of investors who trust Mega Invest with their financial future.
              Our team is ready to help you find the perfect investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button
                variant="accent"
                size="xl"
                asChild
              >
                <Link href="/contact">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact an Advisor
                </Link>
              </Button>
              <Button
                variant="glass"
                size="xl"
                asChild
              >
                <Link href="/investments">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Browse Investments
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
