# BTMS Backend - Bahria University Transport Management System

A complete Express.js + MongoDB backend for the BTMS frontend application.

## Features

- 🔐 **User Authentication** - Register, Login with JWT tokens
- 👥 **Role-Based Access Control** - Admin, Student, Driver, Conductor roles
- 🚌 **Transport Management** - Vehicle, Route, and Booking management
- 💾 **MongoDB Integration** - Persistent data storage
- 🛡️ **Security** - Password hashing, JWT authentication, CORS
- 📝 **RESTful API** - Complete API documentation

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (free tier available)

## Installation

1. **Clone/Setup the backend folder:**
```bash
cd backend
npm install
```

2. **Environment Configuration:**
The `.env` file is already configured with:
- MongoDB URI (MongoDB Atlas connection)
- JWT Secret
- Port (5000)
- Frontend URL (for CORS)

## Running the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Deactivate user (admin)
- `GET /api/users/role/students` - Get all students (admin)
- `GET /api/users/role/drivers` - Get all drivers (admin)

### Routes
- `GET /api/transport/routes` - Get all routes
- `GET /api/transport/routes/:id` - Get route details
- `POST /api/transport/routes` - Create route (admin)
- `PUT /api/transport/routes/:id` - Update route (admin)

### Vehicles
- `GET /api/transport/vehicles` - Get all vehicles
- `GET /api/transport/vehicles/:id` - Get vehicle details
- `POST /api/transport/vehicles` - Create vehicle (admin)
- `PUT /api/transport/vehicles/:id` - Update vehicle (admin)

### Bookings
- `GET /api/transport/bookings` - Get user's bookings
- `POST /api/transport/bookings` - Create booking
- `PUT /api/transport/bookings/:id` - Update booking status
- `DELETE /api/transport/bookings/:id` - Cancel booking
- `GET /api/transport/bookings/admin/all` - Get all bookings (admin)

## Database Models

### User
- firstName, lastName, email, password
- phone, role (student/admin/driver/conductor)
- studentId, department
- loginHistory, isActive

### Route
- routeName, routeCode
- startPoint, endPoint
- stops (with coordinates)
- distance, estimatedDuration, fare
- schedule

### Transport
- vehicleNumber, vehicleType, capacity
- driver, conductor
- assignedRoute, status
- location (GPS), lastServiceDate

### Booking
- student, route, transport
- travelDate, departureTime, arrivalTime
- fare, seatNumber
- status (pending/confirmed/completed/cancelled)
- paymentStatus

## Frontend Integration

1. **Copy `api-integration.js` to frontend:**
```bash
cp backend/api-integration.js "project for nextweb.solutions/"
```

2. **Include in HTML:**
```html
<script src="api-integration.js"></script>
```

3. **Use in JavaScript:**
```javascript
// Register
await btmsApi.register({
  firstName, lastName, email, password, phone, role, studentId
});

// Login
await btmsApi.login(email, password);

// Get Routes
const routes = await btmsApi.getRoutes();

// Create Booking
await btmsApi.createBooking({
  route, travelDate, pickupPoint, dropoffPoint
});
```

## Authentication Flow

1. User registers/logs in via frontend
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage on frontend
4. Token included in all authenticated requests (Authorization header)
5. Backend verifies token for protected routes

## Environment Variables

```env
PORT=5000                           # Server port
NODE_ENV=development                # Environment
MONGODB_URI=mongodb+srv://...       # MongoDB connection
JWT_SECRET=your_secret_key          # JWT signing secret
JWT_EXPIRE=7d                       # Token expiration
FRONTEND_URL=http://localhost:3000  # CORS origin
```

## Project Structure

```
backend/
├── server.js                    # Main server file
├── package.json                 # Dependencies
├── .env                         # Environment variables
├── models/                      # Database schemas
│   ├── User.js
│   ├── Route.js
│   ├── Transport.js
│   └── Booking.js
├── routes/                      # API endpoints
│   ├── auth.js
│   ├── users.js
│   └── transport.js
├── middleware/                  # Custom middleware
│   ├── auth.js                 # JWT verification
│   └── errorHandler.js         # Error handling
└── api-integration.js           # Frontend API client
```

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ Input validation
- ✅ MongoDB injection protection

## Testing with Postman/cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ahmed",
    "lastName": "Khan",
    "email": "ahmed@bahria.edu.pk",
    "password": "Test@1234",
    "phone": "+923001234567",
    "role": "student",
    "studentId": "21-654321-123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@bahria.edu.pk",
    "password": "Test@1234"
  }'
```

## Troubleshooting

**MongoDB Connection Error:**
- Verify MongoDB Atlas URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure internet connection

**CORS Error:**
- Check FRONTEND_URL in `.env`
- Ensure frontend is running on specified port

**JWT Invalid Token:**
- Token may have expired (7 days)
- User needs to login again
- Check JWT_SECRET hasn't changed

## Support

For issues or questions, check the frontend integration docs or contact the development team.
