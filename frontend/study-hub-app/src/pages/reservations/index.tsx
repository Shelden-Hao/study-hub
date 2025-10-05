import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { reservationApi } from '../../services/api'
import './index.scss'

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkLogin()
    fetchReservations()
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

  // 获取预约列表
  const fetchReservations = async () => {
    try {
      setLoading(true)
      const token = Taro.getStorageSync('token')
      const res = await reservationApi.getUserReservations(token)
      setReservations(res.data)
    } catch (error) {
      console.error('获取预约列表失败:', error)
      Taro.showToast({
        title: '获取预约列表失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 取消预约
  const handleCancel = async (id) => {
    try {
      const token = Taro.getStorageSync('token')
      await reservationApi.cancelReservation(id, token)
      
      Taro.showToast({
        title: '取消成功',
        icon: 'success'
      })
      
      // 刷新列表
      fetchReservations()
    } catch (error) {
      Taro.showToast({
        title: error.message || '取消失败',
        icon: 'none'
      })
    }
  }

  // 获取状态文本和颜色
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { text: '待使用', color: '#1890ff' }
      case 'active':
        return { text: '使用中', color: '#52c41a' }
      case 'completed':
        return { text: '已完成', color: '#8c8c8c' }
      case 'cancelled':
        return { text: '已取消', color: '#f5222d' }
      default:
        return { text: '未知', color: '#8c8c8c' }
    }
  }

  // 返回上一页
  const handleBack = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }

  return (
    <View className='reservations-container'>
      <View className='header'>
        <View className='back-btn' onClick={handleBack}>
          <Text className='back-icon'>←</Text>
          <Text className='back-text'>返回</Text>
        </View>
        <Text className='title'>我的预约</Text>
      </View>

      {loading ? (
        <View className='loading'>加载中...</View>
      ) : (
        <ScrollView scrollY className='reservation-list'>
          {reservations.length > 0 ? (
            reservations.map(reservation => {
              const statusInfo = getStatusInfo(reservation.status)
              
              return (
                <View key={reservation._id} className='reservation-card'>
                  <View className='reservation-header'>
                    <Text className='room-name'>{reservation.room.name}</Text>
                    <Text className='status' style={{ color: statusInfo.color }}>{statusInfo.text}</Text>
                  </View>
                  
                  <View className='reservation-info'>
                    <Text className='info-item'>座位号: {reservation.seat.seatNumber}</Text>
                    <Text className='info-item'>日期: {reservation.date}</Text>
                    <Text className='info-item'>时间: {reservation.startTime} - {reservation.endTime}</Text>
                    <Text className='info-item'>地点: {reservation.room.location}</Text>
                  </View>
                  
                  {reservation.status === 'pending' && (
                    <Button 
                      className='cancel-button' 
                      onClick={() => handleCancel(reservation._id)}
                    >
                      取消预约
                    </Button>
                  )}
                </View>
              )
            })
          ) : (
            <View className='empty'>
              <Text className='empty-text'>暂无预约记录</Text>
              <Button 
                className='create-button'
                onClick={() => {
                  Taro.switchTab({
                    url: '/pages/rooms/index'
                  })
                }}
              >
                去预约
              </Button>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}