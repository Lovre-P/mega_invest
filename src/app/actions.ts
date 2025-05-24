'use server';

import {
  submitInvestment,
  reviewInvestment,
  getInvestments,
  getInvestmentsByStatus,
  InvestmentStatus,
  Investment
} from '@/lib/server-db';
import { authenticateUser, setSessionCookie, clearSessionCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Type for investment submission form data
interface InvestmentSubmissionFormData {
  title: string;
  description: string;
  expectedReturnMin: string;
  expectedReturnMax: string;
  minimumInvestment: string;
  category: string;
  risk: string;
  detailedDescription: string;
  submitterEmail: string;
  submitterName: string;
}

// Type for investment review form data
interface InvestmentReviewFormData {
  id: string;
  status: InvestmentStatus;
  rejectionReason?: string;
}

/**
 * Server action to submit a new investment proposal
 */
export async function submitInvestmentProposal(formData: InvestmentSubmissionFormData) {
  // Validate required fields
  if (!formData.title || !formData.description || !formData.category || !formData.submitterEmail) {
    return {
      success: false,
      message: 'Missing required fields'
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.submitterEmail)) {
    return {
      success: false,
      message: 'Invalid email format'
    };
  }

  // Format the expected return range
  const expectedReturn = `${formData.expectedReturnMin}-${formData.expectedReturnMax}% annually`;

  // Format the minimum investment with dollar sign
  const minimumInvestment = `$${formData.minimumInvestment}`;

  // Create the investment object
  const investment = {
    title: formData.title,
    description: formData.description,
    expectedReturn,
    minimumInvestment,
    category: formData.category,
    risk: formData.risk,
    detailedDescription: formData.detailedDescription,
    // The status, submittedBy, and submittedAt will be set by the submitInvestment function
  };

  try {
    // Submit the investment
    const success = await submitInvestment(investment, formData.submitterEmail);

    if (success) {
      return {
        success: true,
        message: 'Investment proposal submitted successfully'
      };
    } else {
      return {
        success: false,
        message: 'Failed to submit investment proposal'
      };
    }
  } catch (error) {
    console.error('Error submitting investment:', error);
    return {
      success: false,
      message: 'An error occurred while submitting the investment proposal'
    };
  }
}

/**
 * Server action to review an investment proposal
 */
export async function reviewInvestmentProposal(formData: InvestmentReviewFormData) {
  // Validate required fields
  if (!formData.id || !formData.status) {
    return {
      success: false,
      message: 'Missing required fields'
    };
  }

  // Get the admin email from the session
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) {
    return {
      success: false,
      message: 'Not authenticated'
    };
  }

  // In a real app, you would decode the session token to get the admin email
  // For now, we'll use the admin email from the .env file
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@megainvest.com';

  try {
    // Review the investment
    const success = await reviewInvestment(
      formData.id,
      formData.status,
      adminEmail,
      formData.rejectionReason
    );

    if (success) {
      return {
        success: true,
        message: `Investment proposal ${formData.status.toLowerCase()} successfully`
      };
    } else {
      return {
        success: false,
        message: 'Failed to review investment proposal'
      };
    }
  } catch (error) {
    console.error('Error reviewing investment:', error);
    return {
      success: false,
      message: 'An error occurred while reviewing the investment proposal'
    };
  }
}

/**
 * Server action to authenticate an admin user
 */
export async function authenticateAdmin(formData: { email: string; password: string }) {
  // Validate required fields
  if (!formData.email || !formData.password) {
    return {
      success: false,
      message: 'Email and password are required'
    };
  }

  try {
    // Use the new authentication utility
    const user = await authenticateUser(formData.email, formData.password);

    if (user && (user.role === 'admin' || user.id === 'admin')) {
      // Set the session cookie
      await setSessionCookie(user);

      return {
        success: true,
        message: 'Authentication successful'
      };
    }

    return {
      success: false,
      message: 'Invalid email or password'
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return {
      success: false,
      message: 'An error occurred during authentication'
    };
  }
}

/**
 * Server action to log out an admin user
 */
export async function logoutAdmin() {
  await clearSessionCookie();
  redirect('/admin');
}

/**
 * Server action to fetch pending investments
 */
export async function getPendingInvestments(): Promise<Investment[]> {
  // Use the server-side function to get pending investments
  return getInvestmentsByStatus('Pending');
}
