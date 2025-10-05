const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, '请提供预约用户']
  },
  seat: {
    type: mongoose.Schema.ObjectId,
    ref: 'Seat',
    required: [true, '请提供预约座位']
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, '请提供预约自习室']
  },
  date: {
    type: Date,
    required: [true, '请提供预约日期']
  },
  startTime: {
    type: String,
    required: [true, '请提供开始时间']
  },
  endTime: {
    type: String,
    required: [true, '请提供结束时间']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 防止用户在同一时间段重复预约
ReservationSchema.index({ user: 1, date: 1, startTime: 1, status: 1 }, { unique: true });

// 防止座位在同一时间段被重复预约
ReservationSchema.index({ seat: 1, date: 1, startTime: 1, status: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', ReservationSchema);