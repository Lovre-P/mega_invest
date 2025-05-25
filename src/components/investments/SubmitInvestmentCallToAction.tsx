import Link from "next/link";

export default function SubmitInvestmentCallToAction() {
  return (
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
  );
}
