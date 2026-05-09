const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ['bus', 'van', 'micro'],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    currentOccupancy: {
      type: Number,
      default: 0,
    },
    registrationNumber: {
      type: String,
      unique: true,
    },
    color: String,
    manufacturingYear: Number,
    insuranceExpiry: Date,
    lastServiceDate: Date,
    nextServiceDate: Date,
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    conductor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive'],
      default: 'active',
    },
    location: {
      latitude: Number,
      longitude: Number,
      lastUpdated: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transport', transportSchema);
