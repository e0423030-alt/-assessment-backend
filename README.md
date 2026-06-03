# Bug Tracking System - Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend root directory with:
```
PORT=5000
MONGODB_URI=mongodb+srv://priyahariram8825_db_user:priya8825@clusterfinal.fyfuo2t.mongodb.net/?appName=Clusterfinal
JWT_SECRET=your_jwt_secret_key_change_this_in_production
EXTERNAL_API_URL=https://t4e-testserver.onrender.com/api
STUDENT_ID=E0423030
STUDENT_PASSWORD=812070
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```
The server will run on `http://localhost:5000`

## Features

### Authentication & Authorization
- User registration with roles (admin, manager, developer, tester)
- JWT-based authentication
- Role-based access control

### CRUD Operations
- **Users**: GET all, GET by ID
- **Projects**: POST, GET all, GET by ID, PATCH, DELETE
- **Issues**: POST, GET all, GET by ID, PATCH, DELETE, Assign, Update Status
- **Comments**: POST, GET all, GET by ID, DELETE

### Filtering & Search
- Issues: filter by status, priority, severity, search by title
- Projects: filter by status, owner, search by title
- Comments: filter by issueId, search by message
- Pagination support: page, limit

### Analytics
- Issue analytics (total, open, in-progress, testing, resolved, closed)
- Project analytics (active, completed, archived)
- Developer analytics (assigned issues, resolved issues)

### Dataset Synchronization
- Fetch from external API
- Validate and sanitize data
- Prevent duplicate insertion
- Store in MongoDB

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get user by ID

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:projectId` - Get project by ID
- `PATCH /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project

### Issues
- `POST /api/issues` - Create issue
- `GET /api/issues` - Get all issues
- `GET /api/issues/:issueId` - Get issue by ID
- `PATCH /api/issues/:issueId` - Update issue
- `DELETE /api/issues/:issueId` - Delete issue
- `PATCH /api/issues/:issueId/assign` - Assign issue
- `PATCH /api/issues/:issueId/status` - Update issue status

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments` - Get all comments
- `GET /api/comments/:commentId` - Get comment by ID
- `DELETE /api/comments/:commentId` - Delete comment

### Analytics
- `GET /api/analytics/issues` - Get issue analytics
- `GET /api/analytics/projects` - Get project analytics
- `GET /api/analytics/developers` - Get developer analytics

### Health
- `GET /health` - Health check

### Sync
- `POST /api/sync` - Sync dataset from external API
# -assessment-backend
