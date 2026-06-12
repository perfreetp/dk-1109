import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import Avatar from '@/components/Avatar'
import Tag from '@/components/Tag'
import { useAppStore } from '@/store/appStore'
import { mockUsers, currentUser } from '@/data/mockData'
import type { MealEvent, User } from '@/types'

const TodayPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'ongoing'>('all')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<MealEvent | null>(null)
  const [feedbackForm, setFeedbackForm] = useState({
    punctuality: 3,
    chatComfort: 3,
    aaCompleted: true,
    restaurantRating: 3,
    comment: ''
  })

  const mealEvents = useAppStore((state) => state.mealEvents)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const toggleBlock = useAppStore((state) => state.toggleBlock)
  const favoriteFriends = useAppStore((state) => state.favoriteFriends)
  const blockedUsers = useAppStore((state) => state.blockedUsers)
  const addCreditRecord = useAppStore((state) => state.addCreditRecord)

  const filteredEvents = mealEvents.filter(event => {
    if (activeTab === 'all') return true
    return event.status === activeTab
  })

  const recommendedFriends = mockUsers.filter(u => 
    u.id !== currentUser.id && !blockedUsers.some(b => b.id === u.id)
  ).map(user => ({
    ...user,
    distance: ['200米', '350米', '500米', '800米', '1公里', '1.2公里'][Math.floor(Math.random() * 6)],
    meetCount: Math.floor(Math.random() * 10) + 1,
    preference: ['川菜', '粤菜', '日料', '面食', '轻食'][Math.floor(Math.random() * 5)]
  }))

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

  const handleOpenFeedback = (event: MealEvent) => {
    setSelectedEvent(event)
    setShowFeedbackModal(true)
  }

  const handleSubmitFeedback = () => {
    if (!selectedEvent) return

    let totalPoints = 0
    const descriptions: string[] = []

    if (feedbackForm.punctuality >= 4) {
      totalPoints += 3
      descriptions.push('评价准时')
    }
    if (feedbackForm.chatComfort >= 4) {
      totalPoints += 2
      descriptions.push('聊天愉快')
    }
    if (feedbackForm.aaCompleted) {
      totalPoints += 3
      descriptions.push('AA完成')
    }
    if (feedbackForm.restaurantRating >= 4) {
      totalPoints += 2
      descriptions.push('餐厅好评')
    }

    addCreditRecord({
      id: String(Date.now()),
      type: totalPoints > 0 ? 'positive' : 'negative',
      description: descriptions.join('、') || '完成评价',
      points: totalPoints,
      timestamp: new Date().toLocaleDateString('zh-CN')
    })

    Taro.showToast({ title: '评价成功', icon: 'success' })
    setShowFeedbackModal(false)
    setSelectedEvent(null)
    setFeedbackForm({
      punctuality: 3,
      chatComfort: 3,
      aaCompleted: true,
      restaurantRating: 3,
      comment: ''
    })
  }

  const handleToggleFriend = (user: User, action: 'favorite' | 'block') => {
    if (action === 'favorite') {
      toggleFavorite(user)
    } else {
      toggleBlock(user)
    }
  }

  return (
    <>
      <ScrollView className={styles.page} scrollY>
        <View className={styles.header}>
          <Text className={styles.title}>今日饭局</Text>
          <Text className={styles.subtitle}>今天有 {mealEvents.filter(e => e.status === 'pending').length} 个饭局等你来加入</Text>
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
                {event.status === 'finished' && (
                  <View className={styles.joinButton} onClick={() => handleOpenFeedback(event)}>
                    评价反馈
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

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>👥 附近饭友推荐</Text>
          <View className={styles.friendList}>
            {recommendedFriends.slice(0, 4).map(friend => (
              <View key={friend.id} className={styles.friendItem}>
                <Avatar src={friend.avatar} size="medium" />
                <View className={styles.friendInfo}>
                  <Text className={styles.friendName}>{friend.name}</Text>
                  <View style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <Text className={styles.friendDetail}>📍 {friend.distance}</Text>
                    <Text className={styles.friendDetail}>⭐ {friend.creditScore}</Text>
                    <Text className={styles.friendDetail}>🍜 {friend.preference}</Text>
                  </View>
                  <Text className={styles.friendDetail}>常约次数: {friend.meetCount}次</Text>
                </View>
                <View className={styles.friendActions}>
                  <View 
                    className={[styles.friendAction, favoriteFriends.some(f => f.id === friend.id) && styles.active].join(' ')}
                    onClick={() => handleToggleFriend(friend, 'favorite')}
                  >
                    {favoriteFriends.some(f => f.id === friend.id) ? '已收藏' : '收藏'}
                  </View>
                  <View 
                    className={[styles.friendAction, styles.block].join(' ')}
                    onClick={() => handleToggleFriend(friend, 'block')}
                  >
                    屏蔽
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {showFeedbackModal && selectedEvent && (
        <View className={styles.modalOverlay} onClick={() => setShowFeedbackModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>饭后反馈</Text>
            
            <View className={styles.formSection}>
              <Text className={styles.formLabel}>准时程度</Text>
              <View className={styles.starRating}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Text 
                    key={star} 
                    className={[styles.star, feedbackForm.punctuality >= star && styles.active].join(' ')}
                    onClick={() => setFeedbackForm({...feedbackForm, punctuality: star})}
                  >★</Text>
                ))}
              </View>
            </View>

            <View className={styles.formSection}>
              <Text className={styles.formLabel}>聊天舒适度</Text>
              <View className={styles.starRating}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Text 
                    key={star} 
                    className={[styles.star, feedbackForm.chatComfort >= star && styles.active].join(' ')}
                    onClick={() => setFeedbackForm({...feedbackForm, chatComfort: star})}
                  >★</Text>
                ))}
              </View>
            </View>

            <View className={styles.formSection}>
              <Text className={styles.formLabel}>餐厅体验</Text>
              <View className={styles.starRating}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Text 
                    key={star} 
                    className={[styles.star, feedbackForm.restaurantRating >= star && styles.active].join(' ')}
                    onClick={() => setFeedbackForm({...feedbackForm, restaurantRating: star})}
                  >★</Text>
                ))}
              </View>
            </View>

            <View className={styles.formSection}>
              <View className={styles.toggleRow}>
                <Text className={styles.toggleLabel}>AA已完成</Text>
                <View className={[styles.toggleSwitch, feedbackForm.aaCompleted && styles.active].join(' ')} onClick={() => setFeedbackForm({...feedbackForm, aaCompleted: !feedbackForm.aaCompleted})}>
                  <View className={styles.toggleThumb} />
                </View>
              </View>
            </View>

            <View className={styles.modalButton} onClick={handleSubmitFeedback}>提交反馈</View>
            <View className={styles.cancelButton} onClick={() => setShowFeedbackModal(false)}>取消</View>
          </View>
        </View>
      )}
    </>
  )
}

export default TodayPage
