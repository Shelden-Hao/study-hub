# 自习室预约平台 API 文档

## 基础信息

- 基础URL: `http://localhost:5000/api`
- 所有请求需要在header中携带token: `Authorization: Bearer {token}`（除了登录和注册接口）
- 响应格式: JSON

## 用户相关接口

### 用户注册

- **URL**: `/users/register`
- **方法**: `POST`
- **描述**: 注册新用户
- **请求体**:
  ```json
  {
    "name": "张三",
    "studentId": "20210001",
    "phone": "13800138000",
    "password": "password123"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "张三",
      "studentId": "20210001",
      "phone": "13800138000",
      "role": "user",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 用户登录

- **URL**: `/users/login`
- **方法**: `POST`
- **描述**: 用户登录
- **请求体**:
  ```json
  {
    "studentId": "20210001",
    "password": "password123"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "张三",
      "studentId": "20210001",
      "phone": "13800138000",
      "role": "user",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 获取当前用户信息

- **URL**: `/users/me`
- **方法**: `GET`
- **描述**: 获取当前登录用户信息
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "张三",
      "studentId": "20210001",
      "phone": "13800138000",
      "role": "user",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 更新用户信息

- **URL**: `/users/me`
- **方法**: `PUT`
- **描述**: 更新当前登录用户信息
- **请求体**:
  ```json
  {
    "name": "张三修改",
    "phone": "13900139000"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "张三修改",
      "studentId": "20210001",
      "phone": "13900139000",
      "role": "user",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

## 自习室相关接口

### 获取所有自习室

- **URL**: `/rooms`
- **方法**: `GET`
- **描述**: 获取所有自习室信息
- **响应**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "图书馆自习室A",
        "location": "图书馆一楼",
        "capacity": 50,
        "openTime": "08:00",
        "closeTime": "22:00",
        "description": "安静舒适的学习环境",
        "status": "open",
        "createdAt": "2023-06-22T10:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "图书馆自习室B",
        "location": "图书馆二楼",
        "capacity": 40,
        "openTime": "08:00",
        "closeTime": "22:00",
        "description": "适合小组讨论",
        "status": "open",
        "createdAt": "2023-06-22T10:00:00.000Z"
      }
    ]
  }
  ```

### 获取单个自习室

- **URL**: `/rooms/:id`
- **方法**: `GET`
- **描述**: 获取指定ID的自习室信息
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "图书馆自习室A",
      "location": "图书馆一楼",
      "capacity": 50,
      "openTime": "08:00",
      "closeTime": "22:00",
      "description": "安静舒适的学习环境",
      "status": "open",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 创建自习室（仅管理员）

- **URL**: `/rooms`
- **方法**: `POST`
- **描述**: 创建新的自习室
- **请求体**:
  ```json
  {
    "name": "图书馆自习室C",
    "location": "图书馆三楼",
    "capacity": 30,
    "openTime": "08:00",
    "closeTime": "22:00",
    "description": "安静的学习环境",
    "status": "open"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c88",
      "name": "图书馆自习室C",
      "location": "图书馆三楼",
      "capacity": 30,
      "openTime": "08:00",
      "closeTime": "22:00",
      "description": "安静的学习环境",
      "status": "open",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 更新自习室（仅管理员）

- **URL**: `/rooms/:id`
- **方法**: `PUT`
- **描述**: 更新指定ID的自习室信息
- **请求体**:
  ```json
  {
    "name": "图书馆自习室C修改",
    "status": "closed"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c88",
      "name": "图书馆自习室C修改",
      "location": "图书馆三楼",
      "capacity": 30,
      "openTime": "08:00",
      "closeTime": "22:00",
      "description": "安静的学习环境",
      "status": "closed",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 删除自习室（仅管理员）

- **URL**: `/rooms/:id`
- **方法**: `DELETE`
- **描述**: 删除指定ID的自习室
- **响应**:
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

## 座位相关接口

### 获取所有座位

- **URL**: `/seats`
- **方法**: `GET`
- **描述**: 获取所有座位信息，可通过room参数筛选特定自习室的座位
- **查询参数**: `?room=60d21b4667d0d8992e610c86`
- **响应**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "60d21b4667d0d8992e610c89",
        "seatNumber": "A1",
        "room": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "图书馆自习室A"
        },
        "status": "available",
        "createdAt": "2023-06-22T10:00:00.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c90",
        "seatNumber": "A2",
        "room": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "图书馆自习室A"
        },
        "status": "available",
        "createdAt": "2023-06-22T10:00:00.000Z"
      }
    ]
  }
  ```

### 获取单个座位

- **URL**: `/seats/:id`
- **方法**: `GET`
- **描述**: 获取指定ID的座位信息
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c89",
      "seatNumber": "A1",
      "room": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "图书馆自习室A"
      },
      "status": "available",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 创建座位（仅管理员）

- **URL**: `/seats`
- **方法**: `POST`
- **描述**: 创建新的座位
- **请求体**:
  ```json
  {
    "seatNumber": "A3",
    "room": "60d21b4667d0d8992e610c86",
    "status": "available"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c91",
      "seatNumber": "A3",
      "room": "60d21b4667d0d8992e610c86",
      "status": "available",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 更新座位（仅管理员）

- **URL**: `/seats/:id`
- **方法**: `PUT`
- **描述**: 更新指定ID的座位信息
- **请求体**:
  ```json
  {
    "status": "unavailable"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c91",
      "seatNumber": "A3",
      "room": "60d21b4667d0d8992e610c86",
      "status": "unavailable",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 删除座位（仅管理员）

- **URL**: `/seats/:id`
- **方法**: `DELETE`
- **描述**: 删除指定ID的座位
- **响应**:
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

## 预约相关接口

### 获取所有预约

- **URL**: `/reservations`
- **方法**: `GET`
- **描述**: 获取当前用户的所有预约信息
- **响应**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "60d21b4667d0d8992e610c92",
        "user": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "张三"
        },
        "seat": {
          "_id": "60d21b4667d0d8992e610c89",
          "seatNumber": "A1"
        },
        "room": {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "图书馆自习室A",
          "location": "图书馆一楼"
        },
        "date": "2023-06-23",
        "startTime": "10:00",
        "endTime": "12:00",
        "status": "pending",
        "createdAt": "2023-06-22T10:00:00.000Z"
      }
    ]
  }
  ```

### 获取单个预约

- **URL**: `/reservations/:id`
- **方法**: `GET`
- **描述**: 获取指定ID的预约信息
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c92",
      "user": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "张三"
      },
      "seat": {
        "_id": "60d21b4667d0d8992e610c89",
        "seatNumber": "A1"
      },
      "room": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "图书馆自习室A",
        "location": "图书馆一楼"
      },
      "date": "2023-06-23",
      "startTime": "10:00",
      "endTime": "12:00",
      "status": "pending",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 创建预约

