# Medical Treatment Tracking System

A comprehensive system where doctors assign medical tasks (daily pills, exercises, checkups, etc.) to users, and users must check them off daily. Doctors track compliance. Admin manages doctors.

## 📋 Overview

This application provides a complete platform for:
- **Doctors**: Assign medical tasks to patients and monitor their compliance
- **Users/Patients**: Track and complete daily medical tasks
- **Admins**: Manage doctors and oversee the system

## 🏗️ Project Structure

```
Medical-Treatment-Tracking-System/
├── back-end/          # Backend API (Node.js, Django, or similar)
├── front-end/         # Frontend Application (React, Vue, or similar)
├── README.md          # This file
├── .gitignore         # Git ignore rules
└── [config files]     # Configuration files
```

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have installed:
- **Node.js** (v14.0.0 or higher) - for front-end
- **npm** or **yarn** - package manager for front-end
- **Python** (v3.8 or higher) - if using Python for back-end
- **Docker** & **Docker Compose** (optional, for containerized setup)
- **Git** - version control

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/cer4k4/Medical-Treatment-Tracking-System.git
cd Medical-Treatment-Tracking-System
```

#### 2. Setup Backend

Navigate to the back-end directory and install dependencies:

```bash
cd back-end

# If using Node.js/npm
npm install

# If using Python
pip install -r requirements.txt
```

**Environment Configuration:**
- Copy `.env.example` to `.env` (if available)
- Update database credentials and API keys in `.env`

**Run Backend:**

```bash
# For Node.js
npm start
# or
npm run dev    # for development with auto-reload

# For Python/Django
python manage.py migrate
python manage.py runserver

# For Python/Flask
python app.py
```

The backend server should run on `http://localhost:8000` or `http://localhost:5000` (check your configuration)

#### 3. Setup Frontend

In a new terminal, navigate to the front-end directory:

```bash
cd front-end

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will typically open at `http://localhost:3000`

### 4. Database Setup (if applicable)

```bash
# Navigate to back-end directory
cd back-end

# For Django
python manage.py migrate

# For other frameworks, follow the respective migration commands
```

## 📦 Docker Setup (Optional)

If the project includes Docker configuration:

```bash
# Build and run using Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

## 🔧 Configuration

Create a `.env` file in the back-end directory with the following variables (example):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medical_tracking
DB_USER=admin
DB_PASSWORD=your_password

# API
API_PORT=8000
NODE_ENV=development

# Authentication
JWT_SECRET=your_secret_key

# Frontend API
REACT_APP_API_URL=http://localhost:8000
```

## 📝 Available Scripts

### Frontend

```bash
npm start       # Start development server
npm run build   # Build for production
npm test        # Run tests
npm run lint    # Run linter
```

### Backend

```bash
npm start       # Start server
npm run dev     # Start with auto-reload
npm test        # Run tests
npm run lint    # Run linter
```

## 🛠️ Development

### Running in Development Mode

Both services should be running simultaneously:

**Terminal 1 - Backend:**
```bash
cd back-end
npm run dev    # or python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd front-end
npm start
```

## 🧪 Testing

```bash
# Backend tests
cd back-end
npm test

# Frontend tests
cd front-end
npm test
```

## 📚 API Documentation

API endpoints documentation should be available at:
- Swagger/OpenAPI: `http://localhost:8000/api/docs`
- Postman Collection: Check `/back-end` directory for postman_collection.json

## 🔐 Authentication

The system uses token-based authentication:
- **Login**: POST `/api/auth/login`
- **Register**: POST `/api/auth/register`
- **Logout**: POST `/api/auth/logout`

Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## 📦 Build for Production

### Frontend
```bash
cd front-end
npm run build
# Static files generated in `build/` directory
```

### Backend
```bash
cd back-end
# Follow your framework's production build process
```

## 🚢 Deployment

For deployment instructions, see the respective back-end and front-end directories.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change port in .env or use `lsof -i :PORT` to kill process |
| Database connection error | Check DB credentials in .env file |
| CORS errors | Ensure backend CORS is configured for frontend URL |
| Dependencies not installing | Delete `node_modules` and `package-lock.json`, then run `npm install` again |

## 📞 Support

For issues and questions:
1. Check existing GitHub Issues
2. Create a new GitHub Issue with detailed description
3. Include error logs and steps to reproduce

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [cer4k4](https://github.com/cer4k4)

## 📌 Version

Current Version: 1.0.0 (Last Updated: January 2026)

---

**Happy coding! 🎉**
