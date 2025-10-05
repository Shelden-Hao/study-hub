const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const seatRoutes = require('./routes/seats');
const reservationRoutes = require('./routes/reservations');
const checkInRoutes = require('./routes/checkIns');
const feedbackRoutes = require('./routes/feedbacks');
const statisticsRoutes = require('./routes/statistics');
const violationRoutes = require('./routes/violations');

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/checkins', checkInRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/violations', violationRoutes);

// 数据库连接
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/study-hub')
  .then(() => console.log('MongoDB连接成功'))
  .catch(err => console.error('MongoDB连接失败:', err));

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});