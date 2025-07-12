# Bug Tracker 

A modern bug tracking application built with React, Express, MongoDB, and comprehensive testing.

## ✨ Features

- **Bug Management**: Create, update, delete, and track bug status
- **Modern UI**: Responsive design with dark mode toggle
- **Real-time Updates**: Instant feedback with toast notifications
- **Comprehensive Testing**: Unit, integration, and E2E tests
- **Accessibility**: ARIA labels and keyboard navigation

## 🛠️ Tech Stack

**Frontend**: React 18, Vite, Tailwind CSS, React Hot Toast  
**Backend**: Node.js, Express.js, MongoDB, Mongoose  
**Testing**: Vitest, React Testing Library, Cypress, Supertest

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- PNPM (recommended)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd week-6-test-debug-assignment-Patricianduku
   
   # Install client dependencies
   cd client && pnpm install
   
   # Install server dependencies  
   cd ../server && pnpm install
   ```

2. **Set up environment**
   ```bash
   # In server directory
   echo "MONGODB_URI=mongodb://localhost:27017/bug-tracker" > .env
   echo "PORT=5000" >> .env
   ```

3. **Start the application**
   ```bash
   # Start backend (from server directory)
   pnpm dev
   
   # Start frontend (from client directory)
   cd ../client && pnpm dev
   ```

4. **Access the app**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 🧪 Testing

```bash
# Unit tests (client)
cd client && pnpm test:run

# Integration tests (server)  
cd server && pnpm test

# E2E tests (client)
cd client && pnpm cypress:run
```

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/components/     # React components
│   ├── src/tests/          # Unit tests
│   └── cypress/e2e/        # E2E tests
├── server/                 # Express backend
│   ├── controllers/        # API controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── tests/              # Integration tests
└── screenshots/            # Application screenshots
```

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bugs` | Get all bugs |
| POST | `/api/bugs` | Create new bug |
| PUT | `/api/bugs/:id` | Update bug status |
| DELETE | `/api/bugs/:id` | Delete bug |

## 🎯 Key Features

### Bug Management
- Submit bugs with title and description
- Track status: Open → In Progress → Resolved
- Filter bugs by status
- Delete bugs with confirmation

### User Experience
- Dark/light mode toggle
- Responsive design for all devices
- Form validation with error messages
- Toast notifications for actions

### Testing Coverage
- **Unit Tests**: Component functionality
- **Integration Tests**: API endpoints
- **E2E Tests**: Complete user workflows

## 🚀 Deployment

```bash
# Build frontend
cd client && pnpm build

# Start production server
cd server && pnpm start
```



---

