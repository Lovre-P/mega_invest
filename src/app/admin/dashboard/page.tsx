"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
import { getAdminDashboardData } from "@/app/actions"; // Import the new server action

// Define types for stats and leads that match the server action's return type
interface StatItem {
  name: string;
  value: string;
  highlight?: boolean;
}
interface RecentLeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  date: string;
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([ // Typed state
    { name: "Total Investments", value: "0" },
    { name: "Active Investments", value: "0" },
    { name: "Pending Investments", value: "0", highlight: true },
    { name: "New Leads (This Month)", value: "0" },
  ]);
  const [recentLeads, setRecentLeads] = useState<RecentLeadItem[]>([]); // Typed state
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data using the server action
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAdminDashboardData();

        if (data.error) {
          setError(data.error);
          console.error('Error fetching dashboard data:', data.error);
          // Keep existing stats or reset them
          setStats([
            { name: "Total Investments", value: "0" },
            { name: "Active Investments", value: "0" },
            { name: "Pending Investments", value: "0", highlight: true },
            { name: "New Leads (This Month)", value: "0" },
          ]);
          setRecentLeads([]);
        } else {
          // Update stats from server action data
          setStats([
            { name: "Total Investments", value: data.stats.totalInvestments.toString() },
            { name: "Active Investments", value: data.stats.activeInvestments.toString() },
            { name: "Pending Investments", value: data.stats.pendingInvestments.toString(), highlight: true },
            { name: "New Leads (This Month)", value: data.stats.newLeadsThisMonth.toString() },
          ]);
          setRecentLeads(data.recentLeads);
        }
      } catch (err) {
        // Catch any unexpected errors from the action call itself
        console.error('Unexpected error fetching dashboard data:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) { // isLoading state is still useful for the initial load indication
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  // Display error message if fetching failed
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
             <button
                type="button"
                onClick={() => window.location.reload()} // Simple reload, or could trigger loadDashboardData again
                className="mt-4 rounded-md bg-red-100 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
              >
                Try again
              </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Admin Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/admin/investments/new"
            className="ml-3 inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Add New Investment
          </Link>
        </div>
      </div>

      {/* Stats - content remains the same, but data source is now different */}
      <div className="mt-8">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className={`overflow-hidden rounded-lg ${stat.highlight ? 'bg-black text-white' : 'bg-white'} px-4 py-5 shadow sm:p-6`}
            >
              <dt className={`truncate text-sm font-medium ${stat.highlight ? 'text-gray-200' : 'text-gray-500'}`}>
                {stat.name}
              </dt>
              <dd className={`mt-1 text-3xl font-semibold tracking-tight ${stat.highlight ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </dd>
              {stat.highlight && stat.value !== "0" && (
                <div className="mt-2">
                  <Link
                    href="/admin/pending-investments"
                    className="text-sm font-medium text-gray-200 hover:text-white"
                  >
                    View pending →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </dl>
      </div>

      {/* Recent Leads */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Leads</h3>
            <p className="mt-2 text-sm text-gray-700">
              A list of recent leads who have contacted Mega Invest about investment opportunities.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/admin/leads"
              className="block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              View all leads
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Phone
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Interest
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {lead.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.phone}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.interest}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.date}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href="#" className="text-black hover:text-gray-700">
                            View<span className="sr-only">, {lead.name}</span>
                          </a>
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
    </div>
  );
}
