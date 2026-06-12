import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import Avatar from '@/components/Avatar'
import Tag from '@/components/Tag'
import { mockMealEvents, currentUser } from '@/data/mockData'
import type { MealEvent } from '@/types'

const TodayPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'ongoing'>('all')

  const filteredEvents = mockMealEvents.filter(event => {
    if (activeTab === 'all') return true
    return event.status === activeTab
  })

  const handleJoinMeal = (event: MealEvent) => {
    Taro.navigateTo({
      url: `/pages/chat/index?eventId=${event.id}`
    })
  }

  const handleCreateMeal = () => {
    Taro.switchTab({
      url: '/pages/create/index'
    })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>今日饭局</Text>
        <Text className={styles.subtitle}>今天有 {mockMealEvents.filter(e => e.status === 'pending').length} 个饭局等你来加入</Text>
      </View>

      <View className={styles.statusTabs}>
        <View
          className={[styles.tabItem, activeTab === 'all' && styles.active].join(' ')}
          onClick={() => setActiveTab('all')}
        >
          全部
        </View>
        <View
          className={[styles.tabItem, activeTab === 'pending' && styles.active].join(' ')}
          onClick={() => setActiveTab('pending')}
        >
          待加入
        </View>
        <View
          className={[styles.tabItem, activeTab === 'ongoing' && styles.active].join(' ')}
          onClick={() => setActiveTab('ongoing')}
        >
          进行中
        </View>
      </View>

      {filteredEvents.length > 0 ? (
        filteredEvents.map(event => (
          <View key={event.id} className={styles.mealCard}>
            <View className={styles.restaurantInfo}>
              <Image className={styles.restaurantImage} src={event.restaurant.image} mode="aspectFill" />
              <View className={styles.restaurantDetails}>
                <Text className={styles.restaurantName}>{event.restaurant.name}</Text>
                <View className={styles.restaurantTags}>
                  {event.restaurant.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </View>
                <View className={styles.timeInfo}>
                  <Text className={styles.timeIcon}>🕐</Text>
                  <Text>{event.meetingTime} | {event.timeWindow}分钟</Text>
                </View>
              </View>
              <View className={[styles.statusBadge, styles[event.status]].join(' ')}>
                {event.status === 'pending' ? '待加入' : event.status === 'ongoing' ? '进行中' : '已完成'}
              </View>
            </View>

            <View className={styles.participants}>
              <View className={styles.avatarGroup}>
                {event.participants.slice(0, 4).map((user, index) => (
                  <Avatar
                    key={user.id}
                    src={user.avatar}
                    size="small"
                    className={styles.avatarItem}
                    hasBorder={user.id === currentUser.id}
                  />
                ))}
              </View>
              <Text className={styles.participantCount}>
                {event.currentPeople}/{event.maxPeople} 人
              </Text>
            </View>

            <View className={styles.mealTags}>
              <Tag type="info">{event.queueAcceptance === 'low' ? '不愿排队' : event.queueAcceptance === 'medium' ? '可接受排队' : '愿意排队'}</Tag>
              <Tag type={event.isRushed ? 'warning' : 'success'}>{event.isRushed ? '赶时间' : '不赶时间'}</Tag>
              <Tag type="primary">{event.chatLevel === 'silent' ? '安静' : event.chatLevel === 'normal' ? '正常' : '健谈'}</Tag>
            </View>

            <View className={styles.cardFooter}>
              <Text className={styles.subtitle}>想吃: {event.dishes.join('、')}</Text>
              {event.status === 'pending' && (
                <View className={styles.joinButton} onClick={() => handleJoinMeal(event)}>
                  加入饭局
                </View>
              )}
              {event.status === 'ongoing' && (
                <View className={styles.joinButton} onClick={() => handleJoinMeal(event)}>
                  进入聊天
                </View>
              )}
            </View>
          </View>
        ))
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🍽️</Text>
          <Text className={styles.emptyText}>暂无饭局</Text>
          <View className={styles.emptyButton} onClick={handleCreateMeal}>
            发起拼饭
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default TodayPage
