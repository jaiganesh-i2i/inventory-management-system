# Inventory Management System

A modern, full-stack inventory management system built with React, TypeScript, Node.js, and PostgreSQL.

## 🚀 Features

- **Product Management**: Add, edit, and manage products with categories and specifications
- **Inventory Tracking**: Real-time stock levels across multiple warehouses
- **Purchase Orders**: Create and manage supplier orders
- **Stock Alerts**: Low inventory warnings and reorder notifications
- **Reporting Dashboard**: Inventory turnover, stock valuation, and trends
- **User Management**: Role-based access control (Admin, Manager, User)
- **Responsive Design**: Modern UI with Material-UI components

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material-UI (MUI) v5** for UI components
- **React Router v6** for navigation
- **Axios** for API communication

### Backend
- **Node.js 18** with TypeScript
- **Express.js** for API framework
- **PostgreSQL** for database
- **JWT** for authentication
- **Joi** for validation
- **Helmet** for security

### Development Tools
- **ESLint** and **Prettier** for code quality
- **Docker** for containerization
- **Nodemon** for hot reloading
- **TypeScript** for type safety

## 📋 Prerequisites

- Node.js 18+ 
- npm 8+
- PostgreSQL 15+
- Docker (optional)

## 🚀 Quick Start

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-management-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your database credentials
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

### Option 2: Docker Development

1. **Start with Docker Compose**
   ```bash
   npm run docker:dev
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - pgAdmin: http://localhost:5050

## 📁 Project Structure

```
inventory-management-system/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── backend/                  # Node.js TypeScript backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── Dockerfile
├── database/                 # Database migrations and views
│   ├── migrations/
│   └── views/
├── docker/                   # Docker configuration
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
├── docs/                     # Documentation
│   ├── architecture/
│   ├── api/
│   └── database/
└── package.json              # Root package.json
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run lint` - Run ESLint on both frontend and backend
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Frontend
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run lint:frontend` - Run ESLint on frontend
- `npm run format:frontend` - Format frontend code

### Backend
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production
- `npm run lint:backend` - Run ESLint on backend
- `npm run format:backend` - Format backend code

### Docker
- `npm run docker:dev` - Start development environment with Docker
- `npm run docker:prod` - Start production environment with Docker
- `npm run docker:down` - Stop Docker containers

## 🗄️ Database Setup

1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE inventory_management;
   ```

2. **Run migrations**
   ```bash
   # The migrations will run automatically when using Docker
   # For local development, you can run them manually
   ```

3. **Initial data**
   - The system includes seed data for testing
   - Default admin user: `admin@inventory.com` / `admin123`

## 🔐 Environment Variables

### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/inventory_management
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_management
DB_USER=username
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Security
BCRYPT_ROUNDS=12
```

## 🐳 Docker Deployment

### Development
```bash
npm run docker:dev
```

### Production
```bash
npm run docker:prod
```

### Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050

## 📚 API Documentation

The API documentation is available in the `docs/api/` directory:
- [API Specification](./docs/api/api-specification.md)
- [Data Flow Diagrams](./docs/api/data-flow-diagram.md)

## 🏗️ Architecture

Detailed architecture documentation is available in the `docs/architecture/` directory:
- [System Architecture](./docs/architecture/system-architecture.md)
- [Technology Stack](./docs/architecture/technology-stack.md)
- [System Components](./docs/architecture/system-components.md)
- [Deployment & Hosting](./docs/architecture/deployment-hosting.md)

## 🗃️ Database Schema

Database documentation is available in the `docs/database/` directory:
- [Database Schema](./docs/database/database-schema.md)

## 🧪 Testing

```bash
# Frontend tests
cd frontend && npm run test

# Backend tests
cd backend && npm run test
```

## 📦 Deployment

### Render (Recommended)
- ✅ **Automatic PostgreSQL database creation**
- ✅ **Docker support**
- ✅ **Free tier available**
- ✅ **Automatic deployments**
- ✅ **Built-in SSL certificates**

**Quick Deploy:**
1. Push `render.yaml` to GitHub
2. Create Render account
3. Deploy using Blueprint
4. Configure environment variables

**See:** [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md)

### Other Platforms
- **Heroku** - Mature platform, PostgreSQL add-on
- **DigitalOcean** - Simple deployment, managed databases
- **Vercel + Supabase** - Modern full-stack, real-time database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
1. Check the documentation in the `docs/` directory
2. Review the API specification
3. Check the task tracker for current development status

## 📊 Project Status

✅ **Complete** - All features implemented and tested
- ✅ Backend API with authentication
- ✅ Frontend React application
- ✅ PostgreSQL database with migrations
- ✅ Docker configuration
- ✅ Render deployment ready

**Documentation:**
- [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [docs/](docs/) - Architecture and API documentation 