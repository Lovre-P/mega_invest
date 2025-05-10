"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Investments", href: "/investments", current: false },
  { name: "About", href: "/about", current: false },
  { name: "Contact", href: "/contact", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [currentPage, setCurrentPage] = useState("/");

  return (
    <Disclosure as="nav" className="bg-white shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <div className="border-2 border-black p-1">
                      <Image
                        src="/mega-invest-logo.svg"
                        alt="Mega Invest Logo"
                        width={120}
                        height={40}
                        priority
                        className="h-10 w-auto"
                      />
                    </div>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.href === currentPage
                          ? "border-b-2 border-black text-gray-900"
                          : "border-b-2 border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800",
                        "inline-flex items-center px-1 pt-1 text-sm font-medium"
                      )}
                      onClick={() => setCurrentPage(item.href)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <a
                  href="/admin"
                  className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Admin Login
                </a>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                  <span className="absolute -inset-0.5" />
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

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.href === currentPage
                      ? "bg-gray-50 border-l-4 border-black text-black"
                      : "border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                    "block py-2 pl-3 pr-4 text-base font-medium"
                  )}
                  onClick={() => setCurrentPage(item.href)}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <div className="mt-4 flex items-center justify-center">
                <a
                  href="/admin"
                  className="rounded-md bg-black w-full mx-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 text-center"
                >
                  Admin Login
                </a>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
