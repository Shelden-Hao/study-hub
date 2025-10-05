import { useEffect, useState } from 'react'
import { View, Text, Button, Picker } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { roomApi, seatApi, reservationApi } from '../../services/api'
import './index.scss'


export default function RoomDetail() {
  const router = useRouter()
  const { id } = router.params
  
  const [room, setRoom] = useState(null)
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [date, setDate] = useState(formatDate(new Date()))
  const [timeRange, setTimeRange] = useState(['08:00', '10:00'])
  const [submitting, setSubmitting] = useState(false)
  const [userReservation, setUserReservation] = useState(null) // 新增：存储用户当前预约

  useEffect(() => {
    if (id) {
      fetchRoomDetail(id)
      fetchSeats(id)
      fetchUserReservation(id) // 新增：获取用户预约信息
    }
  }, [id])

  // 格式化日期
  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 获取自习室详情
  const fetchRoomDetail = async (roomId) => {
    try {
      setLoading(true)
      const token = Taro.getStorageSync('token')
      const res = await roomApi.getRoom(roomId, token)
      setRoom(res.data)
    } catch (error) {
      console.error('获取自习室详情失败:', error)
      Taro.showToast({
        title: '获取自习室详情失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 获取座位列表
  const fetchSeats = async (roomId) => {
    try {
      const token = Taro.getStorageSync('token')
      const res = await seatApi.getSeatsByRoom(roomId, token)
      setSeats(res.data)
    } catch (error) {
      console.error('获取座位列表失败:', error)
    }
  }

  // 选择座位
  const handleSelectSeat = (seat) => {
    if (seat.status === 'available') {
      setSelectedSeat(seat)
    } else {
      Taro.showToast({
        title: '该座位不可用',
        icon: 'none'
      })
    }
  }

  // 日期选择
  const onDateChange = (e) => {
    setDate(e.detail.value)
  }

  // 时间选择
  const onTimeChange = (e) => {
    const [startTime, endTime] = e.detail.value.split(' - ')
    setTimeRange([startTime, endTime])
  }

  // 提交预约
  const handleSubmit = async () => {
    if (!selectedSeat) {
      Taro.showToast({
        title: '请选择座位',
        icon: 'none'
      })
      return
    }

    try {
      setSubmitting(true)
      const token = Taro.getStorageSync('token')
      
      await reservationApi.createReservation({
        seat: selectedSeat._id,
        room: id,
        date,
        startTime: timeRange[0],
        endTime: timeRange[1]
      }, token)

      Taro.showToast({
        title: '预约成功',
        icon: 'success'
      })

      // 跳转到我的预约页面
      setTimeout(() => {
        Taro.switchTab({
          url: '/pages/reservations/index'
        })
      }, 1500)
    } catch (error) {
      Taro.showToast({
        title: error.message || '预约失败',
        icon: 'none'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // 生成时间选择器的选项
  const generateTimeOptions = () => {
    const options = []
    const startHour = 8
    const endHour = 22
    
    for (let i = startHour; i < endHour; i++) {
      for (let j = i + 1; j <= endHour; j++) {
        const start = `${String(i).padStart(2, '0')}:00`
        const end = `${String(j).padStart(2, '0')}:00`
        options.push(`${start} - ${end}`)
      }
    }
    
    return options
  }

  // 获取用户在该自习室的预约信息
  const fetchUserReservation = async (roomId) => {
    try {
      const token = Taro.getStorageSync('token')
      const res = await reservationApi.getMyReservations(token) // 获取所有预约
      const currentReservation = res.data.find(r => 
        r.room._id === roomId && 
        (r.status === 'pending' || r.status === 'checked_in') &&
        new Date(r.date + ' ' + r.endTime) > new Date()
      )
      setUserReservation(currentReservation || null) // 确保没有找到时设置为 null
    } catch (error) {
      console.error('获取用户预约失败:', error)
      setUserReservation(null) // 发生错误时也设置为 null
    }
  }

  // 签到
  const handleCheckIn = async () => {
    if (!userReservation) return
    try {
      setSubmitting(true)
      const token = Taro.getStorageSync('token')
      await reservationApi.checkIn(userReservation._id, token)
      Taro.showToast({
        title: '签到成功',
        icon: 'success'
      })
      fetchUserReservation(id) // 刷新预约状态
    } catch (error) {
      Taro.showToast({
        title: error.message || '签到失败',
        icon: 'none'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // 签退
  const handleCheckOut = async () => {
    if (!userReservation) return
    try {
      setSubmitting(true)
      const token = Taro.getStorageSync('token')
      await reservationApi.checkOut(userReservation._id, token)
      Taro.showToast({
        title: '签退成功',
        icon: 'success'
      })
      fetchUserReservation(id) // 刷新预约状态
    } catch (error) {
      Taro.showToast({
        title: error.message || '签退失败',
        icon: 'none'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // 取消预约
  const handleCancelReservation = async () => {
    if (!userReservation) return
    
    Taro.showModal({
      title: '取消预约',
      content: '确定要取消此预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            setSubmitting(true)
            const token = Taro.getStorageSync('token')
            await reservationApi.cancelReservation(userReservation._id, token)
            Taro.showToast({
              title: '取消成功',
              icon: 'success'
            })
            fetchUserReservation(id) // 刷新预约状态
          } catch (error) {
            Taro.showToast({
              title: error.message || '取消失败',
              icon: 'none'
            })
          } finally {
            setSubmitting(false)
          }
        }
      }
    })
  }

  // 返回上一页
  const handleBack = () => {
    Taro.navigateBack({
      delta: 1
    })
  }

  return (
    <View className='room-detail-container'>
      {loading ? (
        <View className='loading-container'>
          <Text className='loading-text'>加载中...</Text>
        </View>
      ) : room ? (
        <>
          <View className='room-header'>
            <View className='back-btn' onClick={handleBack}>
              <Text className='back-icon'>←</Text>
              <Text className='back-text'>返回</Text>
            </View>
            <Text className='room-name'>{room.name}</Text>
            <Text className='room-location'>{room.location}</Text>
            <View className='room-info'>
              <Text className='room-capacity'>容量: {room.capacity}座</Text>
              <Text className='room-time'>开放时间: {room.openTime}-{room.closeTime}</Text>
            </View>
            <Text className='room-status' style={{ color: room.status === 'open' ? '#52c41a' : '#f5222d' }}>
              {room.status === 'open' ? '开放中' : '已关闭'}
            </Text>
            {room.description && (
              <Text className='room-description'>{room.description}</Text>
            )}
          </View>

          {/* 签到/签退/取消预约区域 */}
          {userReservation && (
            <View className='section check-in-out-section'>
              <Text className='section-title'>我的预约</Text>
              <View className='reservation-info'>
                <Text>座位: {userReservation.seat.seatNumber}</Text>
                <Text>时间: {userReservation.date} {userReservation.startTime}-{userReservation.endTime}</Text>
                <Text>状态: {userReservation.status === 'pending' ? '待签到' : userReservation.status === 'confirmed' ? '已预约' : userReservation.status === 'checked_in' ? '已签到' : '已取消'}</Text>
              </View>
              <View className='reservation-actions'>
                {userReservation.status === 'pending' && new Date() >= new Date(userReservation.date + ' ' + userReservation.startTime) && new Date() <= new Date(userReservation.date + ' ' + userReservation.endTime) && (
                  <Button 
                    className='check-in-button' 
                    onClick={handleCheckIn}
                    loading={submitting}
                    disabled={submitting}
                  >
                    签到
                  </Button>
                )}
                {userReservation.status === 'checked_in' && new Date() <= new Date(userReservation.date + ' ' + userReservation.endTime) && (
                  <Button 
                    className='check-out-button' 
                    onClick={handleCheckOut}
                    loading={submitting}
                    disabled={submitting}
                  >
                    签退
                  </Button>
                )}
                {(userReservation.status === 'pending' || userReservation.status === 'confirmed') && (
                  <Button 
                    className='cancel-button' 
                    onClick={handleCancelReservation}
                    loading={submitting}
                    disabled={submitting}
                  >
                    取消预约
                  </Button>
                )}
              </View>
            </View>
          )}

          <View className='section'>
            <Text className='section-title'>选择座位</Text>
            <View className='seat-grid'>
              {seats.length > 0 ? (
                seats.map(seat => (
                  <View 
                    key={seat._id} 
                    className={`seat-item ${seat.status === 'available' ? 'available' : 'unavailable'} ${selectedSeat && selectedSeat._id === seat._id ? 'selected' : ''}`}
                    onClick={() => handleSelectSeat(seat)}
                  >
                    <Text className='seat-number'>{seat.seatNumber}</Text>
                  </View>
                ))
              ) : (
                <View className='empty'>暂无座位信息</View>
              )}
            </View>
          </View>

          {!userReservation && (
            <View className='section'>
              <Text className='section-title'>选择日期和时间</Text>
              
              <View className='form-item'>
                <Text className='form-label'>日期</Text>
                <Picker mode='date' value={date} onChange={onDateChange}>
                  <View className='picker'>
                    {date}
                  </View>
                </Picker>
              </View>

              <View className='form-item'>
                <Text className='form-label'>时间段</Text>
                <Picker mode='selector' range={generateTimeOptions()} onChange={onTimeChange}>
                  <View className='picker'>
                    {timeRange[0]} - {timeRange[1]}
                  </View>
                </Picker>
              </View>
            </View>
          )}

          {!userReservation && (
            <Button 
              className='submit-button' 
              onClick={handleSubmit}
              loading={submitting}
              disabled={!selectedSeat || room.status !== 'open'}
            >
              确认预约
            </Button>
          )}
        </>
      ) : (
        <View className='empty-room-detail'>
          <Text className='empty-text'>未能加载自习室详情</Text>
        </View>
      )}
    </View>
  )
}