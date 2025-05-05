"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // Call the API to create a new lead
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        alert(`Failed to submit form: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form');
    }
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Have questions about our investment opportunities? Want to speak with an advisor?
              We're here to help you make informed investment decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Contact form section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
              {/* Contact information */}
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Get in Touch</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Our team of investment advisors is ready to answer your questions and help you find the right investment opportunities for your financial goals.
                </p>

                <dl className="mt-10 space-y-6 text-base leading-7 text-gray-600">
                  <div className="flex gap-x-4">
                    <dt className="flex-none">
                      <span className="sr-only">Address</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-6 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                    </dt>
                    <dd>
                      123 Investment Avenue<br />
                      Financial District<br />
                      New York, NY 10001
                    </dd>
                  </div>
                  <div className="flex gap-x-4">
                    <dt className="flex-none">
                      <span className="sr-only">Telephone</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-6 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                    </dt>
                    <dd>
                      <a className="hover:text-black" href="tel:+15551234567">
                        +1 (555) 123-4567
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-x-4">
                    <dt className="flex-none">
                      <span className="sr-only">Email</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-6 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                    </dt>
                    <dd>
                      <a className="hover:text-black" href="mailto:info@megainvest.com">
                        info@megainvest.com
                      </a>
                    </dd>
                  </div>
                </dl>

                <h3 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                  Office Hours
                </h3>
                <dl className="mt-6 space-y-2 text-base leading-7 text-gray-600">
                  <div className="flex justify-between">
                    <dt>Monday - Friday</dt>
                    <dd>9:00 AM - 6:00 PM EST</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Saturday</dt>
                    <dd>10:00 AM - 2:00 PM EST</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Sunday</dt>
                    <dd>Closed</dd>
                  </div>
                </dl>
              </div>

              {/* Contact form */}
              <div className="lg:ml-auto lg:pl-4 lg:pt-4">
                <div className="rounded-2xl bg-gray-50 p-8 ring-1 ring-gray-200 lg:p-10">
                  {isSubmitted ? (
                    <div className="text-center py-10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <h3 className="mt-4 text-lg font-semibold text-gray-900">Thank you for contacting us!</h3>
                      <p className="mt-2 text-gray-600">
                        We've received your message and will get back to you within 24 hours.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsSubmitted(false)}
                        className="mt-6 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold tracking-tight text-gray-900">Send us a message</h3>
                      <p className="mt-2 text-gray-600">
                        Fill out the form below and one of our advisors will contact you shortly.
                      </p>
                      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full name
                          </label>
                          <input
                            type="text"
                            id="name"
                            autoComplete="name"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                            {...register("name", { required: "Name is required" })}
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            autoComplete="email"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                              }
                            })}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            autoComplete="tel"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                            {...register("phone")}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="investmentInterest" className="block text-sm font-medium text-gray-700">
                            Investment interest
                          </label>
                          <select
                            id="investmentInterest"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                            {...register("investmentInterest")}
                          >
                            <option value="">Select an option</option>
                            <option value="tech-growth-fund">Tech Growth Fund</option>
                            <option value="real-estate-portfolio">Real Estate Portfolio</option>
                            <option value="sustainable-energy-fund">Sustainable Energy Fund</option>
                            <option value="global-markets-fund">Global Markets Fund</option>
                            <option value="healthcare-innovation-fund">Healthcare Innovation Fund</option>
                            <option value="income-generation-portfolio">Income Generation Portfolio</option>
                            <option value="general">General inquiry</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                            {...register("message", { required: "Message is required" })}
                          />
                          {errors.message && (
                            <p className="mt-1 text-sm text-red-600">{errors.message.message as string}</p>
                          )}
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="w-full rounded-md bg-black px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800"
                          >
                            Send message
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
