# Database Seeder

This directory contains scripts for seeding the MongoDB database with sample data for development purposes.

## Seed Script

The `seed.ts` script populates the database with:

- 5 users (admin, employer, 2 freelancers, and a regular user)
- 3 services
- 2 jobs
- 2 projects
- 2 reviews
- 2 job applications
- 2 proposals

## How to Use

To seed the database:

1. Make sure MongoDB is running
2. Make sure your `.env` file is set up with the correct `MONGODB_URI`
3. Run the following command from the backend directory:

```bash
npm run seed
```

## User Credentials

All seeded users have the same password: `password123`

You can log in with the following credentials:

- Admin: admin@freeio.com / password123
- Employer: employer1@freeio.com / password123
- Freelancer 1: freelancer1@freeio.com / password123
- Freelancer 2: freelancer2@freeio.com / password123
- Regular User: user1@freeio.com / password123

## Notes

- Running the seed script will clear all existing data in the database
- This script is intended for development use only and should not be run in production
- You can modify the sample data in the `seed.ts` file to add more entries or change existing ones 