import React, { useState } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import Tag from '@/components/Tag'
import { mockRestaurants } from '@/data/mockData'
import type { Restaurant } from '@/types'

const RestaurantsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  const filters = ['all', '川菜', '粤菜', '日式', '清真', '健康']

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchSearch = restaurant.name.toLowerCase().includes(searchText.toLowerCase())
    const matchFilter = activeFilter === 'all' || restaurant.tags.includes(activeFilter)
    return matchSearch && matchFilter
  })

  const handleViewDetail = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
  }

  const handleCreateMeal = (restaurant: Restaurant) => {
    Taro.switchTab({
      url: `/pages/create/index?restaurantId=${restaurant.id}`
    })
  }

  return (
    <>
      <ScrollView className={styles.page} scrollY>
        <View className={styles.header}>
          <Text className={styles.title}>附近餐厅</Text>
          <View className={styles.searchBar}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              className={styles.searchInput}
              placeholder="搜索餐厅"
              value={searchText}
              onChange={e => setSearchText(e.detail.value)}
            />
          </View>
          <ScrollView className={styles.filterBar} scrollX>
            {filters.map(filter => (
              <View
                key={filter}
                className={[styles.filterTag, activeFilter === filter && styles.active].join(' ')}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all' ? '全部' : filter}
              </View>
            ))}
          </ScrollView>
        </View>

        {filteredRestaurants.map(restaurant => (
          <View key={restaurant.id} className={styles.restaurantCard}>
            <Image className={styles.restaurantImage} src={restaurant.image} mode="aspectFill" />
            <View className={styles.restaurantInfo}>
              <View>
                <Text className={styles.restaurantName}>{restaurant.name}</Text>
                <View className={styles.ratingRow}>
                  <Text className={styles.starIcon}>⭐</Text>
                  <Text className={styles.rating}>{restaurant.rating}</Text>
                  <Text className={styles.price}>{restaurant.price}</Text>
                </View>
                <View className={styles.tags}>
                  {restaurant.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </View>
              </View>
              <View className={styles.distanceRow}>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className={styles.distance}>{restaurant.distance}</Text>
                  {restaurant.waitTime && <Text className={styles.waitTime}>{restaurant.waitTime}</Text>}
                </View>
                <View className={styles.detailButton} onClick={() => handleViewDetail(restaurant)}>
                  查看
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedRestaurant && (
        <View className={styles.modalOverlay} onClick={() => setSelectedRestaurant(null)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.closeButton} onClick={() => setSelectedRestaurant(null)}>×</View>
            <View className={styles.modalHeader}>
              <Image className={styles.modalImage} src={selectedRestaurant.image} mode="aspectFill" />
              <View>
                <Text className={styles.modalTitle}>{selectedRestaurant.name}</Text>
                <View className={styles.modalRating}>
                  <Text className={styles.starIcon}>⭐</Text>
                  <Text className={styles.rating}>{selectedRestaurant.rating}</Text>
                  <Text className={styles.price}>{selectedRestaurant.price}</Text>
                </View>
                <Text className={styles.modalAddress}>{selectedRestaurant.address}</Text>
              </View>
            </View>

            <View className={styles.modalSection}>
              <Text className={styles.sectionTitle}>餐厅标签</Text>
              <View className={styles.modalTags}>
                {selectedRestaurant.tags.map((tag, index) => (
                  <Tag key={index} type="primary" size="medium">{tag}</Tag>
                ))}
              </View>
            </View>

            <View className={styles.modalSection}>
              <Text className={styles.sectionTitle}>预计等位时间</Text>
              <Text className={styles.waitTime}>{selectedRestaurant.waitTime || '暂无数据'}</Text>
            </View>

            <View className={styles.modalButton} onClick={() => handleCreateMeal(selectedRestaurant)}>
              发起拼饭
            </View>
          </View>
        </View>
      )}
    </>
  )
}

export default RestaurantsPage
