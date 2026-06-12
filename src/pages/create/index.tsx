import React, { useState } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import Tag from '@/components/Tag'
import { mockRestaurants, currentUser } from '@/data/mockData'
import type { Restaurant } from '@/types'

const CreatePage: React.FC = () => {
  const [timeWindow, setTimeWindow] = useState<number>(45)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [dishInput, setDishInput] = useState('')
  const [preferredDishes, setPreferredDishes] = useState<string[]>([])
  const [queueAcceptance, setQueueAcceptance] = useState<'low' | 'medium' | 'high'>('medium')
  const [isRushed, setIsRushed] = useState(false)
  const [chatLevel, setChatLevel] = useState<'silent' | 'normal' | 'chatty'>('normal')
  const [showRestaurantModal, setShowRestaurantModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleAddDish = () => {
    if (dishInput.trim() && !preferredDishes.includes(dishInput.trim())) {
      setPreferredDishes([...preferredDishes, dishInput.trim()])
      setDishInput('')
    }
  }

  const handleRemoveDish = (dish: string) => {
    setPreferredDishes(preferredDishes.filter(d => d !== dish))
  }

  const handleSubmit = () => {
    if (!selectedRestaurant || preferredDishes.length === 0) {
      Taro.showToast({
        title: '请选择餐厅和想吃的菜',
        icon: 'none'
      })
      return
    }

    setShowSuccessModal(true)
  }

  const handleCloseSuccess = () => {
    setShowSuccessModal(false)
    Taro.switchTab({
      url: '/pages/today/index'
    })
  }

  return (
    <>
      <ScrollView className={styles.page} scrollY>
        <View className={styles.header}>
          <Text className={styles.title}>发起拼饭</Text>
          <Text className={styles.subtitle}>设置你的午餐偏好，找到合适的饭友</Text>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>午餐时间</Text>
          <View className={styles.timeOptions}>
            {[30, 45, 60].map(time => (
              <View
                key={time}
                className={[styles.timeOption, timeWindow === time && styles.active].join(' ')}
                onClick={() => setTimeWindow(time)}
              >
                <Text className={styles.timeValue}>{time}</Text>
                <Text className={styles.timeLabel}>分钟</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>选择餐厅</Text>
          <View className={styles.restaurantSelector} onClick={() => setShowRestaurantModal(true)}>
            {selectedRestaurant ? (
              <>
                <Image className={styles.restaurantImage} src={selectedRestaurant.image} mode="aspectFill" />
                <Text className={styles.restaurantName}>{selectedRestaurant.name}</Text>
              </>
            ) : (
              <Text className={styles.restaurantName}>点击选择餐厅</Text>
            )}
            <Text className={styles.arrowIcon}>›</Text>
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>想吃的菜</Text>
          <Input
            className={styles.dishInput}
            placeholder="输入菜品名称后按回车"
            value={dishInput}
            onChange={e => setDishInput(e.detail.value)}
            onConfirm={handleAddDish}
          />
          {preferredDishes.length > 0 && (
            <View className={styles.preferredDishes}>
              {preferredDishes.map((dish, index) => (
                <View key={index} className={styles.dishTag}>
                  {dish}
                  <Text className={styles.removeIcon} onClick={() => handleRemoveDish(dish)}>×</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>排队接受度</Text>
          <View className={styles.optionGrid}>
            <View
              className={[styles.optionItem, queueAcceptance === 'low' && styles.active].join(' ')}
              onClick={() => setQueueAcceptance('low')}
            >
              不愿排队
            </View>
            <View
              className={[styles.optionItem, queueAcceptance === 'medium' && styles.active].join(' ')}
              onClick={() => setQueueAcceptance('medium')}
            >
              可接受排队
            </View>
            <View
              className={[styles.optionItem, queueAcceptance === 'high' && styles.active].join(' ')}
              onClick={() => setQueueAcceptance('high')}
            >
              愿意排队
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.toggleRow}>
            <Text className={styles.toggleLabel}>赶时间</Text>
            <View className={[styles.toggleSwitch, isRushed && styles.active].join(' ')} onClick={() => setIsRushed(!isRushed)}>
              <View className={styles.toggleThumb} />
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>聊天程度</Text>
          <View className={styles.optionGrid}>
            <View
              className={[styles.optionItem, chatLevel === 'silent' && styles.active].join(' ')}
              onClick={() => setChatLevel('silent')}
            >
              安静
            </View>
            <View
              className={[styles.optionItem, chatLevel === 'normal' && styles.active].join(' ')}
              onClick={() => setChatLevel('normal')}
            >
              正常
            </View>
            <View
              className={[styles.optionItem, chatLevel === 'chatty' && styles.active].join(' ')}
              onClick={() => setChatLevel('chatty')}
            >
              健谈
            </View>
          </View>
        </View>

        <View className={[styles.submitButton, (!selectedRestaurant || preferredDishes.length === 0) && styles.disabled].join(' ')} onClick={handleSubmit}>
          发起拼饭
        </View>
      </ScrollView>

      {showRestaurantModal && (
        <View className={styles.modalOverlay} onClick={() => setShowRestaurantModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>选择餐厅</Text>
            <ScrollView className={styles.restaurantList} scrollY>
              {mockRestaurants.map(restaurant => (
                <View key={restaurant.id} className={styles.restaurantItem} onClick={() => {
                  setSelectedRestaurant(restaurant)
                  setShowRestaurantModal(false)
                }}>
                  <Image className={styles.restaurantItemImage} src={restaurant.image} mode="aspectFill" />
                  <View className={styles.restaurantItemInfo}>
                    <Text className={styles.restaurantItemName}>{restaurant.name}</Text>
                    <View className={styles.restaurantItemTags}>
                      {restaurant.tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {showSuccessModal && (
        <View className={styles.modalOverlay} onClick={handleCloseSuccess}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.successModal}>
              <Text className={styles.successIcon}>🎉</Text>
              <Text className={styles.successText}>拼饭发起成功！</Text>
              <Text className={styles.successSubtitle}>等待其他饭友加入中...</Text>
            </View>
            <View className={styles.submitButton} onClick={handleCloseSuccess}>
              返回首页
            </View>
          </View>
        </View>
      )}
    </>
  )
}

export default CreatePage
