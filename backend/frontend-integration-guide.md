# Frontend-Backend Integration Guide

## Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Add API Integration to Frontend

Copy the `api-integration.js` file to your frontend folder:

```bash
cp backend/api-integration.js "project for nextweb.solutions/"
```

### 3. Include in HTML

Add this to your `index.html` before `script.js`:

```html
<script src="api-integration.js"></script>
```

### 4. Update Frontend Auth Functions

Replace the `simulateLoginRequest()` and `simulateSignupRequest()` functions in `script.js`:

```javascript
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    clearAuthErrors();

    if (!email) {
        showAuthError('login-email', 'Email is required');
        return;
    }

    if (!isValidEmail(email)) {
        showAuthError('login-email', 'Please enter a valid email');
        return;
    }

    if (!password) {
        showAuthError('login-password', 'Password is required');
        return;
    }

    if (password.length < 8) {
        showAuthError('login-password', 'Password must be at least 8 characters');
        return;
    }

    performLogin(email, password);
}

async function performLogin(email, password) {
    setButtonLoading('login-submit-btn', 'Signing in...');

    const result = await btmsApi.login(email, password);
    
    if (result.success && result.data.user) {
        const user = result.data.user;
        authManager.setUser(user);
        authManager.hideAuthOverlay();
        authManager.setupRoleBasedUI(user);
        authManager.updateUserDisplay(user);

        document.getElementById('login-form').reset();
        resetButtonLoading('login-submit-btn');

        showToast('✅ Welcome back, ' + user.firstName + '!');
    } else {
        resetButtonLoading('login-submit-btn');
        showToast('❌ Login failed: ' + (result.error || result.data?.error || 'Unknown error'));
        if (result.data?.error) {
            showAuthError('login-email', result.data.error);
        }
    }
}

function handleSignup(event) {
    event.preventDefault();

    const firstName = document.getElementById('signup-firstname').value.trim();
    const lastName = document.getElementById('signup-lastname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const studentId = document.getElementById('signup-studentid').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const accountType = document.querySelector('input[name="account-type"]:checked').value;
    const termsAccepted = document.getElementById('signup-terms').checked;

    clearAuthErrors();

    if (!firstName) {
        showAuthError('signup-firstname', 'First name is required');
        return;
    }

    if (!lastName) {
        showAuthError('signup-lastname', 'Last name is required');
        return;
    }

    if (!email) {
        showAuthError('signup-email', 'Email is required');
        return;
    }

    if (!isValidEmail(email)) {
        showAuthError('signup-email', 'Please enter a valid email');
        return;
    }

    if (accountType === 'student') {
        if (!studentId) {
            showAuthError('signup-studentid', 'Student ID is required');
            return;
        }

        if (!isValidStudentId(studentId)) {
            showAuthError('signup-studentid', 'Invalid student ID format (expected: XX-XXXXXX-XXX)');
            return;
        }
    }

    if (!phone) {
        showAuthError('signup-phone', 'Phone number is required');
        return;
    }

    if (!isValidPhone(phone)) {
        showAuthError('signup-phone', 'Please enter a valid phone number');
        return;
    }

    if (!password) {
        showAuthError('signup-password', 'Password is required');
        return;
    }

    if (!isStrongPassword(password)) {
        showAuthError('signup-password', 'Password must contain uppercase, lowercase, number, and special character');
        return;
    }

    if (password !== confirmPassword) {
        showAuthError('signup-confirm', 'Passwords do not match');
        return;
    }

    if (!termsAccepted) {
        showToast('⚠️ Please accept the Terms of Service');
        return;
    }

    performSignup({
        firstName,
        lastName,
        email,
        studentId: accountType === 'student' ? studentId : undefined,
        phone,
        password,
        role: accountType
    });
}

async function performSignup(data) {
    setButtonLoading('signup-submit-btn', 'Creating account...');

    const result = await btmsApi.register(data);
    
    if (result.success && result.data.user) {
        const user = result.data.user;
        authManager.setUser(user);
        authManager.hideAuthOverlay();
        authManager.setupRoleBasedUI(user);
        authManager.updateUserDisplay(user);

        document.getElementById('signup-form').reset();
        resetButtonLoading('signup-submit-btn');

        showToast('🎉 Account created! Welcome to BTMS, ' + data.firstName + '!');
    } else {
        resetButtonLoading('signup-submit-btn');
        showToast('❌ Signup failed: ' + (result.error || result.data?.error || 'Unknown error'));
        if (result.data?.error) {
            showAuthError('signup-email', result.data.error);
        }
    }
}

async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        await btmsApi.logout();
        authManager.clearSession();
        authManager.showAuthOverlay();

        document.getElementById('login-form').reset();
        document.getElementById('signup-form').reset();

        switchAuthForm('login');

        showToast('👋 Logged out successfully');
    }
}
```

## Available API Methods

### Authentication
```javascript
// Register
await btmsApi.register({
    firstName: 'Ahmed',
    lastName: 'Khan',
    email: 'ahmed@bahria.edu.pk',
    password: 'Test@1234',
    phone: '+923001234567',
    role: 'student',
    studentId: '21-654321-123'
});

// Login
await btmsApi.login('ahmed@bahria.edu.pk', 'Test@1234');

// Get Current User
await btmsApi.getCurrentUser();

// Logout
await btmsApi.logout();
```

### Users
```javascript
// Get user by ID
await btmsApi.getUser(userId);

// Update user profile
await btmsApi.updateUser(userId, {
    firstName: 'Ahmed',
    lastName: 'Khan',
    phone: '+923001234567'
});
```

### Routes & Transport
```javascript
// Get all routes
const routes = await btmsApi.getRoutes();

// Get all vehicles
const vehicles = await btmsApi.getVehicles();

// Get vehicle details
await btmsApi.getVehicle(vehicleId);
```

### Bookings
```javascript
// Get user's bookings
const bookings = await btmsApi.getBookings();

// Create new booking
await btmsApi.createBooking({
    route: routeId,
    travelDate: '2024-05-15',
    departureTime: '08:00 AM',
    pickupPoint: 'Clifton Campus',
    dropoffPoint: 'Defense Campus'
});

// Update booking status
await btmsApi.updateBooking(bookingId, {
    status: 'confirmed',
    paymentStatus: 'paid'
});

// Cancel booking
await btmsApi.cancelBooking(bookingId);
```

## Response Format

All API responses follow this format:

```javascript
{
    success: true/false,
    data: {
        // Response data
    },
    error: "Error message (if any)"
}
```

## Error Handling

```javascript
const result = await btmsApi.login(email, password);

if (result.success) {
    // Login successful
    console.log(result.data.user);
} else {
    // Handle error
    console.error(result.error);
    // Or handle API error response
    if (result.data.error) {
        showToast('❌ ' + result.data.error);
    }
}
```

## Token Management

Tokens are automatically stored in localStorage:
- Key: `btms_token`
- Automatically included in Authorization headers
- Automatically removed on logout

## CORS & Development

The backend is configured to accept requests from `http://localhost:3000` by default. If your frontend runs on a different port, update the `.env` file:

```env
FRONTEND_URL=http://localhost:YOUR_PORT
```

## Database

All data is persisted in MongoDB Atlas. No data is stored in browser localStorage except for the auth token.

## Next Steps

1. ✅ Backend is running
2. ✅ API integration file is ready
3. Update frontend authentication handlers (see code above)
4. Test login/signup flow
5. Implement remaining dashboard features with API calls

For detailed API documentation, see `README.md` in the backend folder.
