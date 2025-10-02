# Vercel Database Setup Guide

This guide will help you connect your Chrono Learn Dash app to a free Vercel Postgres database.

## Step 1: Create Vercel Postgres Database

1. **Deploy to Vercel first** (if not already done):
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Add Postgres Database**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to the "Storage" tab
   - Click "Create Database" → "Postgres"
   - Choose the free tier
   - Name your database (e.g., "chrono-learn-db")

## Step 2: Get Database Connection Details

1. In your Vercel dashboard, go to your project's "Storage" tab
2. Click on your Postgres database
3. Go to the "Settings" tab
4. Copy the connection details:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

## Step 3: Set Environment Variables

1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add the following variables:
   ```
   POSTGRES_URL=your_postgres_url_here
   POSTGRES_PRISMA_URL=your_postgres_prisma_url_here
   POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling_here
   POSTGRES_USER=your_postgres_user_here
   POSTGRES_HOST=your_postgres_host_here
   POSTGRES_PASSWORD=your_postgres_password_here
   POSTGRES_DATABASE=your_postgres_database_here
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

## Step 4: Initialize Database

1. **Deploy your app** with the environment variables
2. **Initialize the database** by visiting:
   ```
   https://your-app.vercel.app/api/init-db
   ```
   This will create all necessary tables and insert default data.

## Step 5: Test the Connection

Visit these endpoints to test your database connection:

- **Test connection**: `GET /api/init-db`
- **Get videos**: `GET /api/videos`
- **Get categories**: `GET /api/videos/categories`
- **Super admin login**: `POST /api/auth/super-admin/login`

## Database Schema

The following tables will be created:

### `super_admins`
- `id` (VARCHAR(36), Primary Key)
- `email` (VARCHAR(255), Unique)
- `password_hash` (VARCHAR(255))
- `created_at` (TIMESTAMP)
- `last_login` (TIMESTAMP)

### `users`
- `id` (VARCHAR(36), Primary Key)
- `email` (VARCHAR(255), Unique)
- `name` (VARCHAR(255))
- `token` (VARCHAR(36), Unique)
- `status` (VARCHAR(20): 'active', 'paused', 'deleted')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `last_login` (TIMESTAMP)
- `expires_at` (TIMESTAMP)

### `tokens`
- `id` (VARCHAR(36), Primary Key)
- `token` (VARCHAR(36), Unique)
- `user_id` (VARCHAR(36), Foreign Key)
- `created_by` (VARCHAR(36), Foreign Key)
- `status` (VARCHAR(20): 'active', 'used', 'expired')
- `created_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)

### `videos`
- `id` (VARCHAR(36), Primary Key)
- `title` (VARCHAR(255))
- `description` (TEXT)
- `url` (VARCHAR(500))
- `category` (VARCHAR(100))
- `duration` (INTEGER)
- `thumbnail_url` (VARCHAR(500))
- `status` (VARCHAR(20): 'active', 'inactive', 'deleted')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `video_categories`
- `id` (VARCHAR(36), Primary Key)
- `name` (VARCHAR(100), Unique)
- `description` (TEXT)
- `created_at` (TIMESTAMP)

## Default Data

The initialization script will create:
- A super admin user: `damanifesta0@gmail.com` / `KINg178.`
- Default video categories: Trading Basics, Technical Analysis, Risk Management, Psychology

## Troubleshooting

### Common Issues:

1. **Database connection failed**:
   - Check that all environment variables are set correctly
   - Ensure the database is created and active in Vercel

2. **Tables not created**:
   - Visit `/api/init-db` to initialize the database
   - Check the Vercel function logs for errors

3. **Authentication issues**:
   - Verify the super admin credentials
   - Check that JWT_SECRET is set

### Checking Logs:
- Go to Vercel dashboard → Your project → Functions tab
- Check the logs for any errors

## Free Tier Limits

Vercel Postgres free tier includes:
- 1 database
- 1GB storage
- 1 billion row reads per month
- 1 million row writes per month

This should be sufficient for testing and small-scale usage.

## Next Steps

Once your database is set up:
1. Test all API endpoints
2. Create some test videos
3. Test user registration and authentication
4. Test the admin dashboard functionality

Your app is now connected to a real database and ready for testing!
