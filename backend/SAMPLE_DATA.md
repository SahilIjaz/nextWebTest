# BTMS Sample Data & Test Scenarios

## Sample Users for Testing

### Admin Account
```json
{
  "firstName": "Fatima",
  "lastName": "Ahmed",
  "email": "admin@bahria.edu.pk",
  "password": "Admin@1234",
  "phone": "+923001111111",
  "role": "admin"
}
```

### Student Accounts
```json
{
  "firstName": "Ahmed",
  "lastName": "Khan",
  "email": "ahmed.khan@bahria.edu.pk",
  "password": "Student@1234",
  "phone": "+923001234567",
  "role": "student",
  "studentId": "21-654321-001",
  "department": "Computer Science"
}
```

```json
{
  "firstName": "Zainab",
  "lastName": "Ali",
  "email": "zainab.ali@bahria.edu.pk",
  "password": "Student@1234",
  "phone": "+923012345678",
  "role": "student",
  "studentId": "21-654321-002",
  "department": "Engineering"
}
```

### Driver Account
```json
{
  "firstName": "Muhammad",
  "lastName": "Hassan",
  "email": "driver.hassan@bahria.edu.pk",
  "password": "Driver@1234",
  "phone": "+923009876543",
  "role": "driver"
}
```

## Sample Routes

### Route 1: Clifton to Defense
```json
{
  "routeName": "Clifton to Defense Express",
  "routeCode": "CLF-DEF-01",
  "startPoint": "Clifton Campus",
  "endPoint": "Defense Campus",
  "stops": [
    {
      "stopName": "Clifton Gate",
      "stopOrder": 1,
      "coordinates": {
        "latitude": 34.7672,
        "longitude": -73.1839
      }
    },
    {
      "stopName": "Clifton Center",
      "stopOrder": 2,
      "coordinates": {
        "latitude": 34.7680,
        "longitude": -73.1850
      }
    },
    {
      "stopName": "DHA Gate",
      "stopOrder": 3,
      "coordinates": {
        "latitude": 34.7500,
        "longitude": -73.1900
      }
    },
    {
      "stopName": "Defense Main Gate",
      "stopOrder": 4,
      "coordinates": {
        "latitude": 34.7400,
        "longitude": -73.2000
      }
    }
  ],
  "distance": 8.5,
  "estimatedDuration": 25,
  "fare": 50,
  "isActive": true,
  "schedule": [
    {
      "day": "Monday",
      "departureTime": "08:00 AM",
      "arrivalTime": "08:25 AM"
    },
    {
      "day": "Wednesday",
      "departureTime": "02:00 PM",
      "arrivalTime": "02:25 PM"
    },
    {
      "day": "Friday",
      "departureTime": "09:00 AM",
      "arrivalTime": "09:25 AM"
    }
  ]
}
```

### Route 2: Defense to Islamabad
```json
{
  "routeName": "Defense to Islamabad Highway",
  "routeCode": "DEF-ISL-01",
  "startPoint": "Defense Campus",
  "endPoint": "Islamabad Campus",
  "stops": [
    {
      "stopName": "Defense Gate",
      "stopOrder": 1,
      "coordinates": {
        "latitude": 34.7400,
        "longitude": -73.2000
      }
    },
    {
      "stopName": "Motorway Junction",
      "stopOrder": 2,
      "coordinates": {
        "latitude": 34.7200,
        "longitude": -73.1500
      }
    },
    {
      "stopName": "Rest Area",
      "stopOrder": 3,
      "coordinates": {
        "latitude": 34.6800,
        "longitude": -72.9500
      }
    },
    {
      "stopName": "Islamabad Gate",
      "stopOrder": 4,
      "coordinates": {
        "latitude": 33.7500,
        "longitude": -73.3000
      }
    }
  ],
  "distance": 45.0,
  "estimatedDuration": 90,
  "fare": 150,
  "isActive": true,
  "schedule": [
    {
      "day": "Tuesday",
      "departureTime": "07:00 AM",
      "arrivalTime": "08:30 AM"
    },
    {
      "day": "Thursday",
      "departureTime": "03:00 PM",
      "arrivalTime": "04:30 PM"
    }
  ]
}
```

## Sample Vehicles

### Vehicle 1: Main Bus
```json
{
  "vehicleNumber": "BUS-001",
  "vehicleType": "bus",
  "capacity": 50,
  "registrationNumber": "LT-8920",
  "color": "Blue",
  "manufacturingYear": 2022,
  "status": "active",
  "location": {
    "latitude": 34.7672,
    "longitude": -73.1839,
    "lastUpdated": "2024-05-09T10:30:00Z"
  }
}
```

### Vehicle 2: Van
```json
{
  "vehicleNumber": "VAN-001",
  "vehicleType": "van",
  "capacity": 15,
  "registrationNumber": "LT-8921",
  "color": "White",
  "manufacturingYear": 2023,
  "status": "active",
  "location": {
    "latitude": 34.7400,
    "longitude": -73.2000,
    "lastUpdated": "2024-05-09T10:30:00Z"
  }
}
```

