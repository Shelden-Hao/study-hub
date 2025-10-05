const Seat = require('../models/Seat');
const Room = require('../models/Room');

// @desc    获取所有座位
// @route   GET /api/seats
// @access  Public
exports.getSeats = async (req, res) => {
  try {
    let query;
    
    // 复制req.query
    const reqQuery = { ...req.query };
    
    // 如果有room参数，查询特定自习室的座位
    if (req.query.room) {
      query = Seat.find({ room: req.query.room });
    } else {
      query = Seat.find();
    }
    
    // 添加关联查询
    query = query.populate('room', 'name location');
    
    const seats = await query;
    
    res.status(200).json({ success: true, count: seats.length, data: seats });
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
};

// @desc    获取单个座位
// @route   GET /api/seats/:id
// @access  Public
exports.getSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id).populate('room', 'name location');
    
    if (!seat) {
      return res.status(404).json({ success: false, message: '未找到座位' });
    }
    
    res.status(200).json({ success: true, data: seat });
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
};

// @desc    创建座位
// @route   POST /api/seats
// @access  Private/Admin
exports.createSeat = async (req, res) => {
  try {
    // 检查自习室是否存在
    const room = await Room.findById(req.body.room);
    if (!room) {
      return res.status(404).json({ success: false, message: '未找到自习室' });
    }
    
    const seat = await Seat.create(req.body);
    res.status(201).json({ success: true, data: seat });
  } catch (err) {
    // 处理唯一索引冲突
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: '该自习室中已存在相同座位号' });
    }
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
};

// @desc    更新座位
// @route   PUT /api/seats/:id
// @access  Private/Admin
exports.updateSeat = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!seat) {
      return res.status(404).json({ success: false, message: '未找到座位' });
    }
    
    res.status(200).json({ success: true, data: seat });
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
};

// @desc    删除座位
// @route   DELETE /api/seats/:id
// @access  Private/Admin
exports.deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    
    if (!seat) {
      return res.status(404).json({ success: false, message: '未找到座位' });
    }
    
    await seat.deleteOne();
    
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
};