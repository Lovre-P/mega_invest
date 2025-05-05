import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="bg-white p-2 rounded border-2 border-white inline-block">
              <Image
                src="/mega-invest-logo.svg"
                alt="Mega Invest Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="mt-4 text-sm text-gray-100">
              Mega Invest provides premium investment opportunities for discerning investors.
              Our carefully selected portfolio offers growth and stability.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-100 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/investments" className="text-gray-100 hover:text-white transition">
                  Investment Opportunities
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-100 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-100 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-100">
              <p>123 Investment Avenue</p>
              <p>Financial District</p>
              <p>New York, NY 10001</p>
              <p className="mt-2">Email: info@megainvest.com</p>
              <p>Phone: (555) 123-4567</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-200">
          <p>&copy; {new Date().getFullYear()} Mega Invest. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            {" | "}
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
