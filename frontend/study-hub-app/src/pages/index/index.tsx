import { useEffect, useState } from 'react'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { roomApi } from '../../services/api'
import './index.scss'

export default function Index() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkLogin()
    fetchRooms()
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

  // 获取自习室列表
  const fetchRooms = async () => {
    try {
      setLoading(true)
      const token = Taro.getStorageSync('token')
      const res = await roomApi.getRooms(token)
      setRooms(res.data.slice(0, 3)) // 首页只显示前3个
    } catch (error) {
      console.error('获取自习室失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 跳转到自习室列表
  const goToRooms = () => {
    Taro.switchTab({
      url: '/pages/rooms/index'
    })
  }

  // 跳转到我的预约
  const goToReservations = () => {
    Taro.switchTab({
      url: '/pages/reservations/index'
    })
  }

  return (
    <View className='index-container'>
      <View className='header'>
        <Text className='title'>自习室预约平台</Text>
        <Text className='subtitle'>高效学习，从这里开始</Text>
      </View>

      <Swiper
        className='banner'
        indicatorColor='#999'
        indicatorActiveColor='#1890ff'
        circular
        indicatorDots
        autoplay
      >
        <SwiperItem>
          <View className='banner-item banner-1'>
            <Text className='banner-text'>安静舒适的学习环境</Text>
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='banner-item banner-2'>
            <Text className='banner-text'>便捷的座位预约系统</Text>
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='banner-item banner-3'>
            <Text className='banner-text'>高效的学习时间管理</Text>
          </View>
        </SwiperItem>
      </Swiper>

      <View className='quick-actions'>
        <View className='action-item' onClick={goToRooms}>
          <View className='action-icon rooms-icon'></View>
          <Text className='action-text'>浏览自习室</Text>
        </View>
        <View className='action-item' onClick={goToReservations}>
          <View className='action-icon reservation-icon'></View>
          <Text className='action-text'>我的预约</Text>
        </View>
      </View>

      <View className='section'>
        <View className='section-header'>
          <Text className='section-title'>热门自习室</Text>
          <Text className='section-more' onClick={goToRooms}>查看更多</Text>
        </View>

        {loading ? (
          <View className='loading'>加载中...</View>
        ) : (
          <View className='room-list'>
            {rooms.length > 0 ? (
              rooms.map(room => (
                <View 
                  key={room._id} 
                  className='room-card'
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/room-detail/index?id=${room._id}`
                    })
                  }}
                >
                  <View className='room-info'>
                    <Text className='room-name'>{room.name}</Text>
                    <Text className='room-location'>{room.location}</Text>
                    <Text className='room-capacity'>容量: {room.capacity}座</Text>
                    <Text className='room-time'>开放时间: {room.openTime}-{room.closeTime}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className='empty'>暂无自习室信息</View>
            )}
          </View>
        )}
      </View>
    </View>
  )
}
