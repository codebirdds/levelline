# 🚀 Quick Setup Guide

## 1. Install PostgreSQL

### Windows (Easy Option)
```bash
# Download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

### Alternative: Docker (Recommended)
```bash
docker run --name evolux-postgres \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=evolux_db \
  -p 5432:5432 \
  -d postgres:15
```

## 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

## 3. Setup Database
```bash
# Install dependencies
npm install

# Create database (if not using Docker)
createdb evolux_db

# Run migrations
npm run migrate
```

## 4. Test the API
```bash
# Start server
npm run dev

# Test contact endpoint
curl -X POST http://localhost:5000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","project_description":"Test project"}'
```

## 5. Production Deployment

### Railway (Easiest)
1. Connect GitHub repo
2. Add PostgreSQL database
3. Set environment variables
4. Deploy!

### Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

## 📁 Project Structure Explained

```
backend/
├── src/
│   ├── controllers/  # Handle HTTP requests/responses
│   ├── services/     # Business logic (database operations)
│   ├── models/       # Database schemas (Sequelize)
│   ├── routes/       # API endpoints definition
│   ├── middlewares/  # Auth, validation, error handling
│   └── utils/        # Helper functions (auth, encryption)
├── migrations/       # Database schema changes
├── config/          # Database configuration
└── server.js        # Express app setup
```

### Data Flow:
1. **Request** → Route → Controller
2. **Controller** → Service → Model → Database
3. **Response** ← Controller ← Service ← Model

This is a **production-ready** backend with proper security, error handling, and scalability! 🎉