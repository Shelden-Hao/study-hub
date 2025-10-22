const Feedback = require('../models/Feedback');

// @desc    提交反馈
// @route   POST /api/feedbacks
// @access  Private
exports.submitFeedback = async (req, res) => {
  try {
    const { type, content } = req.body;

    // 验证输入
    if (!type || !content) {
      return res.status(400).json({
        success: false,
        message: '反馈类型和内容不能为空'
      });
    }

    if (!['environment', 'equipment', 'suggestion', 'other'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: '无效的反馈类型'
      });
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      type,
      content: content.trim()
    });

    res.status(201).json({
      success: true,
      data: feedback,
      message: '反馈提交成功'
    });
  } catch (err) {
    console.error('提交反馈错误:', err);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: err.message
    });
  }
};

// @desc    获取用户反馈
// @route   GET /api/feedbacks/my
// @access  Private
exports.getUserFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (err) {
    console.error('获取用户反馈错误:', err);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: err.message
    });
  }
};

// @desc    获取所有反馈 (管理员)
// @route   GET /api/feedbacks
// @access  Private/Admin
exports.getAllFeedbacks = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    // 构建查询条件
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const feedbacks = await Feedback.find(query)
      .populate('user', 'username studentId email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: feedbacks
    });
  } catch (err) {
    console.error('获取所有反馈错误:', err);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: err.message
    });
  }
};

// @desc    更新反馈状态或回复 (管理员)
// @route   PUT /api/feedbacks/:id
// @access  Private/Admin
exports.updateFeedback = async (req, res) => {
  try {
    const { status, response } = req.body;

    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: '未找到反馈'
      });
    }

    // 更新字段
    if (status) feedback.status = status;
    if (response !== undefined) feedback.response = response;

    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback,
      message: '反馈更新成功'
    });
  } catch (err) {
    console.error('更新反馈错误:', err);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: err.message
    });
  }
};

// @desc    删除反馈 (管理员)
// @route   DELETE /api/feedbacks/:id
// @access  Private/Admin
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: '未找到反馈'
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: '反馈删除成功'
    });
  } catch (err) {
    console.error('删除反馈错误:', err);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: err.message
    });
  }
};