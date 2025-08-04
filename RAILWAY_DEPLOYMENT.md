# Railway.com Deployment Guide

## Prerequisites

1. Create a Railway.com account
2. Install Railway CLI (optional): `npm install -g @railway/cli`
3. Connect your GitHub repository to Railway

## Deployment Steps

### 1. Backend Deployment

1. **Create a new Railway project**
   - Go to [Railway.com](https://railway.com)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Environment Variables**
   - Go to your project settings
   - Add the following environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=<your-db-host>
   DB_PORT=5432
   DB_NAME=inventory_management
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   JWT_SECRET=<your-super-secret-jwt-key>
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=<your-frontend-url>
   LOG_LEVEL=info
   BCRYPT_ROUNDS=12
   ```

3. **Deploy the Backend**
   - Railway will automatically detect the Dockerfile in the backend directory
   - The build will use the production Dockerfile
   - The application will start with `npm start`

### 2. Database Setup

1. **Add PostgreSQL Service**
   - In your Railway project, click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically provide the connection details

2. **Update Environment Variables**
   - Copy the database connection details from the PostgreSQL service
   - Update your backend service environment variables with these values

3. **Run Database Migrations**
   - The backend will automatically run migrations on startup
   - Check the logs to ensure migrations completed successfully

### 3. Frontend Deployment

1. **Create Frontend Service**
   - In your Railway project, click "New Service"
   - Select "GitHub Repo" and choose your repository
   - Set the root directory to `/frontend`

2. **Configure Frontend Environment**
   - Add environment variables:
   ```
   VITE_API_URL=<your-backend-url>
   NODE_ENV=production
   ```

3. **Deploy Frontend**
   - Railway will use the frontend Dockerfile
   - The build will create a production build with Nginx

### 4. Domain Configuration

1. **Custom Domain (Optional)**
   - Go to your service settings
   - Click "Domains"
   - Add your custom domain

2. **Update CORS Settings**
   - Update the `CORS_ORIGIN` environment variable with your frontend URL

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure Dockerfile paths are correct
   - Verify environment variables are set

2. **Database Connection Issues**
   - Verify database environment variables
   - Check that PostgreSQL service is running
   - Ensure database migrations are running

3. **CORS Errors**
   - Update `CORS_ORIGIN` with the correct frontend URL
   - Check that the backend is accessible

4. **Health Check Failures**
   - Verify the health check endpoint is working
   - Check application logs for errors

### Logs and Monitoring

- Use Railway's built-in logging to debug issues
- Monitor application performance in the Railway dashboard
- Set up alerts for service failures

## Environment Variables Reference

### Backend Variables
- `NODE_ENV`: Set to `production`
- `PORT`: Application port (usually 5000)
- `DB_HOST`: Database host from Railway PostgreSQL service
- `DB_PORT`: Database port (usually 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: JWT token expiration time
- `CORS_ORIGIN`: Frontend URL for CORS
- `LOG_LEVEL`: Logging level (info, debug, etc.)
- `BCRYPT_ROUNDS`: Password hashing rounds

### Frontend Variables
- `VITE_API_URL`: Backend API URL
- `NODE_ENV`: Set to `production`

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to version control
   - Use Railway's environment variable management
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access

3. **Application Security**
   - Use HTTPS in production
   - Implement proper CORS policies
   - Validate all inputs

## Support

- Railway Documentation: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- GitHub Issues: For application-specific issues 