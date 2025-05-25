"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Investments", href: "/investments" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Disclosure as="nav" className={classNames(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "glass-nav shadow-lg"
        : "bg-transparent"
    )}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 justify-between items-center">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" className="group">
                    <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 p-2 transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-lg">
                      <Image
                        src="/images/logo-mega-invest-2.png"
                        alt="Mega Invest Logo"
                        width={120}
                        height={40}
                        priority
                        className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-transparent",
                        "inline-flex items-center px-4 py-2 border-2 rounded-xl text-sm font-semibold transition-all duration-300"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href="/submit-investment">
                    Submit Investment
                  </Link>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  asChild
                >
                  <Link href="/admin">
                    Admin
                  </Link>
                </Button>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-xl glass p-2 text-slate-600 hover:text-slate-900 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden glass-card mx-4 mt-2 rounded-2xl">
            <div className="space-y-2 p-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-transparent",
                    "block px-4 py-3 border-2 rounded-xl text-base font-semibold transition-all duration-300"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  asChild
                >
                  <Link href="/submit-investment">
                    Submit Investment
                  </Link>
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  asChild
                >
                  <Link href="/admin">
                    Admin
                  </Link>
                </Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
