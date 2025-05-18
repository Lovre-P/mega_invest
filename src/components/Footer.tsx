import Link from "next/link";
import Image from "next/image";
import { getAssetPath } from "@/lib/path-utils";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <div className="bg-white p-2 rounded border-2 border-white inline-block">
              <Image
                src={getAssetPath("images/logo-mega-invest-2.png")}
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
            <div className="mt-4 flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-100 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-100 hover:text-white">
                <span className="sr-only">X (Twitter)</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-gray-100 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center md:text-left mt-8 md:mt-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" id="footer-home-link" className="text-gray-100 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/investments" id="footer-investments-link" className="text-gray-100 hover:text-white transition">
                  Investment Opportunities
                </Link>
              </li>
              <li>
                <Link href="/about" id="footer-about-link" className="text-gray-100 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" id="footer-contact-link" className="text-gray-100 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" id="footer-admin-link" className="text-gray-100 hover:text-white transition">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left mt-8 md:mt-0">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-100">
              <p>123 Investment Avenue</p>
              <p>Financial District</p>
              <p>New York, NY 10001</p>
              <p className="mt-2">
                <a href="mailto:info@megainvest.com" className="hover:text-white transition">
                  info@megainvest.com
                </a>
              </p>
              <p>
                <a href="tel:+15551234567" className="hover:text-white transition">
                  (555) 123-4567
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-200">
          <p>&copy; {new Date().getFullYear()} Mega Invest. All rights reserved.</p>
          <div className="mt-2 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="hover:text-white transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
