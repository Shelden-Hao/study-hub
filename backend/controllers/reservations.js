const Reservation = require("../models/Reservation");
const Seat = require("../models/Seat");
const Room = require("../models/Room");

// @desc    获取所有预约
// @route   GET /api/reservations
// @access  Private
exports.getReservations = async (req, res) => {
  try {
    let query;

    // 如果是普通用户，只能查看自己的预约
    if (req.user.role !== "admin") {
      query = Reservation.find({ user: req.user.id });
    } else {
      query = Reservation.find();
    }

    // 添加关联查询
    query = query.populate([
      { path: "user", select: "name studentId phone" },
      { path: "seat", select: "seatNumber status" },
      { path: "room", select: "name location" },
    ]);

    const reservations = await query;

    res
      .status(200)
      .json({ success: true, count: reservations.length, data: reservations });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "服务器错误", error: err.message });
  }
};

// @desc    获取单个预约
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate([
      { path: "user", select: "name studentId phone" },
      { path: "seat", select: "seatNumber status" },
      { path: "room", select: "name location" },
    ]);

    if (!reservation) {
      return res.status(404).json({ success: false, message: "未找到预约" });
    }

    // 确保用户只能查看自己的预约，除非是管理员
    if (
      reservation.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "无权查看此预约" });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "服务器错误", error: err.message });
  }
};

// @desc    创建预约
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    // 添加用户ID到请求体
    req.body.user = req.user.id;

    // 检查座位是否存在
    const seat = await Seat.findById(req.body.seat);
    if (!seat) {
      return res.status(404).json({ success: false, message: "未找到座位" });
    }

    // 检查自习室是否存在
    const room = await Room.findById(req.body.room);
    if (!room) {
      return res.status(404).json({ success: false, message: "未找到自习室" });
    }

    // 检查座位是否可用
    if (seat.status !== "available") {
      return res.status(400).json({ success: false, message: "座位不可用" });
    }

    // 检查用户是否已有预约
    const userExistingReservation = await Reservation.findOne({
      user: req.user.id,
      date: req.body.date,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          startTime: { $lte: req.body.startTime },
          endTime: { $gt: req.body.startTime },
        },
        {
          startTime: { $lt: req.body.endTime },
          endTime: { $gte: req.body.endTime },
        },
        {
          startTime: { $gte: req.body.startTime },
          endTime: { $lte: req.body.endTime },
        },
      ],
    });

    if (userExistingReservation) {
      return res
        .status(400)
        .json({
          success: false,
          message: "您在该时间段已有预约，请勿重复预约",
        });
    }

    // 检查座位时间段是否有冲突
    const seatExistingReservation = await Reservation.findOne({
      seat: req.body.seat,
      date: req.body.date,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          startTime: { $lte: req.body.startTime },
          endTime: { $gt: req.body.startTime },
        },
        {
          startTime: { $lt: req.body.endTime },
          endTime: { $gte: req.body.endTime },
        },
        {
          startTime: { $gte: req.body.startTime },
          endTime: { $lte: req.body.endTime },
        },
      ],
    });

    if (seatExistingReservation) {
      return res
        .status(400)
        .json({ success: false, message: "该时间段座位已被预约" });
    }

    // 创建预约
    const reservation = await Reservation.create(req.body);

    // 更新座位状态
    seat.status = "occupied";
    await seat.save();

    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "服务器错误", error: err.message });
  }
};

// @desc    更新预约
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: "未找到预约" });
    }

    // 确保用户只能更新自己的预约，除非是管理员
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "无权更新此预约" });
    }

    // 不允许更改用户和座位
    delete req.body.user;
    delete req.body.seat;

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "服务器错误", error: err.message });
  }
};

// @desc    取消预约
// @route   DELETE /api/reservations/:id
// @access  Private
exports.cancelReservation = async (req, res) => {
  
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: "未找到预约" });
    }

    // 确保用户只能取消自己的预约，除非是管理员
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "无权取消此预约" });
    }

    // 更新预约状态为已取消
    reservation.status = "cancelled";
    await reservation.save();

    // 更新座位状态为可用
    const seat = await Seat.findById(reservation.seat);
    if (seat) {
      seat.status = "available";
      await seat.save();
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "服务器错误", error: err.message });
  }
};
