import Link from "next/link";

export default function SpeakToAdvisorCallToAction() {
  return (
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
  );
}
