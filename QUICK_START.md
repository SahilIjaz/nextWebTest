# BTMS - Quick Start Guide

## ✅ What's Done

- Backend fully created with Express.js + MongoDB
- All 20+ API endpoints implemented
- Frontend HTML updated with API integration script
- Frontend authentication functions updated to use real API calls
- JWT authentication, password hashing, role-based access control

## 🚀 Getting Started (5 Steps)

### Step 1: Start the Backend Server

```bash
cd /Users/sahilijaz/Desktop/NextWeb/WEEKLY/backend
npm install  # (if not already done)
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### Step 2: Test Backend (Optional)

Register a test user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@bahria.edu.pk",
    "password": "Test@1234",
    "phone": "+923001234567",
    "role": "student",
    "studentId": "21-654321-001"
  }'
```

### Step 3: Run Frontend (New Terminal)

```bash
# Open the frontend in your browser
open "/Users/sahilijaz/Desktop/NextWeb/WEEKLY/project for nextweb.solutions/index.html"
# Or use a local server:
cd "/Users/sahilijaz/Desktop/NextWeb/WEEKLY/project for nextweb.solutions"
python3 -m http.server 3000
# Then visit http://localhost:3000
```

### Step 4: Test Login/Signup

Frontend now connects to real backend! Try:
- **Login** with: `test@bahria.edu.pk` / `Test@1234`
- **Signup** with new credentials (password must have uppercase, lowercase, number, special char)

### Step 5: Verify Integration

After login, you should:
- See your name in the top-right corner
- Access student dashboard
- View available routes
- Create bookings (when implemented)

## 📁 Important Files

**Backend:**
- `/backend/server.js` - Main server
- `/backend/.env` - MongoDB connection (already configured)
- `/backend/routes/` - API endpoints
- `/backend/models/` - Database schemas
- `/backend/README.md` - Full backend documentation

**Frontend:**
- `index.html` - Now includes api-integration.js
- `script.js` - Updated with real API calls
- `api-integration.js` - API client library (handles token management)

## 🔑 Test Credentials

**Admin Account:**
- Email: `admin@bahria.edu.pk`
- Password: `Admin@1234`

**Student Account:**
- Email: `ahmed.khan@bahria.edu.pk`
- Password: `Student@1234`
- Student ID: `21-654321-001`

(Or create new accounts via signup form)

## ✨ Key Features

✅ **Authentication** - Register, login, logout with JWT  
✅ **Role-Based Access** - Student, Admin, Driver, Conductor roles  
✅ **Password Security** - Bcrypt hashing, strong password requirements  
✅ **Database** - MongoDB Atlas (already connected)  
✅ **API Client** - btmsApi library for all API calls  
✅ **Error Handling** - Real error messages from backend  
✅ **Token Management** - Automatic localStorage token handling  

## 🐛 Troubleshooting

**Backend won't start:**
```bash
# Port 5000 already in use?
lsof -ti:5000 | xargs kill -9
```

**Can't login:**
- Check backend is running (`npm run dev`)
- Check MongoDB connection in console
- Verify email/password are correct

**CORS errors:**
- Backend and frontend URLs must match (usually http://localhost:3000)
- Check `.env` file: `FRONTEND_URL=http://localhost:3000`

## 📚 Next Steps

1. ✅ Backend running
2. ✅ Frontend integrated with API
3. 📋 Add more features:
   - Routes listing
   - Vehicle management
   - Booking system
   - Payment processing
   - Admin dashboard

## 📖 Documentation

- `BACKEND_COMPLETE.md` - What was created
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `frontend-integration-guide.md` - Integration details
- `SAMPLE_DATA.md` - Test data & examples
- `backend/README.md` - API documentation

---

**Need help?** Check the documentation files or test with the sample credentials above!
