"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminInvestmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch investments from the API
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/investments');
        const data = await response.json();

        if (response.ok) {
          setInvestments(data.investments);
        } else {
          console.error('Failed to fetch investments:', data.error);
        }
      } catch (error) {
        console.error('Error fetching investments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  // Filter investments based on search term
  const filteredInvestments = investments.filter(
    (investment: any) =>
      investment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteInvestment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this investment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update the local state to remove the deleted investment
        setInvestments(investments.filter((investment: any) => investment.id !== id));
      } else {
        const data = await response.json();
        alert(`Failed to delete investment: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting investment:', error);
      alert('An error occurred while deleting the investment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Investment Opportunities
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/admin/pending-investments"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            View Pending
          </Link>
          <Link
            href="/admin/investments/new"
            className="ml-3 inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Add New Investment
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mt-8 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="relative mt-2 rounded-md shadow-sm max-w-md">
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
              placeholder="Search investments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <select
            id="filter"
            name="filter"
            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
            defaultValue="all"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Investments table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Expected Return
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Minimum Investment
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Risk Level
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredInvestments.map((investment: any) => (
                    <tr key={investment.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {investment.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{investment.category}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{investment.expectedReturn}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{investment.minimumInvestment}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          investment.risk === "Low"
                            ? "bg-green-100 text-green-800"
                            : investment.risk === "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {investment.risk}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          investment.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : investment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : investment.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : investment.status === "Draft"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {investment.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/admin/investments/${investment.id}`}
                          className="text-black hover:text-gray-700 mr-4"
                        >
                          Edit<span className="sr-only">, {investment.title}</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteInvestment(investment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete<span className="sr-only">, {investment.title}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
