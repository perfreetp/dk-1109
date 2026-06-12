import React, { useState } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import Tag from '@/components/Tag'
import { mockTopicCards, currentUser } from '@/data/mockData'
import { useAppStore } from '@/store/appStore'
import type { User } from '@/types'

const CreditPage: React.FC = () => {
  const [allergies, setAllergies] = useState(['海鲜', '花生'])
  const [showAllergyModal, setShowAllergyModal] = useState(false)
  const [newAllergy, setNewAllergy] = useState('')
  const [activeTab, setActiveTab] = useState<'credits' | 'friends' | 'blocked'>('credits')

  const favoriteFriends = useAppStore((state) => state.favoriteFriends)
  const blockedUsers = useAppStore((state) => state.blockedUsers)
  const creditRecords = useAppStore((state) => state.creditRecords)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const toggleBlock = useAppStore((state) => state.toggleBlock)

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) {
      Taro.showToast({ title: '请输入过敏食物', icon: 'none' })
      return
    }
    setAllergies([...allergies, newAllergy.trim()])
    setNewAllergy('')
    setShowAllergyModal(false)
    Taro.showToast({ title: '添加成功', icon: 'success' })
  }

  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(allergies.filter(a => a !== allergy))
  }

  const handleToggleFriend = (user: User, action: 'favorite' | 'block') => {
    if (action === 'favorite') {
      toggleFavorite(user)
    } else {
      toggleBlock(user)
    }
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.userCard}>
        <View className={styles.userInfo}>
          <Image className={styles.avatar} src={currentUser.avatar} mode="aspectFill" />
          <View className={styles.userDetails}>
            <Text className={styles.userName}>{currentUser.name}</Text>
            <View className={styles.userTags}>
              {currentUser.tags.map((tag, index) => (
                <Text key={index} className={styles.userTag}>{tag}</Text>
              ))}
            </View>
          </View>
        </View>
        <View className={styles.creditSection}>
          <View className={styles.creditItem}>
            <Text className={styles.creditValue}>{currentUser.creditScore}</Text>
            <Text className={styles.creditLabel}>信用评分</Text>
          </View>
          <View className={styles.creditItem}>
            <Text className={styles.creditValue}>{creditRecords.length}</Text>
            <Text className={styles.creditLabel}>评价记录</Text>
          </View>
          <View className={styles.creditItem}>
            <Text className={styles.creditValue}>{favoriteFriends.length}</Text>
            <Text className={styles.creditLabel}>常用饭友</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>🍽️ 午餐话题</Text>
        {mockTopicCards.map(topic => (
          <View key={topic.id} className={styles.topicCard}>
            <Image className={styles.topicImage} src={topic.image} mode="aspectFill" />
            <View className={styles.topicContent}>
              <Text className={styles.topicTitle}>{topic.title}</Text>
              <Text className={styles.topicDesc}>{topic.content}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>🏆 信用记录</Text>
        <View className={styles.recordList}>
          {creditRecords.map(record => (
            <View key={record.id} className={styles.recordItem}>
              <View className={[styles.recordIcon, styles[record.type]].join(' ')}>
                {record.type === 'positive' ? '+' : '-'}
              </View>
              <View className={styles.recordContent}>
                <Text className={styles.recordDesc}>{record.description}</Text>
                <Text className={styles.recordTime}>{record.timestamp}</Text>
              </View>
              <Text className={[styles.recordPoints, styles[record.type]].join(' ')}>
                {record.points > 0 ? '+' : ''}{record.points}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>🥵 过敏提醒</Text>
        <View className={styles.allergyList}>
          {allergies.map((allergy, index) => (
            <View key={index} className={styles.allergyTag}>
              {allergy}
              <Text style={{ marginLeft: 8 }} onClick={() => handleRemoveAllergy(allergy)}>×</Text>
            </View>
          ))}
          <View className={styles.addAllergy} onClick={() => setShowAllergyModal(true)}>
            + 添加
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View style={{ display: 'flex', gap: 16 }}>
          <View
            className={[styles.sectionTitle, activeTab === 'credits' && { color: '#FF6B6B' }].filter(Boolean).join(' ')}
            onClick={() => setActiveTab('credits')}
          >
            常用饭友 ({favoriteFriends.length})
          </View>
          <View
            className={[styles.sectionTitle, activeTab === 'blocked' && { color: '#FF6B6B' }].filter(Boolean).join(' ')}
            onClick={() => setActiveTab('blocked')}
          >
            不再匹配 ({blockedUsers.length})
          </View>
        </View>
        
        {activeTab === 'credits' && (
          <View className={styles.friendList}>
            {favoriteFriends.length > 0 ? (
              favoriteFriends.map(friend => (
                <View key={friend.id} className={styles.friendItem}>
                  <Image className={styles.friendAvatar} src={friend.avatar} mode="aspectFill" />
                  <View className={styles.friendInfo}>
                    <Text className={styles.friendName}>{friend.name}</Text>
                    <Text className={styles.friendScore}>信用分: {friend.creditScore}</Text>
                  </View>
                  <View className={styles.friendAction} onClick={() => handleToggleFriend(friend, 'favorite')}>
                    取消收藏
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: '#9CA3AF', textAlign: 'center', padding: 24 }}>暂无常用饭友</Text>
            )}
          </View>
        )}

        {activeTab === 'blocked' && (
          <View className={styles.friendList}>
            {blockedUsers.length > 0 ? (
              blockedUsers.map(user => (
                <View key={user.id} className={styles.friendItem}>
                  <Image className={styles.friendAvatar} src={user.avatar} mode="aspectFill" />
                  <View className={styles.friendInfo}>
                    <Text className={styles.friendName}>{user.name}</Text>
                    <Text className={styles.friendScore}>信用分: {user.creditScore}</Text>
                  </View>
                  <View className={[styles.friendAction, styles.active].join(' ')} onClick={() => handleToggleFriend(user, 'block')}>
                    解除屏蔽
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: '#9CA3AF', textAlign: 'center', padding: 24 }}>暂无屏蔽用户</Text>
            )}
          </View>
        )}
      </View>

      {showAllergyModal && (
        <View className={styles.modalOverlay} onClick={() => setShowAllergyModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加过敏食物</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>过敏食物名称</Text>
              <Input className={styles.formInput} placeholder="例如：海鲜、花生" value={newAllergy} onChange={e => setNewAllergy(e.detail.value)} />
            </View>
            <View className={styles.modalButton} onClick={handleAddAllergy}>确定</View>
            <View className={styles.cancelButton} onClick={() => setShowAllergyModal(false)}>取消</View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default CreditPage
