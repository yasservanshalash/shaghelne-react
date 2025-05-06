# Freeio - Freelance Marketplace Backend

This is the backend API for the Freeio Freelance Marketplace platform.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- TypeScript
- JSON Web Tokens (JWT)
- bcrypt

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**
   ```
   cd backend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root of the backend directory with the following variables:
   ```
   MONGODB_URL=mongodb://localhost:27017/freeio-db
   JWT_SECRET=your_jwt_secret_key
   PORT=8000
   ```

4. **Run the development server**
   ```
   npm run dev
   ```

5. **Build for production**
   ```
   npm run build
   ```

## API Documentation

### Authentication Endpoints

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login a user
- **POST /api/auth/forgot-password** - Send password reset email
- **POST /api/auth/reset-password** - Reset password with token
- **POST /api/auth/verify-email** - Verify email address

### User Endpoints

- **GET /api/users** - Get all users (admin only)
- **GET /api/users/profile** - Get current user profile
- **GET /api/users/:id** - Get user by ID
- **PUT /api/users/profile** - Update current user profile
- **GET /api/users/search** - Search users
- **GET /api/users/freelancers** - Get all freelancers
- **GET /api/users/:id/portfolio** - Get user portfolio
- **PUT /api/users/:id/portfolio** - Update user portfolio

### Service Endpoints

- **GET /api/services** - Get all services
- **GET /api/services/:id** - Get service by ID
- **POST /api/services** - Create a new service
- **PUT /api/services/:id** - Update a service
- **DELETE /api/services/:id** - Delete a service
- **GET /api/services/user/:userId** - Get services by user
- **GET /api/services/search/query** - Search services

### Project Endpoints

- **GET /api/projects** - Get all projects
- **GET /api/projects/:id** - Get project by ID
- **POST /api/projects** - Create a new project
- **PUT /api/projects/:id** - Update a project
- **DELETE /api/projects/:id** - Delete a project
- **GET /api/projects/user/:userId** - Get projects by user
- **GET /api/projects/search** - Search projects
- **GET /api/projects/:id/proposals** - Get proposals for a project

### Job Endpoints

- **GET /api/jobs** - Get all jobs
- **GET /api/jobs/:id** - Get job by ID
- **POST /api/jobs** - Create a new job
- **PUT /api/jobs/:id** - Update a job
- **DELETE /api/jobs/:id** - Delete a job
- **GET /api/jobs/user/:userId** - Get jobs by user
- **GET /api/jobs/search** - Search jobs
- **GET /api/jobs/:id/applications** - Get applications for a job

### Job Application Endpoints

- **GET /api/job-applications** - Get all job applications
- **GET /api/job-applications/:id** - Get job application by ID
- **POST /api/job-applications** - Create a new job application
- **PUT /api/job-applications/:id** - Update a job application
- **PUT /api/job-applications/:id/withdraw** - Withdraw a job application
- **GET /api/job-applications/user** - Get applications by current user
- **PUT /api/job-applications/:id/approve** - Approve a job application
- **PUT /api/job-applications/:id/reject** - Reject a job application

### Proposal Endpoints

- **GET /api/proposals** - Get all proposals
- **GET /api/proposals/:id** - Get proposal by ID
- **POST /api/proposals** - Create a new proposal
- **PUT /api/proposals/:id** - Update a proposal
- **PUT /api/proposals/:id/withdraw** - Withdraw a proposal
- **GET /api/proposals/user** - Get proposals by current user
- **GET /api/proposals/project/:projectId** - Get proposals for a project
- **PUT /api/proposals/:id/approve** - Approve a proposal
- **PUT /api/proposals/:id/reject** - Reject a proposal

### Review Endpoints

- **GET /api/reviews** - Get all reviews
- **GET /api/reviews/:id** - Get review by ID
- **POST /api/reviews** - Create a new review
- **PUT /api/reviews/:id** - Update a review
- **DELETE /api/reviews/:id** - Delete a review
- **GET /api/reviews/service/:serviceId** - Get reviews for a service
- **GET /api/reviews/user/:userId** - Get reviews for a user 