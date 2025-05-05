# Event Management System

A full-stack event management application built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (login/register)
- Create and manage events
- Filter events by date and host
- Join events
- View upcoming and past events
- Responsive design with Material-UI

## Tech Stack

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- React Hook Form
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd event_management_project
```

### 2. Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the backend server:
```bash
npm run dev
```

The server will start on http://localhost:5000

### 3. Frontend Setup

1. Open a new terminal and navigate to the project root:
```bash
cd src
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the src directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The application will start on http://localhost:5173

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- POST `/api/users/logout` - Logout user

### Events
- GET `/api/events` - Get all events
- POST `/api/events` - Create a new event
- GET `/api/events/:id` - Get event by ID
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event
- POST `/api/events/:id/join` - Join an event

## Project Structure

```
event_management_project/
├── src/                    # Frontend source code
│   ├── Components/        # Reusable components
│   ├── Context/          # React context providers
│   ├── Pages/            # Page components
│   └── ...
├── server/                # Backend source code
│   ├── Controllers/      # Route controllers
│   ├── Models/          # Database models
│   ├── Routes/          # API routes
│   └── ...
└── ...
```

## Development

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd src
npm test
```

### Building for Production
```bash
# Build frontend
cd src
npm run build

# Build backend
cd server
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
