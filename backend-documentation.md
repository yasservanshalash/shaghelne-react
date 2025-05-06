# Freelance Platform Backend Documentation

## Overview
This document provides a comprehensive overview of the backend architecture for the Shaghelne Freelance Platform. The backend is built using Next.js API routes with MongoDB as the database, accessed through Prisma ORM.

## Table of Contents
- [Models](#models)
- [Controllers](#controllers)
- [Services](#services)
- [API Routes](#api-routes)

## Models

The following models are defined in the Prisma schema:

### User
```prisma
model User {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  email        String   @unique
  name         String
  password     String
  role         Role     @default(USER)
  phoneNumber  String?
  profileImage String?
  bio          String?
  location     Json? // { city: string, subCity: string, specificArea: string }
  skills       String[]
  portfolio    Json[] // Array of portfolio items
  languages    Json[] // Array of language proficiencies
  education    Json[] // Array of education history
  experience   Json[] // Array of work experience

  // Verification fields
  isVerified          Boolean @default(false)
  verificationDetails Json?

  // Rating and stats
  rating        Float?
  totalReviews  Int    @default(0)
  completedJobs Int    @default(0)

  // Relations
  services         Service[]
  projects         Project[]
  proposals        Proposal[]
  reviews          Review[]
  sentMessages     Message[]        @relation("SentMessages")
  receivedMessages Message[]        @relation("ReceivedMessages")
  payments         Payment[]
  postedJobs       Job[]
  jobApplications  JobApplication[]

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
**Description**: Represents a user in the system with different roles (user, freelancer, employer, admin). Stores personal information, verification details, ratings, and relationships to other entities.

### Service
```prisma
model Service {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  price       Float
  category    String
  status      ServiceStatus @default(ACTIVE)

  // Service details
  deliveryTime Int // in days
  revisions    Int
  features     String[]
  requirements String?

  // Media
  images      String[]
  attachments String[]

  // Relations
  userId  String   @db.ObjectId
  user    User     @relation(fields: [userId], references: [id])
  reviews Review[]

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
**Description**: Represents a service offered by a freelancer, including pricing, delivery details, and related media.

### Project
```prisma
model Project {
  id          String        @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  budget      Float
  deadline    DateTime
  status      ProjectStatus @default(OPEN)

  // Project details
  category    String
  skills      String[]
  attachments String[]

  // Relations
  userId    String     @db.ObjectId
  user      User       @relation(fields: [userId], references: [id])
  proposals Proposal[]

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
**Description**: Represents a project posted by an employer, including budget, deadline, and requirements.

### Job
```prisma
model Job {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  title        String
  description  String
  salary       Float
  jobType      JobType  @default(FULL_TIME)
  location     Json? // { city, subCity, specificArea }
  category     String
  requirements String[]

  // Company details
  company Json // { name, size, industry, etc. }

  // Status
  status JobStatus @default(OPEN)

  // Relations
  userId       String           @db.ObjectId
  user         User             @relation(fields: [userId], references: [id])
  applications JobApplication[]

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
**Description**: Represents a job posting with details about role, responsibilities, and company information.

### JobApplication
```prisma
model JobApplication {
  id             String               @id @default(auto()) @map("_id") @db.ObjectId
  coverLetter    String
  expectedSalary Float?
  status         JobApplicationStatus @default(PENDING)

  // Relations
  jobId  String @db.ObjectId
  job    Job    @relation(fields: [jobId], references: [id])
  userId String @db.ObjectId
  user   User   @relation(fields: [userId], references: [id])

  // Additional details
  attachments String[]

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
**Description**: Represents a user's application for a specific job posting.

### Proposal
```prisma
model Proposal {
  id          String         @id @default(auto()) @map("_id") @db.ObjectId
  coverLetter String
  price       Float
  timeframe   Int // in days
  status      ProposalStatus @default(PENDING)

  // Relations
  projectId String  @db.ObjectId
  project   Project @relation(fields: [projectId], references: [id])
  userId    String  @db.ObjectId
  user      User    @relation(fields: [userId], references: [id])

  // Additional details
  attachments String[]
  milestones  Json[]

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
**Description**: Represents a freelancer's proposal for a specific project, including pricing, timeframe, and milestones.

### Review
```prisma
model Review {
  id      String @id @default(auto()) @map("_id") @db.ObjectId
  rating  Float
  comment String

  // Specific ratings
  communication Float
  quality       Float
  timeliness    Float

  // Relations
  userId    String  @db.ObjectId
  user      User    @relation(fields: [userId], references: [id])
  serviceId String  @db.ObjectId
  service   Service @relation(fields: [serviceId], references: [id])

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
**Description**: Represents a review given to a service, including overall and specific ratings.

### Enums
The system uses several enumerations to define possible states:

```prisma
enum Role {
  USER
  FREELANCER
  EMPLOYER
  ADMIN
}

enum ProjectStatus {
  OPEN
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum ProposalStatus {
  PENDING
  ACCEPTED
  REJECTED
  WITHDRAWN
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum ServiceStatus {
  ACTIVE
  PAUSED
  DELETED
}

enum JobStatus {
  OPEN
  CLOSED
  DRAFT
}

enum JobType {
  FULL_TIME
  PART_TIME
  CONTRACT
  FREELANCE
  INTERNSHIP
}

enum JobApplicationStatus {
  PENDING
  ACCEPTED
  REJECTED
  WITHDRAWN
}

enum PaymentType {
  PAYMENT
  WITHDRAWAL
  REFUND
}
``` 

## Services

Services handle the business logic and data access layer, interacting with the database through Prisma.

### AuthService (`authService.ts`)
Manages authentication-related business logic.

**Methods:**
- `generateToken(userId: string)`: Generates a JWT token for user authentication
- `register(input: RegisterInput)`: Registers a new user and returns token
- `login(input: LoginInput)`: Authenticates a user and returns token
- `updateProfile(userId: string, data: UpdateProfileInput)`: Updates user profile
- `resetPassword(token: string, newPassword: string)`: Resets password with token
- `changePassword(userId: string, oldPassword: string, newPassword: string)`: Changes password

**Example:**
```typescript
static async register(input: RegisterInput) {
  const { email, password, name, role } = input;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role
    }
  });

  // Generate token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
}
```

### UserService (`userService.ts`)
Manages user-related business logic.

**Methods:**
- `getById(userId: string)`: Gets a user by ID
- `getProfile(userId: string)`: Gets the current user's profile
- `updateProfile(userId: string, data: any)`: Updates user profile
- `uploadProfileImage(userId: string, imageUrl: string)`: Updates profile image
- `searchUsers(criteria: any)`: Searches for users based on criteria
- `getPortfolio(userId: string)`: Gets a user's portfolio
- `updatePortfolio(userId: string, portfolio: any)`: Updates a user's portfolio
- `getFreelancers(filters: any)`: Gets freelancers based on filters

### ServiceService (`serviceService.ts`)
Manages service-related business logic.

**Methods:**
- `getAll(filters: any)`: Gets all services with filtering
- `getById(serviceId: string)`: Gets a service by ID
- `create(userId: string, data: any)`: Creates a new service
- `update(serviceId: string, data: any)`: Updates a service
- `delete(serviceId: string)`: Deletes a service
- `getByUser(userId: string)`: Gets services by user
- `uploadImage(serviceId: string, imageUrl: string)`: Uploads service image
- `search(criteria: any)`: Searches for services

### ProjectService (`projectService.ts`)
Manages project-related business logic.

**Methods:**
- `getAll(filters: any)`: Gets all projects with filtering
- `getById(projectId: string)`: Gets a project by ID
- `create(userId: string, data: any)`: Creates a new project
- `update(projectId: string, data: any)`: Updates a project
- `delete(projectId: string)`: Deletes a project
- `getByUser(userId: string)`: Gets projects by user
- `search(criteria: any)`: Searches for projects
- `getProposals(projectId: string)`: Gets proposals for a project

### JobService (`jobService.ts`)
Manages job-related business logic.

**Methods:**
- `getAll(filters: any)`: Gets all jobs with filtering
- `getById(jobId: string)`: Gets a job by ID
- `create(userId: string, data: any)`: Creates a new job
- `update(jobId: string, data: any)`: Updates a job
- `delete(jobId: string)`: Deletes a job
- `getByUser(userId: string)`: Gets jobs by user
- `search(criteria: any)`: Searches for jobs
- `getApplications(jobId: string)`: Gets applications for a job

### JobApplicationService (`jobApplicationService.ts`)
Manages job application business logic.

**Methods:**
- `getAll(filters: any)`: Gets all applications with filtering
- `getById(applicationId: string)`: Gets an application by ID
- `create(userId: string, jobId: string, data: any)`: Creates a new application
- `update(applicationId: string, data: any)`: Updates an application
- `withdraw(applicationId: string)`: Withdraws an application
- `getByUser(userId: string)`: Gets applications by user
- `approve(applicationId: string)`: Approves an application
- `reject(applicationId: string)`: Rejects an application

### ProposalService (`proposalService.ts`)
Manages proposal business logic.

**Methods:**
- `getAll(filters: any)`: Gets all proposals with filtering
- `getById(proposalId: string)`: Gets a proposal by ID
- `create(userId: string, projectId: string, data: any)`: Creates a new proposal
- `update(proposalId: string, data: any)`: Updates a proposal
- `withdraw(proposalId: string)`: Withdraws a proposal
- `getByUser(userId: string)`: Gets proposals by user
- `getByProject(projectId: string)`: Gets proposals for a project
- `approve(proposalId: string)`: Approves a proposal
- `reject(proposalId: string)`: Rejects a proposal

### ReviewService (`reviewService.ts`)
Manages review business logic.

**Methods:**
- `getAll(filters: any)`: Gets all reviews with filtering
- `getById(reviewId: string)`: Gets a review by ID
- `create(userId: string, serviceId: string, data: any)`: Creates a new review
- `update(reviewId: string, data: any)`: Updates a review
- `delete(reviewId: string)`: Deletes a review
- `getByService(serviceId: string)`: Gets reviews for a service
- `getByUser(userId: string)`: Gets reviews for a user

### MessageService (`messageService.ts`)
Manages messaging business logic.

**Methods:**
- `getAll(userId: string)`: Gets all messages for a user
- `getById(messageId: string)`: Gets a message by ID
- `create(senderId: string, receiverId: string, data: any)`: Creates a new message
- `getConversation(userId1: string, userId2: string)`: Gets conversation between users
- `markAsRead(messageId: string)`: Marks a message as read
- `delete(messageId: string)`: Deletes a message

### PaymentService (`paymentService.ts`)
Manages payment business logic.

**Methods:**
- `getAll(userId: string)`: Gets all payments for a user
- `getById(paymentId: string)`: Gets a payment by ID
- `create(data: any)`: Creates a new payment record
- `verify(paymentId: string)`: Verifies a payment
- `getHistory(userId: string)`: Gets payment history
- `getEarnings(userId: string)`: Gets earnings summary
- `withdraw(userId: string, amount: number)`: Processes a withdrawal

### NotificationService (`notificationService.ts`)
Manages notification business logic.

**Methods:**
- `getAll(userId: string)`: Gets all notifications for a user
- `getById(notificationId: string)`: Gets a notification by ID
- `create(data: any)`: Creates a new notification
- `markAsRead(notificationId: string)`: Marks a notification as read
- `markAllAsRead(userId: string)`: Marks all notifications as read
- `delete(notificationId: string)`: Deletes a notification

### CategoryService (`categoryService.ts`)
Manages category business logic.

**Methods:**
- `getAll()`: Gets all categories
- `getById(categoryId: string)`: Gets a category by ID
- `create(data: any)`: Creates a new category
- `update(categoryId: string, data: any)`: Updates a category
- `delete(categoryId: string)`: Deletes a category

## Controllers

The controllers handle HTTP requests and responses, implementing the business logic through services.

### AuthController (`authController.ts`)
Manages user authentication and identity verification.

**Methods:**
- `register(req: NextRequest)`: Registers a new user with validation for email, password, and role
- `login(req: NextRequest)`: Authenticates a user and returns a JWT token
- `logout(req: NextRequest)`: Logs out a user (invalidates token)
- `updateProfile(req: NextRequest)`: Updates user profile information
- `changePassword(req: NextRequest)`: Updates a user's password
- `forgotPassword(req: NextRequest)`: Initiates password reset process
- `verifyEmail(req: NextRequest)`: Verifies a user's email address
- `resetPassword(req: NextRequest)`: Resets password using a valid token

**Example:**
```typescript
static async register(req: NextRequest) {
  try {
    const body: RegisterBody = await req.json();
    
    // Validation...
    
    const { user, token } = await AuthService.register(body);
    
    // Create welcome notification
    await NotificationService.create({
      userId: user.id,
      title: 'Welcome to Shaghelne!',
      message: 'Thank you for joining our platform.',
      type: 'SYSTEM'
    });

    return NextResponse.json(
      { user, token },
      { status: 201 }
    );
  } catch (error: any) {
    // Error handling...
  }
}
```

### UserController (`userController.ts`)
Manages user profiles and operations.

**Methods:**
- `getUserById(req: NextRequest, { params })`: Retrieves a user by ID
- `getProfile(req: NextRequest)`: Gets the current user's profile
- `updateProfile(req: NextRequest)`: Updates user profile
- `uploadProfileImage(req: NextRequest)`: Uploads and associates a profile image
- `searchUsers(req: NextRequest)`: Searches for users based on criteria
- `getPortfolio(req: NextRequest, { params })`: Gets a user's portfolio
- `updatePortfolio(req: NextRequest)`: Updates a user's portfolio
- `getFreelancers(req: NextRequest)`: Gets a list of freelancers with optional filtering

### ServiceController (`serviceController.ts`)
Manages freelancer services.

**Methods:**
- `getAll(req: NextRequest)`: Gets all services with optional filtering
- `getById(req: NextRequest, { params })`: Gets a specific service by ID
- `create(req: NextRequest)`: Creates a new service
- `update(req: NextRequest, { params })`: Updates an existing service
- `delete(req: NextRequest, { params })`: Deletes a service
- `getByUser(req: NextRequest, { params })`: Gets all services for a specific user
- `uploadImage(req: NextRequest, { params })`: Uploads and associates images with a service
- `search(req: NextRequest)`: Searches for services based on criteria

### ProjectController (`projectController.ts`)
Manages employer projects.

**Methods:**
- `getAll(req: NextRequest)`: Gets all projects with optional filtering
- `getById(req: NextRequest, { params })`: Gets a specific project by ID
- `create(req: NextRequest)`: Creates a new project
- `update(req: NextRequest, { params })`: Updates an existing project
- `delete(req: NextRequest, { params })`: Deletes a project
- `getByUser(req: NextRequest, { params })`: Gets all projects for a specific user
- `search(req: NextRequest)`: Searches for projects based on criteria
- `getProposals(req: NextRequest, { params })`: Gets all proposals for a specific project

### JobController (`jobController.ts`)
Manages job postings.

**Methods:**
- `getAll(req: NextRequest)`: Gets all jobs with optional filtering
- `getById(req: NextRequest, { params })`: Gets a specific job by ID
- `create(req: NextRequest)`: Creates a new job posting
- `update(req: NextRequest, { params })`: Updates an existing job posting
- `delete(req: NextRequest, { params })`: Deletes a job posting
- `getByUser(req: NextRequest, { params })`: Gets all jobs posted by a specific user
- `search(req: NextRequest)`: Searches for jobs based on criteria
- `getApplications(req: NextRequest, { params })`: Gets all applications for a specific job

### JobApplicationController (`jobApplicationController.ts`)
Manages job applications.

**Methods:**
- `getAll(req: NextRequest)`: Gets all job applications with optional filtering
- `getById(req: NextRequest, { params })`: Gets a specific job application by ID
- `create(req: NextRequest)`: Creates a new job application
- `update(req: NextRequest, { params })`: Updates an existing job application
- `withdraw(req: NextRequest, { params })`: Withdraws a job application
- `getByUser(req: NextRequest)`: Gets all job applications for the current user
- `approve(req: NextRequest, { params })`: Approves a job application
- `reject(req: NextRequest, { params })`: Rejects a job application

### ProposalController (`proposalController.ts`)
Manages project proposals.

**Methods:**
- `getAll(req: NextRequest)`: Gets all proposals with optional filtering
- `getById(req: NextRequest, { params })`: Gets a specific proposal by ID
- `create(req: NextRequest)`: Creates a new proposal for a project
- `update(req: NextRequest, { params })`: Updates an existing proposal
- `withdraw(req: NextRequest, { params })`: Withdraws a proposal
- `getByUser(req: NextRequest)`: Gets all proposals by the current user
- `getByProject(req: NextRequest, { params })`: Gets all proposals for a specific project
- `approve(req: NextRequest, { params })`: Approves a proposal
- `reject(req: NextRequest, { params })`: Rejects a proposal

### ReviewController (`reviewController.ts`)
Manages service and user reviews.

**Methods:**
- `getAll(req: NextRequest)`: Gets all reviews with optional filtering
- `getById(req: NextRequest, { params })`: Gets a specific review by ID
- `create(req: NextRequest)`: Creates a new review
- `update(req: NextRequest, { params })`: Updates an existing review
- `delete(req: NextRequest, { params })`: Deletes a review
- `getByService(req: NextRequest, { params })`: Gets all reviews for a specific service
- `getByUser(req: NextRequest, { params })`: Gets all reviews for a specific user

### MessageController (`messageController.ts`)
Manages messaging between users.

**Methods:**
- `getAll(req: NextRequest)`: Gets all messages for the current user
- `getById(req: NextRequest, { params })`: Gets a specific message by ID
- `create(req: NextRequest)`: Creates a new message
- `getConversation(req: NextRequest, { params })`: Gets all messages between two users
- `markAsRead(req: NextRequest, { params })`: Marks a message as read
- `delete(req: NextRequest, { params })`: Deletes a message

### PaymentController (`paymentController.ts`)
Manages payment transactions.

**Methods:**
- `getAll(req: NextRequest)`: Gets all payments for the current user
- `getById(req: NextRequest, { params })`: Gets a specific payment by ID
- `create(req: NextRequest)`: Creates a new payment
- `verify(req: NextRequest, { params })`: Verifies a payment
- `getHistory(req: NextRequest)`: Gets payment history for the current user
- `getEarnings(req: NextRequest)`: Gets earnings summary for a freelancer
- `withdraw(req: NextRequest)`: Processes a withdrawal request

### NotificationController (`notificationController.ts`)
Manages user notifications.

**Methods:**
- `getAll(req: NextRequest)`: Gets all notifications for the current user
- `getById(req: NextRequest, { params })`: Gets a specific notification by ID
- `create(req: NextRequest)`: Creates a new notification
- `markAsRead(req: NextRequest, { params })`: Marks a notification as read
- `markAllAsRead(req: NextRequest)`: Marks all notifications as read
- `delete(req: NextRequest, { params })`: Deletes a notification

### CategoryController (`categoryController.ts`)
Manages service, project, and job categories.

**Methods:**
- `getAll(req: NextRequest)`: Gets all categories
- `getById(req: NextRequest, { params })`: Gets a specific category by ID
- `create(req: NextRequest)`: Creates a new category
- `update(req: NextRequest, { params })`: Updates an existing category
- `delete(req: NextRequest, { params })`: Deletes a category

## API Routes

The application uses Next.js API Routes to define the RESTful endpoints.

### Authentication Routes

#### `/api/auth/register`
- **POST**: Register a new user
  - Body: `{ email, password, name, role }`
  - Returns: User object and JWT token

#### `/api/auth/login`
- **POST**: Authenticate a user
  - Body: `{ email, password }`
  - Returns: User object and JWT token

#### `/api/auth/logout`
- **POST**: Log out a user (invalidate token)
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

#### `/api/auth/reset-password`
- **POST**: Reset password using token
  - Body: `{ token, newPassword }`
  - Returns: Success message

#### `/api/auth/forgot-password`
- **POST**: Request password reset
  - Body: `{ email }`
  - Returns: Success message

#### `/api/auth/verify-email`
- **POST**: Verify email address
  - Body: `{ token }`
  - Returns: Success message

### User Routes

#### `/api/users/profile`
- **GET**: Get current user's profile
  - Headers: `Authorization: Bearer {token}`
  - Returns: User profile

- **PUT**: Update current user's profile
  - Headers: `Authorization: Bearer {token}`
  - Body: Profile update fields
  - Returns: Updated profile

#### `/api/users/[id]`
- **GET**: Get user by ID
  - Returns: User profile

#### `/api/users/search`
- **GET**: Search users
  - Query parameters: Search criteria
  - Returns: List of matching users

#### `/api/users/freelancers`
- **GET**: Get all freelancers
  - Query parameters: Filters
  - Returns: List of freelancers

#### `/api/users/[id]/portfolio`
- **GET**: Get user's portfolio
  - Returns: Portfolio items

- **PUT**: Update user's portfolio
  - Headers: `Authorization: Bearer {token}`
  - Body: Portfolio items
  - Returns: Updated portfolio

### Service Routes

#### `/api/services`
- **GET**: Get all services
  - Query parameters: Filters
  - Returns: List of services

- **POST**: Create a new service
  - Headers: `Authorization: Bearer {token}`
  - Body: Service details
  - Returns: Created service

#### `/api/services/[id]`
- **GET**: Get service by ID
  - Returns: Service details

- **PUT**: Update a service
  - Headers: `Authorization: Bearer {token}`
  - Body: Updated service details
  - Returns: Updated service

- **DELETE**: Delete a service
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

#### `/api/services/user/[userId]`
- **GET**: Get services by user
  - Returns: List of services

#### `/api/services/search`
- **GET**: Search services
  - Query parameters: Search criteria
  - Returns: List of matching services

### Project Routes

#### `/api/projects`
- **GET**: Get all projects
  - Query parameters: Filters
  - Returns: List of projects

- **POST**: Create a new project
  - Headers: `Authorization: Bearer {token}`
  - Body: Project details
  - Returns: Created project

#### `/api/projects/[id]`
- **GET**: Get project by ID
  - Returns: Project details

- **PUT**: Update a project
  - Headers: `Authorization: Bearer {token}`
  - Body: Updated project details
  - Returns: Updated project

- **DELETE**: Delete a project
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

#### `/api/projects/user/[userId]`
- **GET**: Get projects by user
  - Returns: List of projects

#### `/api/projects/search`
- **GET**: Search projects
  - Query parameters: Search criteria
  - Returns: List of matching projects

#### `/api/projects/[id]/proposals`
- **GET**: Get proposals for a project
  - Headers: `Authorization: Bearer {token}`
  - Returns: List of proposals

### Job Routes

#### `/api/jobs`
- **GET**: Get all jobs
  - Query parameters: Filters
  - Returns: List of jobs

- **POST**: Create a new job
  - Headers: `Authorization: Bearer {token}`
  - Body: Job details
  - Returns: Created job

#### `/api/jobs/[id]`
- **GET**: Get job by ID
  - Returns: Job details

- **PUT**: Update a job
  - Headers: `Authorization: Bearer {token}`
  - Body: Updated job details
  - Returns: Updated job

- **DELETE**: Delete a job
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

#### `/api/jobs/user/[userId]`
- **GET**: Get jobs by user
  - Returns: List of jobs

#### `/api/jobs/search`
- **GET**: Search jobs
  - Query parameters: Search criteria
  - Returns: List of matching jobs

#### `/api/jobs/[id]/applications`
- **GET**: Get applications for a job
  - Headers: `Authorization: Bearer {token}`
  - Returns: List of applications

### Job Application Routes

#### `/api/job-applications`
- **GET**: Get all applications
  - Headers: `Authorization: Bearer {token}`
  - Query parameters: Filters
  - Returns: List of applications

- **POST**: Create a new application
  - Headers: `Authorization: Bearer {token}`
  - Body: Application details
  - Returns: Created application

#### `/api/job-applications/[id]`
- **GET**: Get application by ID
  - Headers: `Authorization: Bearer {token}`
  - Returns: Application details

- **PUT**: Update an application
  - Headers: `Authorization: Bearer {token}`
  - Body: Updated application details
  - Returns: Updated application

#### `/api/job-applications/[id]/withdraw`
- **PUT**: Withdraw an application
  - Headers: `Authorization: Bearer {token}`
  - Returns: Updated application

#### `/api/job-applications/user`
- **GET**: Get applications by current user
  - Headers: `Authorization: Bearer {token}`
  - Returns: List of applications

#### `/api/job-applications/[id]/approve`
- **PUT**: Approve an application
  - Headers: `Authorization: Bearer {token}`
  - Returns: Updated application

#### `/api/job-applications/[id]/reject`
- **PUT**: Reject an application
  - Headers: `Authorization: Bearer {token}`
  - Returns: Updated application

### Proposal Routes

#### `/api/propsal` (note the typo in directory name)
- **GET**: Get all proposals
  - Headers: `Authorization: Bearer {token}`
  - Query parameters: Filters
  - Returns: List of proposals

- **POST**: Create a new proposal
  - Headers: `Authorization: Bearer {token}`
  - Body: Proposal details
  - Returns: Created proposal

#### `/api/propsal/[id]`
- **GET**: Get proposal by ID
  - Headers: `Authorization: Bearer {token}`
  - Returns: Proposal details

- **PUT**: Update a proposal
  - Headers: `Authorization: Bearer {token}`
  - Body: Updated proposal details
  - Returns: Updated proposal

#### `/api/propsal/[id]/withdraw`
- **PUT**: Withdraw a proposal
  - Headers: `Authorization: Bearer {token}`
  - Returns: Updated proposal

#### `/api/propsal/user`
- **GET**: Get proposals by current user
  - Headers: `Authorization: Bearer {token}`
  - Returns: List of proposals

#### `/api/propsal/project/[projectId]`
- **GET**: Get proposals for a project
  - Headers: `Authorization: Bearer {token}`
  - Returns: List of proposals

#### `/api/propsal/[id]/approve`
- **PUT**: Approve a proposal
  - Headers: `Authorization: Bearer {token}`
  - Returns: Updated proposal

#### `/api/propsal/[id]/reject`
- **PUT**: Reject a proposal
  - Headers: `Authorization: Bearer {token}`
  - Returns: Updated proposal

### Review Routes

#### `/api/reviews`
- **GET**: Get all reviews
  - Query parameters: Filters
  - Returns: List of reviews

- **POST**: Create a new review
  - Headers: `Authorization: Bearer {token}`
  - Body: Review details
  - Returns: Created review

#### `/api/reviews/[id]`
- **GET**: Get review by ID
  - Returns: Review details

- **PUT**: Update a review
  - Headers: `Authorization: Bearer {token}`
  - Body: Updated review details
  - Returns: Updated review

- **DELETE**: Delete a review
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

#### `/api/reviews/service/[serviceId]`
- **GET**: Get reviews for a service
  - Returns: List of reviews

#### `/api/reviews/user/[userId]`
- **GET**: Get reviews for a user
  - Returns: List of reviews

### Message Routes

#### `/api/messages`
- **GET**: Get all messages for current user
  - Headers: `Authorization: Bearer {token}`
  - Returns: List of messages

- **POST**: Create a new message
  - Headers: `Authorization: Bearer {token}`
  - Body: Message details
  - Returns: Created message

#### `/api/messages/[id]`
- **GET**: Get message by ID
  - Headers: `Authorization: Bearer {token}`
  - Returns: Message details

- **DELETE**: Delete a message
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

#### `/api/messages/conversation/[userId]`
- **GET**: Get conversation with another user
  - Headers: `Authorization: Bearer {token}`
  - Returns: List of messages

#### `/api/messages/[id]/read`
- **PUT**: Mark a message as read
  - Headers: `Authorization: Bearer {token}`
  - Returns: Updated message

### Payment Routes

#### `/api/payments`
- **GET**: Get all payments for current user
  - Headers: `Authorization: Bearer {token}`
  - Returns: List of payments

- **POST**: Create a new payment
  - Headers: `Authorization: Bearer {token}`
  - Body: Payment details
  - Returns: Created payment

#### `/api/payments/[id]`
- **GET**: Get payment by ID
  - Headers: `Authorization: Bearer {token}`
  - Returns: Payment details

#### `/api/payments/[id]/verify`
- **PUT**: Verify a payment
  - Headers: `Authorization: Bearer {token}`
  - Returns: Updated payment

#### `/api/payments/history`
- **GET**: Get payment history
  - Headers: `Authorization: Bearer {token}`
  - Returns: Payment history

#### `/api/payments/earnings`
- **GET**: Get earnings summary
  - Headers: `Authorization: Bearer {token}`
  - Returns: Earnings data

#### `/api/payments/withdraw`
- **POST**: Process a withdrawal
  - Headers: `Authorization: Bearer {token}`
  - Body: Withdrawal details
  - Returns: Withdrawal record

### Notification Routes

#### `/api/notifications`
- **GET**: Get all notifications for current user
  - Headers: `Authorization: Bearer {token}`
  - Returns: List of notifications

- **POST**: Create a new notification
  - Headers: `Authorization: Bearer {token}`
  - Body: Notification details
  - Returns: Created notification

#### `/api/notifications/[id]`
- **GET**: Get notification by ID
  - Headers: `Authorization: Bearer {token}`
  - Returns: Notification details

- **DELETE**: Delete a notification
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

#### `/api/notifications/[id]/read`
- **PUT**: Mark a notification as read
  - Headers: `Authorization: Bearer {token}`
  - Returns: Updated notification

#### `/api/notifications/read-all`
- **PUT**: Mark all notifications as read
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message

### Category Routes

#### `/api/categories`
- **GET**: Get all categories
  - Returns: List of categories

- **POST**: Create a new category
  - Headers: `Authorization: Bearer {token}`
  - Body: Category details
  - Returns: Created category

#### `/api/categories/[id]`
- **GET**: Get category by ID
  - Returns: Category details

- **PUT**: Update a category
  - Headers: `Authorization: Bearer {token}`
  - Body: Updated category details
  - Returns: Updated category

- **DELETE**: Delete a category
  - Headers: `Authorization: Bearer {token}`
  - Returns: Success message 