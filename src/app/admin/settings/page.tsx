"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Mega Invest",
    siteDescription: "Premium Investment Opportunities",
    contactEmail: "contact@megainvest.com",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Financial District, New York, NY 10005",
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@megainvest.com",
    smtpPassword: "••••••••••••",
    fromEmail: "notifications@megainvest.com",
    fromName: "Mega Invest",
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: "60",
    passwordMinLength: "8",
    requireSpecialChars: true,
    requireNumbers: true,
  });

  // Handle general settings change
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle email settings change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle security settings change
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // In a real application, this would save to a database or API
      // For now, we'll just simulate a delay and show success
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage("Settings saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage("An error occurred while saving settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure system settings and preferences.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("general")}
              className={`${
                activeTab === "general"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium admin-panel-text`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`${
                activeTab === "email"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium admin-panel-text`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`${
                activeTab === "security"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium admin-panel-text`}
            >
              Security
            </button>
          </nav>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mt-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab content */}
        <div className="mt-8">
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                    Site Name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                    Site Description
                  </label>
                  <textarea
                    name="siteDescription"
                    id="siteDescription"
                    rows={3}
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    id="contactEmail"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={generalSettings.phoneNumber}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    value={generalSettings.address}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === "email" && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    name="smtpServer"
                    id="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={handleEmailChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div>
                  <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    name="smtpPort"
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={handleEmailChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div>
                  <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    name="smtpUsername"
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={handleEmailChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div>
                  <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    name="smtpPassword"
                    id="smtpPassword"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div>
                  <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">
                    From Email
                  </label>
                  <input
                    type="email"
                    name="fromEmail"
                    id="fromEmail"
                    value={emailSettings.fromEmail}
                    onChange={handleEmailChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div>
                  <label htmlFor="fromName" className="block text-sm font-medium text-gray-700">
                    From Name
                  </label>
                  <input
                    type="text"
                    name="fromName"
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={handleEmailChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableTwoFactor"
                    id="enableTwoFactor"
                    checked={securitySettings.enableTwoFactor}
                    onChange={handleSecurityChange}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="enableTwoFactor" className="ml-2 block text-sm font-medium text-gray-700">
                    Enable Two-Factor Authentication
                  </label>
                </div>

                <div>
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    id="sessionTimeout"
                    min="5"
                    max="1440"
                    value={securitySettings.sessionTimeout}
                    onChange={handleSecurityChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div>
                  <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    name="passwordMinLength"
                    id="passwordMinLength"
                    min="6"
                    max="32"
                    value={securitySettings.passwordMinLength}
                    onChange={handleSecurityChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm admin-panel-text"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="requireSpecialChars"
                    id="requireSpecialChars"
                    checked={securitySettings.requireSpecialChars}
                    onChange={handleSecurityChange}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="requireSpecialChars" className="ml-2 block text-sm font-medium text-gray-700">
                    Require Special Characters in Passwords
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="requireNumbers"
                    id="requireNumbers"
                    checked={securitySettings.requireNumbers}
                    onChange={handleSecurityChange}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="requireNumbers" className="ml-2 block text-sm font-medium text-gray-700">
                    Require Numbers in Passwords
                  </label>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="small" color="white" />
                    <span className="ml-2">Saving...</span>
                  </div>
                ) : (
                  "Save Settings"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
