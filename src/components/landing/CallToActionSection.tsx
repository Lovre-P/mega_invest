import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CallToActionSection() {
  return (
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
  );
}
