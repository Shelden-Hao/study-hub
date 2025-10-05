const User = require('../models/User');

// @desc    注册用户
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, studentId, password, phone } = req.body;

    // 检查用户是否已存在
    const userExists = await User.findOne({ studentId });
    if (userExists) {
      return res.status(400).json({ success: false, message: '该学号已注册' });
    }

    // 创建用户
    const user = await User.create({
      name,
      studentId,
      password,
      phone
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
};

// @desc    用户登录
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // 验证输入
    if (!studentId || !password) {
      return res.status(400).json({ success: false, message: '请提供学号和密码' });
    }

    // 查找用户
    const user = await User.findOne({ studentId }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: '无效的凭据' });
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '无效的凭据' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
};

// @desc    获取当前登录用户
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
};

// @desc    更新用户信息
// @route   PUT /api/users/me
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
};

// 生成token并发送响应
const sendTokenResponse = (user, statusCode, res) => {
  // 创建token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      studentId: user.studentId,
      phone: user.phone,
      role: user.role
    }
  });
};