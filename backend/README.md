# EVOLUX TECH SOLUTIONS - Backend

A production-ready Node.js backend with Express, PostgreSQL, and JWT authentication.

## 🏗️ Architecture

```
📁 backend/
├── 📁 config/           # Database configuration
├── 📁 migrations/       # Database schema migrations
├── 📁 src/
│   ├── 📁 controllers/  # Route handlers (business logic)
│   ├── 📁 middlewares/  # Custom middleware (auth, validation, etc.)
│   ├── 📁 models/       # Sequelize models (database schemas)
│   ├── 📁 routes/       # API route definitions
│   ├── 📁 services/     # Business logic layer
│   ├── 📁 utils/        # Utility functions (auth, helpers)
│   └── server.js        # Main server file
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

## 🚀 Quick Start

### 1. Environment Setup
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb evolux_db

# Run migrations
npm run migrate
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login

### Contacts (Public)
- `POST /api/v1/contact` - Submit contact form

### Contacts (Admin - Protected)
- `GET /api/v1/contact` - Get all contacts
- `GET /api/v1/contact/:id` - Get contact by ID
- `PUT /api/v1/contact/:id/status` - Update contact status

### Categories & Products (Admin)
- CRUD operations for categories and products

## 🗄️ Database Schema

### Users Table
- id, first_name, last_name, email, mobile, password, role, timestamps

### Contacts Table
- id, name, email, phone, service_needed, budget_range, project_description, status, timestamps

### Categories & Products Tables
- Standard e-commerce schema with relationships

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for secure passwords
- **CORS Protection** - Configured for frontend domains
- **Input Validation** - Data validation and sanitization
- **SSL/TLS** - HTTPS in production

## 🚀 Production Deployment

### Environment Variables
```env
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### Hosting Options
- **Railway** - Easy PostgreSQL + Node.js hosting
- **Heroku** - Traditional PaaS
- **Vercel** - Serverless functions
- **AWS/DigitalOcean** - Full control

## 🛠️ Available Scripts

- `npm run dev` - Development with nodemon
- `npm start` - Production server
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Rollback last migration

## 📊 Monitoring & Logs

- Morgan middleware for HTTP request logging
- Error handling middleware
- Database connection monitoring
- Request/response logging

## 🔧 Development Guidelines

1. **MVC Pattern** - Controllers handle requests, services contain business logic
2. **Error Handling** - Consistent error responses across all endpoints
3. **Validation** - Input validation at controller and model levels
4. **Security** - Never commit secrets, use environment variables
5. **Migrations** - Always use migrations for schema changes

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Write meaningful commit messages
4. Test API endpoints thoroughly
5. Update this README for new features