## API Testing Workflow

### 1. Register a Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ahmed",
    "lastName": "Khan",
    "email": "ahmed.khan@bahria.edu.pk",
    "password": "Student@1234",
    "phone": "+923001234567",
    "role": "student",
    "studentId": "21-654321-001"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "Ahmed",
    "lastName": "Khan",
    "email": "ahmed.khan@bahria.edu.pk",
    "role": "student",
    "studentId": "21-654321-001"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed.khan@bahria.edu.pk",
    "password": "Student@1234"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "Ahmed",
    "lastName": "Khan",
    "email": "ahmed.khan@bahria.edu.pk",
    "phone": "+923001234567",
    "role": "student",
    "studentId": "21-654321-001",
    "loginTime": "5/9/2024, 3:45:30 PM",
    "sessionId": "sess_abc123xyz"
  }
}
```

### 3. Get All Routes
```bash
curl http://localhost:5000/api/transport/routes
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "routes": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "routeName": "Clifton to Defense Express",
      "routeCode": "CLF-DEF-01",
      "startPoint": "Clifton Campus",
      "endPoint": "Defense Campus",
      "distance": 8.5,
      "fare": 50
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "routeName": "Defense to Islamabad Highway",
      "routeCode": "DEF-ISL-01",
      "startPoint": "Defense Campus",
      "endPoint": "Islamabad Campus",
      "distance": 45.0,
      "fare": 150
    }
  ]
}
```

### 4. Create a Booking (Authenticated)
```bash
curl -X POST http://localhost:5000/api/transport/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "route": "507f1f77bcf86cd799439012",
    "travelDate": "2024-05-15T08:00:00Z",
    "departureTime": "08:00 AM",
    "arrivalTime": "08:25 AM",
    "pickupPoint": "Clifton Gate",
    "dropoffPoint": "Defense Main Gate"
  }'
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "_id": "507f1f77bcf86cd799439014",
    "student": "507f1f77bcf86cd799439011",
    "route": "507f1f77bcf86cd799439012",
    "travelDate": "2024-05-15T08:00:00.000Z",
    "departureTime": "08:00 AM",
    "arrivalTime": "08:25 AM",
    "fare": 50,
    "status": "pending",
    "paymentStatus": "unpaid",
    "pickupPoint": "Clifton Gate",
    "dropoffPoint": "Defense Main Gate",
    "bookingDate": "2024-05-09T15:30:00.000Z"
  }
}
```

### 5. Get User Bookings (Authenticated)
```bash
curl http://localhost:5000/api/transport/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "bookings": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "student": "507f1f77bcf86cd799439011",
      "route": {
        "_id": "507f1f77bcf86cd799439012",
        "routeName": "Clifton to Defense Express",
        "startPoint": "Clifton Campus",
        "endPoint": "Defense Campus",
        "fare": 50
      },
      "status": "pending",
      "paymentStatus": "unpaid"
    }
  ]
}
```

## Frontend Integration Example

```javascript
// Using the btmsApi service

// Register and Login
const registerResult = await btmsApi.register({
  firstName: 'Ahmed',
  lastName: 'Khan',
  email: 'ahmed.khan@bahria.edu.pk',
  password: 'Student@1234',
  phone: '+923001234567',
  role: 'student',
  studentId: '21-654321-001'
});

// Get Available Routes
const routesResult = await btmsApi.getRoutes();
console.log(routesResult.data.routes);

// Create Booking
const bookingResult = await btmsApi.createBooking({
  route: routeId,
  travelDate: '2024-05-15',
  departureTime: '08:00 AM',
  pickupPoint: 'Clifton Gate',
  dropoffPoint: 'Defense Main Gate'
});

// Get User Bookings
const myBookings = await btmsApi.getBookings();
console.log(myBookings.data.bookings);

// Update Booking Status
await btmsApi.updateBooking(bookingId, {
  status: 'confirmed',
  paymentStatus: 'paid'
});

// Cancel Booking
await btmsApi.cancelBooking(bookingId);
```

## Test Scenarios

### Scenario 1: Student Books a Route
1. Student registers account
2. Student logs in
3. Student views available routes
4. Student creates booking for a route
5. System assigns seat number
6. Booking status: pending → confirmed

### Scenario 2: Admin Manages Routes
1. Admin logs in
2. Admin creates new route
3. Admin adds stops and schedule
4. Admin creates vehicle
5. Admin assigns driver and conductor
6. Route becomes active for students

### Scenario 3: Payment Flow
1. Student books route
2. System shows fare
3. Payment marked as unpaid
4. Student makes payment
5. Admin updates payment status to paid
6. Booking confirmed

## Data Validation Rules

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain special character

### Student ID Format
- Pattern: `XX-XXXXXX-XXX`
- Example: `21-654321-123`

### Phone Number Format
- Pattern: `+92` or `0` followed by 10 digits
- Example: `+923001234567` or `03001234567`

### Email Format
- Must be valid email format
- Should contain `@bahria.edu.pk` for verification

---

Use this sample data to test all features of the BTMS system!
