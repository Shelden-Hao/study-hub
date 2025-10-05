import { useEffect, useState } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { userApi } from '../../services/api'
import './index.scss'

export default function User() {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkLogin()
    fetchUserInfo()
  }, [])

  // 检查登录状态
  const checkLogin = () => {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      const token = Taro.getStorageSync('token')
      const res = await userApi.getCurrentUser(token)
      setUserInfo(res.data)
    } catch (error) {
      console.error('获取用户信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          // 清除本地存储
          Taro.removeStorageSync('token')
          Taro.removeStorageSync('userInfo')
          
          // 跳转到登录页
          Taro.reLaunch({
            url: '/pages/login/index'
          })
        }
      }
    })
  }

  if (loading) {
    return <View className='loading'>加载中...</View>
  }

  if (!userInfo) {
    return <View className='error'>获取用户信息失败</View>
  }

  return (
    <View className='user-container'>
      <View className='user-card'>
        <View className='avatar-container'>
          <View className='avatar'></View>
        </View>
        <Text className='user-name'>{userInfo.name}</Text>
        <Text className='user-role'>{userInfo.role === 'admin' ? '管理员' : '学生'}</Text>
      </View>

      <View className='info-section'>
        <View className='info-item'>
          <Text className='info-label'>学号</Text>
          <Text className='info-value'>{userInfo.studentId}</Text>
        </View>
        <View className='info-item'>
          <Text className='info-label'>手机号</Text>
          <Text className='info-value'>{userInfo.phone}</Text>
        </View>
        <View className='info-item'>
          <Text className='info-label'>注册时间</Text>
          <Text className='info-value'>{new Date(userInfo.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <Button className='logout-button' onClick={handleLogout}>
        退出登录
      </Button>
    </View>
  )
}