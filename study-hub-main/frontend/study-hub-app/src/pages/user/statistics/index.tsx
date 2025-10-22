import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';
import { statisticsApi } from '../../../services/api';

interface StudyStats {
  totalStudyDuration: number;
  dailyStudyDuration: { [date: string]: number };
  roomUsage: { [roomName: string]: number };
  totalSessions: number;
  studyDays: number;
  averageDailyDuration: number;
  maxDailyDuration: number;
  currentMonthDuration: number;
  monthlyStats: { [month: string]: number };
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = Taro.getStorageSync('token');

      if (!token) {
        Taro.showToast({
          title: '请先登录',
          icon: 'none',
        });
        Taro.navigateTo({ url: '/pages/login/index' });
        return;
      }

      const res = await statisticsApi.getUserStatistics(token);
      setStats(res.data);
    } catch (error) {
      console.error('获取学习统计失败:', error);
      Taro.showToast({
        title: error.message || '获取学习统计失败',
        icon: 'none',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
    }
    return `${mins}分钟`;
  };

  const handleRefresh = () => {
    fetchStats(true);
  };

  if (loading) {
    return (
      <View className='statistics-container'>
        <View className='header'>
          <View className='back-btn' onClick={() => Taro.navigateBack()}>
            <Text className='back-icon'>{'<'}</Text>
            <Text className='back-text'>返回</Text>
          </View>
          <Text className='title'>学习统计</Text>
        </View>
        <View className='loading'>
          <Text className='loading-text'>加载中...</Text>
        </View>
      </View>
    );
  }

  if (!stats) {
    return (
      <View className='statistics-container'>
        <View className='header'>
          <View className='back-btn' onClick={() => Taro.navigateBack()}>
            <Text className='back-icon'>{'<'}</Text>
            <Text className='back-text'>返回</Text>
          </View>
          <Text className='title'>学习统计</Text>
        </View>
        <View className='error'>
          <Text className='error-text'>获取学习统计失败</Text>
          <Button className='retry-btn' onClick={() => fetchStats()}>重试</Button>
        </View>
      </View>
    );
  }

  return (
    <View className='statistics-container'>
      <View className='header'>
        <View className='back-btn' onClick={() => Taro.navigateBack()}>
          <Text className='back-icon'>{'<'}</Text>
          <Text className='back-text'>返回</Text>
        </View>
        <Text className='title'>学习统计</Text>
        <View className='header-actions'>
          <Button className='refresh-btn' onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? '刷新中' : '刷新'}
          </Button>
        </View>
      </View>

      <ScrollView
        scrollY
        className='stats-scroll-view'
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {/* 概览卡片 */}
        <View className='stats-overview'>
          <View className='overview-card'>
            <Text className='overview-title'>总学习时长</Text>
            <Text className='overview-value'>{formatDuration(stats.totalStudyDuration)}</Text>
          </View>
          <View className='overview-card'>
            <Text className='overview-title'>学习天数</Text>
            <Text className='overview-value'>{stats.studyDays}天</Text>
          </View>
        </View>

        <View className='stats-overview'>
          <View className='overview-card'>
            <Text className='overview-title'>学习次数</Text>
            <Text className='overview-value'>{stats.totalSessions}次</Text>
          </View>
          <View className='overview-card'>
            <Text className='overview-title'>本月时长</Text>
            <Text className='overview-value'>{formatDuration(stats.currentMonthDuration)}</Text>
          </View>
        </View>

        {/* 学习习惯分析 */}
        <View className='stats-card'>
          <Text className='card-title'>学习习惯分析</Text>
          <View className='habit-analysis'>
            <View className='habit-item'>
              <Text className='habit-label'>平均每日学习时长</Text>
              <Text className='habit-value'>{formatDuration(stats.averageDailyDuration)}</Text>
            </View>
            <View className='habit-item'>
              <Text className='habit-label'>最长单日学习</Text>
              <Text className='habit-value'>{formatDuration(stats.maxDailyDuration)}</Text>
            </View>
          </View>
        </View>

        {/* 每日学习时长 */}
        <View className='stats-card'>
          <Text className='card-title'>最近学习记录</Text>
          <View className='daily-stats'>
            {Object.keys(stats.dailyStudyDuration).length === 0 ? (
              <View className='empty-stats'>
                <Text className='empty-icon'>📚</Text>
                <Text className='empty-text'>暂无学习记录</Text>
                <Text className='empty-tip'>完成一次学习后就能看到统计了</Text>
              </View>
            ) : (
              Object.entries(stats.dailyStudyDuration)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .slice(0, 7) // 只显示最近7天
                .map(([date, duration]) => (
                  <View key={date} className='daily-item'>
                    <Text className='daily-date'>{date}</Text>
                    <View className='daily-duration-bar'>
                      <View
                        className='duration-fill'
                        style={{ width: `${Math.min((duration / 480) * 100, 100)}%` }}
                      ></View>
                      <Text className='daily-duration'>{formatDuration(duration)}</Text>
                    </View>
                  </View>
                ))
            )}
          </View>
        </View>

        {/* 自习室使用统计 */}
        {Object.keys(stats.roomUsage).length > 0 && (
          <View className='stats-card'>
            <Text className='card-title'>自习室使用统计</Text>
            <View className='room-stats'>
              {Object.entries(stats.roomUsage)
                .sort(([, a], [, b]) => b - a)
                .map(([roomName, duration]) => (
                  <View key={roomName} className='room-item'>
                    <Text className='room-name'>{roomName}</Text>
                    <View className='room-duration-bar'>
                      <View
                        className='duration-fill'
                        style={{
                          width: `${Math.min((duration / Math.max(...Object.values(stats.roomUsage))) * 100, 100)}%`
                        }}
                      ></View>
                      <Text className='room-duration'>{formatDuration(duration)}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* 月度统计 */}
        {Object.keys(stats.monthlyStats).length > 0 && (
          <View className='stats-card'>
            <Text className='card-title'>月度学习统计</Text>
            <View className='monthly-stats'>
              {Object.entries(stats.monthlyStats)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 6) // 显示最近6个月
                .map(([month, duration]) => (
                  <View key={month} className='monthly-item'>
                    <Text className='monthly-date'>{month}</Text>
                    <Text className='monthly-duration'>{formatDuration(duration)}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Statistics;