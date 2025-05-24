# Mega Invest - Premium Investment Platform

A Next.js application for showcasing and managing investment opportunities.

## Improvements Made

### Security Enhancements
- Implemented password hashing with bcrypt
- Moved sensitive data to environment variables
- Enhanced authentication flow with better session management
- Added security headers in middleware

### Error Handling
- Created custom error classes for different types of errors
- Implemented consistent error logging
- Added structured API responses for better error handling
- Improved client-side error handling with user-friendly messages

### UI/UX Improvements
- Added loading spinners and skeleton loaders for better loading states
- Improved error messages with retry functionality
- Enhanced responsive design

### Code Structure
- Improved type safety with TypeScript
- Created reusable components for common UI elements
- Implemented better separation of concerns

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with the following variables:
```
# Admin credentials
ADMIN_EMAIL=mail@mail.com
ADMIN_PASSWORD="YourStrongPasswordHere"

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_key_change_this_in_production
# IMPORTANT: The JWT_SECRET is critical for securing user sessions and preventing token forgery.
# It MUST be a strong, unique, and random string. 
# Keep this secret confidential and ensure it is different for every production environment.
# You can generate a suitable secret using a command like: openssl rand -hex 32

# Supabase credentials (for future use)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app` - Next.js app router pages and API routes
- `src/components` - Reusable React components
- `src/lib` - Utility functions and database operations
- `src/data` - JSON data files (used as a simple database)

## Key Features

- Browse investment opportunities
- View detailed investment information
- Admin panel for managing investments
- Contact form for lead generation
- User authentication

## Admin Access

To access the admin panel, go to [http://localhost:3000/admin](http://localhost:3000/admin).

The application uses the administrator credentials defined in your `.env.local` file:
- `ADMIN_EMAIL`: The email address for the admin account.
- `ADMIN_PASSWORD`: The password for the admin account.

Please ensure you have set these environment variables as described in the "Installation" section. The application is configured to use these credentials for the initial admin setup and for validating administrative access.

## Future Improvements

### Database Migration
- Move from JSON files to a proper database (Supabase is partially set up)
- Implement proper database schemas and migrations

### Authentication
- Implement JWT tokens for more secure authentication
- Add proper token validation and expiration
- Consider using NextAuth.js for a more robust solution

### Testing
- Add unit tests for components and utilities
- Implement integration tests for critical flows
- Add end-to-end tests

### Deployment
- Set up CI/CD pipeline
- Configure proper caching and performance optimizations
- Implement monitoring and error tracking

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
