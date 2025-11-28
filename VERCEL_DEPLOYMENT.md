# Vercel Deployment Guide

This project is now configured for Vercel deployment with:
- React frontend served as static files
- Express API routes as serverless functions

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Use Neon, AWS RDS, or any PostgreSQL provider
3. **Git Repository**: Push your code to GitHub/GitLab/Bitbucket

## Deployment Steps

### 1. Set Up Database

First, ensure you have a PostgreSQL database. Recommended free options:
- [Neon](https://neon.tech) - Free tier available
- [Supabase](https://supabase.com) - Free tier with PostgreSQL
- [Render](https://render.com) - Free PostgreSQL database

Get your `DATABASE_URL` connection string from your database provider.

### 2. Push Code to Git

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 3. Deploy on Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure environment variables:
   - Add `DATABASE_URL` from your PostgreSQL provider
   - Add `NODE_ENV=production`
4. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy (will prompt for settings)
vercel

# Deploy to production
vercel --prod
```

### 4. Set Environment Variables in Vercel

If not done in the dashboard:

1. Go to your project settings on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add:
   - **DATABASE_URL**: Your PostgreSQL connection string
   - **NODE_ENV**: `production`

### 5. Run Database Migrations

After deployment, you may need to run migrations:

```bash
npm run db:push
```

## File Structure for Vercel

```
.
├── api/                    # Vercel serverless functions
│   └── index.ts           # Main API handler
├── client/                # React frontend
│   └── src/
├── server/                # Express routes (imported by API handler)
├── shared/                # Shared types and schemas
├── vercel.json            # Vercel configuration
├── vite.config.ts         # Vite build config
└── package.json
```

## Important Notes

- **API Routes**: All API endpoints should be prefixed with `/api`
- **Static Files**: Frontend is built to `dist/public/` and served automatically
- **Environment Variables**: Must be set in Vercel dashboard
- **Cold Starts**: Serverless functions have cold start times (usually <1s)

## Troubleshooting

### Build Fails
- Check that `npm run build` works locally
- Ensure all dependencies are listed in `package.json`
- Review Vercel deployment logs

### API Not Working
- Verify `DATABASE_URL` is set correctly
- Check database credentials
- Review function logs in Vercel dashboard

### Static Files Not Loading
- Ensure Vite builds to `dist/public/`
- Check `vite.config.ts` output directory

## Local Development

```bash
# Frontend only
npm run dev:client

# Full stack (Express + React)
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Runtime](https://vercel.com/docs/functions/serverless-functions/nodejs)
- [Environment Variables on Vercel](https://vercel.com/docs/projects/environment-variables)
