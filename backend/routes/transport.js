const express = require('express');
const router = express.Router();
const Transport = require('../models/Transport');
const Route = require('../models/Route');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// ===== ROUTES =====

// @route   GET /api/transport/routes
// @desc    Get all active routes
// @access  Public
router.get('/routes', async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: routes.length,
      routes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/transport/routes/:id
// @desc    Get route details
// @access  Public
router.get('/routes/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.status(200).json({
      success: true,
      route,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/transport/routes
// @desc    Create a new route (admin only)
// @access  Private/Admin
router.post('/routes', protect, authorize('admin'), async (req, res) => {
  try {
    const { routeName, routeCode, startPoint, endPoint, stops, distance, estimatedDuration, fare, schedule } = req.body;

    const route = await Route.create({
      routeName,
      routeCode,
      startPoint,
      endPoint,
      stops,
      distance,
      estimatedDuration,
      fare,
      schedule,
    });

    res.status(201).json({
      success: true,
      route,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/transport/routes/:id
// @desc    Update route (admin only)
// @access  Private/Admin
router.put('/routes/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.status(200).json({
      success: true,
      route,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== TRANSPORT VEHICLES =====

// @route   GET /api/transport/vehicles
// @desc    Get all active vehicles
// @access  Private
router.get('/vehicles', protect, async (req, res) => {
  try {
    const vehicles = await Transport.find({ isActive: true })
      .populate('driver', 'firstName lastName email')
      .populate('conductor', 'firstName lastName email')
      .populate('assignedRoute', 'routeName startPoint endPoint');

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/transport/vehicles/:id
// @desc    Get vehicle details
// @access  Private
router.get('/vehicles/:id', protect, async (req, res) => {
  try {
    const vehicle = await Transport.findById(req.params.id)
      .populate('driver', 'firstName lastName email phone')
      .populate('conductor', 'firstName lastName email phone')
      .populate('assignedRoute', 'routeName startPoint endPoint');

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/transport/vehicles
// @desc    Create a new vehicle (admin only)
// @access  Private/Admin
router.post('/vehicles', protect, authorize('admin'), async (req, res) => {
  try {
    const { vehicleNumber, vehicleType, capacity, registrationNumber, color, manufacturingYear, driver, conductor, assignedRoute } = req.body;

    const vehicle = await Transport.create({
      vehicleNumber,
      vehicleType,
      capacity,
      registrationNumber,
      color,
      manufacturingYear,
      driver,
      conductor,
      assignedRoute,
    });

    res.status(201).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/transport/vehicles/:id
// @desc    Update vehicle (admin only)
// @access  Private/Admin
router.put('/vehicles/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const vehicle = await Transport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== BOOKINGS =====

// @route   GET /api/transport/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.userId })
      .populate('route', 'routeName startPoint endPoint fare')
      .populate('transport', 'vehicleNumber vehicleType');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/transport/bookings
// @desc    Create a new booking
// @access  Private
router.post('/bookings', protect, async (req, res) => {
  try {
    const { route, travelDate, departureTime, arrivalTime, pickupPoint, dropoffPoint, notes } = req.body;

    // Get route details for fare
    const routeData = await Route.findById(route);
    if (!routeData) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const booking = await Booking.create({
      student: req.userId,
      route,
      travelDate,
      departureTime,
      arrivalTime,
      fare: routeData.fare,
      pickupPoint,
      dropoffPoint,
      notes,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/transport/bookings/:id
// @desc    Update booking status
// @access  Private
router.put('/bookings/:id', protect, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (booking.student.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    booking.status = status || booking.status;
    booking.paymentStatus = paymentStatus || booking.paymentStatus;
    await booking.save();

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/transport/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/bookings/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (booking.student.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/transport/bookings/admin/all
// @desc    Get all bookings (admin only)
// @access  Private/Admin
router.get('/bookings/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('student', 'firstName lastName email')
      .populate('route', 'routeName')
      .populate('transport', 'vehicleNumber');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
