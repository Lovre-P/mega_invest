import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Us | Mega Invest",
  description: "Learn about Mega Invest, our mission, values, and the team behind our premium investment opportunities.",
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Sarah has over 20 years of experience in investment banking and wealth management. She founded Mega Invest with a vision to make premium investment opportunities accessible to more investors.",
      imagePath: "/placeholder-person.jpg",
    },
    {
      name: "Michael Chen",
      role: "Chief Investment Officer",
      bio: "Michael brings 15 years of experience in portfolio management and financial analysis. He leads our investment strategy and opportunity selection process.",
      imagePath: "/placeholder-person.jpg",
    },
    {
      name: "Jessica Williams",
      role: "Head of Client Relations",
      bio: "Jessica ensures our clients receive personalized service and expert guidance. She has 12 years of experience in wealth management and client advisory.",
      imagePath: "/placeholder-person.jpg",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              About Mega Invest
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              We're on a mission to help investors grow their wealth through carefully selected premium investment opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Story</h2>
            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
              <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                <p className="text-xl leading-8 text-gray-600">
                  Mega Invest was founded in 2015 with a clear vision: to provide access to premium investment opportunities that were traditionally available only to institutional investors or ultra-high-net-worth individuals.
                </p>
                <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                  <p>
                    Our founder, Sarah Johnson, spent two decades in investment banking and wealth management before realizing that many excellent investment opportunities were inaccessible to most investors due to high minimum investments or exclusive networks.
                  </p>
                  <p className="mt-6">
                    She assembled a team of financial experts with a shared mission to democratize access to premium investments while maintaining rigorous standards for opportunity selection and risk management.
                  </p>
                  <p className="mt-6">
                    Today, Mega Invest serves thousands of investors across the country, providing carefully vetted investment opportunities across multiple sectors including technology, real estate, sustainable energy, and more.
                  </p>
                </div>
              </div>
              <div className="lg:flex lg:flex-auto lg:justify-center">
                <dl className="w-64 space-y-8 xl:w-80">
                  <div className="flex flex-col-reverse gap-y-4">
                    <dt className="text-base leading-7 text-gray-600">Years in business</dt>
                    <dd className="text-5xl font-semibold tracking-tight text-gray-900">8+</dd>
                  </div>
                  <div className="flex flex-col-reverse gap-y-4">
                    <dt className="text-base leading-7 text-gray-600">Investors served</dt>
                    <dd className="text-5xl font-semibold tracking-tight text-gray-900">5,000+</dd>
                  </div>
                  <div className="flex flex-col-reverse gap-y-4">
                    <dt className="text-base leading-7 text-gray-600">Average annual return</dt>
                    <dd className="text-5xl font-semibold tracking-tight text-gray-900">12.4%</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              These core principles guide everything we do at Mega Invest.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="relative pl-10">
              <dt className="inline font-semibold text-gray-900">
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
                  1
                </div>
                Transparency
              </dt>
              <dd className="mt-2">We believe in complete transparency about investment opportunities, including potential returns, risks, and fees.</dd>
            </div>
            <div className="relative pl-10">
              <dt className="inline font-semibold text-gray-900">
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
                  2
                </div>
                Rigorous Selection
              </dt>
              <dd className="mt-2">We apply a stringent vetting process to all investment opportunities, selecting only those that meet our high standards.</dd>
            </div>
            <div className="relative pl-10">
              <dt className="inline font-semibold text-gray-900">
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
                  3
                </div>
                Client-First Approach
              </dt>
              <dd className="mt-2">Our clients' financial goals and risk tolerance guide our recommendations and service approach.</dd>
            </div>
            <div className="relative pl-10">
              <dt className="inline font-semibold text-gray-900">
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
                  4
                </div>
                Continuous Education
              </dt>
              <dd className="mt-2">We empower our clients with knowledge and insights to make informed investment decisions.</dd>
            </div>
            <div className="relative pl-10">
              <dt className="inline font-semibold text-gray-900">
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
                  5
                </div>
                Long-Term Perspective
              </dt>
              <dd className="mt-2">We focus on sustainable, long-term wealth creation rather than short-term gains.</dd>
            </div>
            <div className="relative pl-10">
              <dt className="inline font-semibold text-gray-900">
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
                  6
                </div>
                Innovation
              </dt>
              <dd className="mt-2">We continuously seek innovative investment opportunities and ways to improve our client experience.</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Team section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Leadership Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Meet the experienced professionals who guide our investment strategy and client service.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {teamMembers.map((person) => (
              <li key={person.name}>
                <div className="h-56 w-56 rounded-md bg-gray-200 mx-auto"></div>
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{person.name}</h3>
                <p className="text-base leading-7 text-gray-600">{person.role}</p>
                <p className="mt-4 text-base leading-7 text-gray-600">{person.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-black py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to explore investment opportunities?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Browse our current investment options or speak with one of our advisors to find the right fit for your financial goals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/investments"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-black shadow-sm hover:bg-gray-100"
              >
                View Opportunities
              </Link>
              <Link
                href="/contact"
                className="rounded-md bg-transparent px-6 py-3 text-base font-semibold text-white border border-white shadow-sm hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
