const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: [true, 'Route name is required'],
      unique: true,
    },
    routeCode: {
      type: String,
      required: true,
      unique: true,
    },
    startPoint: {
      type: String,
      required: true,
    },
    endPoint: {
      type: String,
      required: true,
    },
    stops: [
      {
        stopName: String,
        stopOrder: Number,
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
    ],
    distance: {
      type: Number,
      required: true,
    },
    estimatedDuration: {
      type: Number,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    schedule: [
      {
        day: String,
        departureTime: String,
        arrivalTime: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
