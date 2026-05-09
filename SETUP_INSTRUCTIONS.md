# BTMS (Bahria University Transport Management System) - Complete Setup

## 📁 Project Structure

```
/Users/sahilijaz/Desktop/NextWeb/WEEKLY/
├── project for nextweb.solutions/           # Frontend (existing)
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   ├── bahria uni logo.jpg
│   └── [api-integration.js]                 # Copy here from backend
│
└── backend/                                  # Backend (NEW)
    ├── server.js                            # Main server entry
    ├── package.json                         # Dependencies
    ├── .env                                 # Configuration (already set)
    ├── .gitignore
    ├── README.md                            # Backend docs
    ├── api-integration.js                   # Frontend API client
    ├── frontend-integration-guide.md        # Integration steps
    │
    ├── models/                              # Database schemas
    │   ├── User.js
    │   ├── Route.js
    │   ├── Transport.js
    │   └── Booking.js
    │
    ├── routes/                              # API endpoints
    │   ├── auth.js                         # Login/Register
    │   ├── users.js                        # User management
    │   └── transport.js                    # Routes/Vehicles/Bookings
    │
    └── middleware/                          # Custom middleware
        ├── auth.js                         # JWT authentication
        └── errorHandler.js                 # Error handling
```

## 🚀 Getting Started

### Step 1: Install Backend Dependencies

```bash
cd /Users/sahilijaz/Desktop/NextWeb/WEEKLY/backend
npm install
```

This will install:
- express (Web framework)
- mongoose (MongoDB driver)
- jsonwebtoken (JWT auth)
- bcryptjs (Password hashing)
- cors (Cross-origin support)
- dotenv (Environment variables)

### Step 2: Start the Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### Step 3: Integrate with Frontend

1. **Copy the API integration file:**
```bash
cp backend/api-integration.js "project for nextweb.solutions/"
```

2. **Add to frontend HTML** (before script.js):
```html
<script src="api-integration.js"></script>
<script src="script.js"></script>
```

3. **Update authentication functions in script.js** (see `frontend-integration-guide.md` for full code)

## 📊 Database Connection

**MongoDB Atlas Connection String** (already configured in `.env`):
```
mongodb+srv://hssahil2913_db_user:cVm7jcS9WjomVWsm@cluster0.wuwkgr9.mongodb.net/?appName=Cluster0
```

The backend automatically connects to MongoDB on startup.

## 🔑 Authentication Flow

### User Registration
1. Frontend sends credentials to `/api/auth/register`
2. Backend hashes password with bcryptjs
3. User document created in MongoDB
4. JWT token generated and returned
5. Token stored in frontend localStorage

### User Login
1. Frontend sends email/password to `/api/auth/login`
2. Backend validates password
3. Login recorded in loginHistory
4. JWT token generated (expires in 7 days)
5. Token used for all subsequent requests

## 🛡️ Security Features

✅ Password hashing (bcryptjs)
✅ JWT token authentication
✅ Role-based access control
✅ CORS protection
✅ Input validation
✅ MongoDB injection protection

## 📱 Available Roles

- **student** - Can book transportation, view routes
- **admin** - Full system access, manage vehicles/routes
- **driver** - Manage vehicle assignments
- **conductor** - Manage passenger information

## 🔌 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get profile
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - List all users (admin)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `DELETE /api/users/:id` - Deactivate user (admin)

### Routes
- `GET /api/transport/routes` - List all routes
- `GET /api/transport/routes/:id` - Get route details
- `POST /api/transport/routes` - Create route (admin)
- `PUT /api/transport/routes/:id` - Update route (admin)

### Vehicles
- `GET /api/transport/vehicles` - List vehicles
- `GET /api/transport/vehicles/:id` - Get vehicle details
- `POST /api/transport/vehicles` - Create vehicle (admin)
- `PUT /api/transport/vehicles/:id` - Update vehicle (admin)

### Bookings
- `GET /api/transport/bookings` - Get user bookings
- `POST /api/transport/bookings` - Create booking
- `PUT /api/transport/bookings/:id` - Update booking
- `DELETE /api/transport/bookings/:id` - Cancel booking
- `GET /api/transport/bookings/admin/all` - All bookings (admin)

## 📝 Environment Variables

File: `backend/.env`

```env
PORT=5000                                              # Server port
NODE_ENV=development                                   # Environment mode
MONGODB_URI=mongodb+srv://...@cluster0...            # MongoDB connection
JWT_SECRET=your_super_secret_jwt_key_...             # JWT signing key
JWT_EXPIRE=7d                                        # Token expiration
FRONTEND_URL=http://localhost:3000                   # CORS allowed origin
```

## 🧪 Testing the API

### Using cURL

**Register:**
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

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@bahria.edu.pk",
    "password": "Test@1234"
  }'
```

### Using Frontend JavaScript

```javascript
// Register
const result = await btmsApi.register({
  firstName: 'Ahmed',
  lastName: 'Khan',
  email: 'ahmed@bahria.edu.pk',
  password: 'Test@1234',
  phone: '+923001234567',
  role: 'student',
  studentId: '21-654321-123'
});

// Login
const login = await btmsApi.login('ahmed@bahria.edu.pk', 'Test@1234');

// Get routes
const routes = await btmsApi.getRoutes();

// Create booking
const booking = await btmsApi.createBooking({
  route: routeId,
  travelDate: '2024-05-15',
  pickupPoint: 'Clifton Campus',
  dropoffPoint: 'Defense Campus'
});
```

## ✅ Verification Checklist

- [ ] Backend folder created at `WEEKLY/backend`
- [ ] `npm install` completed without errors
- [ ] MongoDB connection successful (check console)
- [ ] Server running on port 5000
- [ ] `api-integration.js` copied to frontend folder
- [ ] Frontend HTML includes `<script src="api-integration.js"></script>`
- [ ] Backend tests pass (can register/login)
- [ ] Frontend auth functions updated with backend calls

## 🔧 Troubleshooting

### MongoDB Connection Failed
```
❌ MongoDB connection error: ...
```
**Solution:** Check your internet connection and MongoDB Atlas IP whitelist

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** 
```bash
lsof -ti:5000 | xargs kill -9
```

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Update `FRONTEND_URL` in `.env` to match your frontend URL

### JWT Token Invalid
```
error: "Not authorized to access this route"
```
**Solution:** Token may have expired. User needs to login again.

## 📚 Additional Resources

- **Backend Docs:** `backend/README.md`
- **Integration Guide:** `backend/frontend-integration-guide.md`
- **MongoDB Docs:** https://docs.mongodb.com/
- **Express Docs:** https://expressjs.com/
- **JWT Docs:** https://jwt.io/

## 🎯 Next Steps

1. ✅ Backend created and configured
2. ✅ MongoDB connected
3. ✅ API integration file ready
4. **TODO:** Update frontend authentication functions
5. **TODO:** Implement dashboard with API calls
6. **TODO:** Add booking system UI
7. **TODO:** Deploy to production

## 📞 Support

For issues:
1. Check the error message in console
2. Review the troubleshooting section
3. Check backend logs: `npm run dev`
4. Check MongoDB Atlas dashboard for connection issues
5. Verify environment variables in `.env`

---

**Backend Status:** ✅ Ready to use
**Frontend Integration:** ⏳ Requires authentication function updates
**Database:** ✅ Connected to MongoDB Atlas

Start the backend with `npm run dev` and you're good to go!
