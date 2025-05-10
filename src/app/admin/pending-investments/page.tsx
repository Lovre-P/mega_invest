"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { reviewInvestmentProposal, getPendingInvestments } from "@/app/actions";
import { Investment } from "@/lib/db-query";

export default function PendingInvestmentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingInvestments, setPendingInvestments] = useState<Investment[]>([]);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'Active' | 'Rejected'>('Active');
  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Fetch pending investments
  useEffect(() => {
    const fetchPendingInvestments = async () => {
      try {
        setIsLoading(true);
        // Use the server action to fetch pending investments
        const investments = await getPendingInvestments();
        setPendingInvestments(investments);
      } catch (error) {
        console.error('Error fetching pending investments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingInvestments();
  }, [reviewSuccess]);

  const handleReviewClick = (investment: Investment) => {
    setSelectedInvestment(investment);
    setReviewStatus('Active');
    setRejectionReason("");
    setReviewError("");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInvestment) return;

    setIsReviewing(true);
    setReviewError("");

    try {
      const result = await reviewInvestmentProposal({
        id: selectedInvestment.id,
        status: reviewStatus,
        rejectionReason: reviewStatus === 'Rejected' ? rejectionReason : undefined
      });

      if (result.success) {
        setReviewSuccess(true);
        // Remove the reviewed investment from the list
        setPendingInvestments(prev => prev.filter(inv => inv.id !== selectedInvestment.id));
        // Close the modal after a delay
        setTimeout(() => {
          setSelectedInvestment(null);
          setReviewSuccess(false);
        }, 2000);
      } else {
        setReviewError(result.message || "Failed to review investment");
      }
    } catch (error) {
      console.error("Error reviewing investment:", error);
      setReviewError("An error occurred while reviewing the investment");
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Pending Investment Submissions
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve or reject investment opportunities submitted by users.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/admin/investments"
            className="ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            View All Investments
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-sm text-gray-500">Loading pending investments...</p>
        </div>
      ) : pendingInvestments.length === 0 ? (
        <div className="mt-6 rounded-md bg-gray-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">No pending investments</h3>
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  There are no pending investment submissions to review at this time.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Risk
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Submitted By
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Submitted At
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingInvestments.map((investment) => (
                    <tr key={investment.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {investment.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {investment.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {investment.risk}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {investment.submittedBy}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(investment.submittedAt || '').toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => handleReviewClick(investment)}
                          className="text-black hover:text-gray-700"
                        >
                          Review<span className="sr-only">, {investment.title}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => !isReviewing && setSelectedInvestment(null)} />

            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-xl font-semibold leading-6 text-gray-900">
                    Review Investment Submission
                  </h3>

                  {reviewSuccess ? (
                    <div className="mt-4 rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Success</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>
                              Investment has been {reviewStatus === 'Active' ? 'approved' : 'rejected'} successfully.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      {reviewError && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">Error</h3>
                              <div className="mt-2 text-sm text-red-700">
                                <p>{reviewError}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-left">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Title</h4>
                          <p className="mt-1 text-sm text-gray-500">{selectedInvestment.title}</p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Description</h4>
                          <p className="mt-1 text-sm text-gray-500">{selectedInvestment.description}</p>
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Category</h4>
                            <p className="mt-1 text-sm text-gray-500">{selectedInvestment.category}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Risk</h4>
                            <p className="mt-1 text-sm text-gray-500">{selectedInvestment.risk}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Expected Return</h4>
                            <p className="mt-1 text-sm text-gray-500">{selectedInvestment.expectedReturn}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Minimum Investment</h4>
                            <p className="mt-1 text-sm text-gray-500">{selectedInvestment.minimumInvestment}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Detailed Description</h4>
                          <p className="mt-1 text-sm text-gray-500">{selectedInvestment.detailedDescription}</p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Submitted By</h4>
                          <p className="mt-1 text-sm text-gray-500">{selectedInvestment.submittedBy}</p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900">Submitted At</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(selectedInvestment.submittedAt || '').toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleReviewSubmit} className="mt-6">
                        <div className="mb-4">
                          <label className="text-sm font-medium text-gray-900">Review Decision</label>
                          <div className="mt-2 flex items-center space-x-4">
                            <div className="flex items-center">
                              <input
                                id="approve"
                                name="reviewStatus"
                                type="radio"
                                checked={reviewStatus === 'Active'}
                                onChange={() => setReviewStatus('Active')}
                                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                              />
                              <label htmlFor="approve" className="ml-2 block text-sm text-gray-900">
                                Approve
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="reject"
                                name="reviewStatus"
                                type="radio"
                                checked={reviewStatus === 'Rejected'}
                                onChange={() => setReviewStatus('Rejected')}
                                className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                              />
                              <label htmlFor="reject" className="ml-2 block text-sm text-gray-900">
                                Reject
                              </label>
                            </div>
                          </div>
                        </div>

                        {reviewStatus === 'Rejected' && (
                          <div className="mb-4">
                            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-900">
                              Rejection Reason
                            </label>
                            <div className="mt-2">
                              <textarea
                                id="rejectionReason"
                                name="rejectionReason"
                                rows={3}
                                required
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        )}

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                          <button
                            type="submit"
                            disabled={isReviewing}
                            className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:col-start-2 disabled:opacity-70"
                          >
                            {isReviewing ? "Processing..." : "Submit Review"}
                          </button>
                          <button
                            type="button"
                            disabled={isReviewing}
                            onClick={() => setSelectedInvestment(null)}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