- **URL**: `/reservations`
- **方法**: `POST`
- **描述**: 创建新的预约
- **请求体**:
  ```json
  {
    "seat": "60d21b4667d0d8992e610c89",
    "room": "60d21b4667d0d8992e610c86",
    "date": "2023-06-24",
    "startTime": "14:00",
    "endTime": "16:00"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c93",
      "user": "60d21b4667d0d8992e610c85",
      "seat": "60d21b4667d0d8992e610c89",
      "room": "60d21b4667d0d8992e610c86",
      "date": "2023-06-24",
      "startTime": "14:00",
      "endTime": "16:00",
      "status": "pending",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 更新预约

- **URL**: `/reservations/:id`
- **方法**: `PUT`
- **描述**: 更新指定ID的预约信息
- **请求体**:
  ```json
  {
    "startTime": "15:00",
    "endTime": "17:00"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c93",
      "user": "60d21b4667d0d8992e610c85",
      "seat": "60d21b4667d0d8992e610c89",
      "room": "60d21b4667d0d8992e610c86",
      "date": "2023-06-24",
      "startTime": "15:00",
      "endTime": "17:00",
      "status": "pending",
      "createdAt": "2023-06-22T10:00:00.000Z"
    }
  }
  ```

### 取消预约

- **URL**: `/reservations/:id`
- **方法**: `DELETE`
- **描述**: 取消指定ID的预约
- **响应**:
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

## 错误响应

所有API在发生错误时会返回以下格式的响应：

```json
{
  "success": false,
  "error": "错误信息",
  "message": "详细错误描述"
}
```

常见错误状态码：
- 400: 请求参数错误
- 401: 未授权（未登录或token无效）
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误