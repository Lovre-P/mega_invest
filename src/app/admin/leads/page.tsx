"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: "New" | "Contacted" | "Qualified" | "Converted" | "Closed";
}

export default function AdminLeadsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Fetch leads from the API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/leads');
        const data = await response.json();

        if (response.ok) {
          setLeads(data.leads);
        } else {
          setError(data.error || 'Failed to fetch leads');
          console.error('Failed to fetch leads:', data.error);
        }
      } catch (error) {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Error fetching leads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Filter leads based on active tab
  const filteredLeads = leads.filter(lead => {
    if (activeTab === "all") return true;
    return lead.status.toLowerCase() === activeTab.toLowerCase();
  });

  // Update lead status
  const handleUpdateStatus = async (id: string, status: Lead["status"]) => {
    try {
      setIsUpdating(id);

      // In a real app, this would be an API call
      // For now, we'll just update the state
      setLeads(leads.map(lead =>
        lead.id === id ? { ...lead, status } : lead
      ));

      // Close the detail view if the updated lead is the selected one
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status });
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Failed to update lead status');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Lead Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track potential client leads.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" text="Loading leads..." />
        </div>
      ) : error ? (
        <div className="mt-8 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading leads</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("all")}
                className={`${
                  activeTab === "all"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                All Leads
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`${
                  activeTab === "new"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                New
              </button>
              <button
                onClick={() => setActiveTab("contacted")}
                className={`${
                  activeTab === "contacted"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Contacted
              </button>
              <button
                onClick={() => setActiveTab("qualified")}
                className={`${
                  activeTab === "qualified"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Qualified
              </button>
              <button
                onClick={() => setActiveTab("converted")}
                className={`${
                  activeTab === "converted"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Converted
              </button>
            </nav>
          </div>

          {/* Lead list and detail view */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Lead list */}
            <div className="lg:col-span-1 overflow-hidden bg-white shadow sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {filteredLeads.length === 0 ? (
                  <li className="px-6 py-4 text-center text-sm text-gray-500">
                    No leads found
                  </li>
                ) : (
                  filteredLeads.map((lead) => (
                    <li
                      key={lead.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedLead?.id === lead.id ? "bg-gray-50" : ""
                      }`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-medium text-black">
                            {lead.name}
                          </p>
                          <div className="ml-2 flex flex-shrink-0">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                lead.status === "New"
                                  ? "bg-blue-100 text-blue-800"
                                  : lead.status === "Contacted"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : lead.status === "Qualified"
                                  ? "bg-purple-100 text-purple-800"
                                  : lead.status === "Converted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {lead.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {lead.email}
                            </p>
                          </div>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Lead detail */}
            <div className="lg:col-span-2">
              {selectedLead ? (
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Lead Information
                      </h3>
                      <div className="flex space-x-2">
                        <select
                          value={selectedLead.status}
                          onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value as Lead["status"])}
                          disabled={!!isUpdating}
                          className="rounded-md border-gray-300 py-1 text-sm focus:border-black focus:ring-black text-gray-900 bg-white"
                        >
                          <option value="New" className="text-gray-900">New</option>
                          <option value="Contacted" className="text-gray-900">Contacted</option>
                          <option value="Qualified" className="text-gray-900">Qualified</option>
                          <option value="Converted" className="text-gray-900">Converted</option>
                          <option value="Closed" className="text-gray-900">Closed</option>
                        </select>
                        {isUpdating === selectedLead.id && (
                          <LoadingSpinner size="small" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedLead.name}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedLead.email}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedLead.phone}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Created at</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(selectedLead.createdAt).toLocaleString()}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Message</dt>
                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                          {selectedLead.message}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Actions</h4>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        onClick={() => {
                          // In a real app, this would open the email client
                          window.open(`mailto:${selectedLead.email}`);
                        }}
                      >
                        <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        onClick={() => {
                          // In a real app, this would open the phone dialer
                          window.open(`tel:${selectedLead.phone}`);
                        }}
                      >
                        <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No lead selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a lead from the list to view details.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
