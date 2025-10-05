import Taro from '@tarojs/taro';

// API基础URL
const BASE_URL = 'http://localhost:5000/api';

// 请求方法封装
const request = async (url: string, method: any, data?: any, token?: string) => {
  const header: any = {
    'Content-Type': 'application/json'
  };

  if (token) {
    header['Authorization'] = `Bearer ${token}`;
  }

  // 对于 DELETE 请求且没有数据体时，不发送 Content-Type 和 data
  if (method === 'DELETE' && (data === null || typeof data === 'undefined')) {
    delete header['Content-Type'];
    data = undefined; // 确保不发送数据体
  }

  try {
    const response = await Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data;
    }

    throw new Error(response.data.message || '请求失败');
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

// 用户相关API
export const userApi = {
  // 用户注册
  register: (userData: any) => {
    return request('/users/register', 'POST', userData);
  },

  // 用户登录
  login: (credentials: any) => {
    return request('/users/login', 'POST', credentials);
  },

  // 获取当前用户信息
  getCurrentUser: (token: string) => {
    return request('/users/me', 'GET', null, token);
  },

  // 更新用户信息
  updateUser: (userData: any, token: string) => {
    return request('/users/me', 'PUT', userData, token);
  }
};

// 自习室相关API
export const roomApi = {
  // 获取所有自习室
  getRooms: (token?: string) => {
    return request('/rooms', 'GET', null, token);
  },

  // 获取单个自习室
  getRoom: (roomId: string, token?: string) => {
    return request(`/rooms/${roomId}`, 'GET', null, token);
  }
};

// 座位相关API
export const seatApi = {
  // 获取自习室的所有座位
  getSeatsByRoom: (roomId: string, token?: string) => {
    return request(`/seats?room=${roomId}`, 'GET', null, token);
  },

  // 获取单个座位
  getSeat: (seatId: string, token?: string) => {
    return request(`/seats/${seatId}`, 'GET', null, token);
  }
};

// 预约相关API
export const reservationApi = {
  // 获取用户的所有预约
  getUserReservations: (token: string) => {
    return request('/reservations', 'GET', null, token);
  },

  // 创建预约
  createReservation: (reservationData: any, token: string) => {
    return request('/reservations', 'POST', reservationData, token);
  },

  // 取消预约
  cancelReservation: (reservationId: string, token: string) => {
    return request(`/reservations/${reservationId}`, 'DELETE', null, token);
  }
};
// 反馈相关API
export const feedbackApi = {
  // 提交反馈
  submitFeedback: (feedbackData: any, token: string) => {
    return request('/feedbacks', 'POST', feedbackData, token);
  },

  // 获取用户反馈列表
  getUserFeedback: (token: string) => {
    return request('/feedbacks/my', 'GET', null, token);
  },

  // 获取所有反馈（管理员）
  getAllFeedback: (token: string) => {
    return request('/feedbacks', 'GET', null, token);
  }
};

// 统计相关API
export const statisticsApi = {
  // 获取用户学习统计
  getUserStatistics: (token: string) => {
    return request('/statistics/my', 'GET', null, token);
  },

  // 获取系统统计（管理员）
  getSystemStatistics: (token: string) => {
    return request('/statistics/system', 'GET', null, token);
  }
};

// 违规记录相关API
export const violationApi = {
  // 获取用户违规记录
  getUserViolations: (token: string) => {
    return request('/violations/my', 'GET', null, token);
  },

  // 获取所有违规记录（管理员）
  getAllViolations: (token: string) => {
    return request('/violations', 'GET', null, token);
  },

  // 创建违规记录（管理员）
  createViolation: (violationData: any, token: string) => {
    return request('/violations', 'POST', violationData, token);
  }
};