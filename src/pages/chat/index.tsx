import React, { useState, useRef, useEffect } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import Avatar from '@/components/Avatar'
import { mockChatMessages, mockMealEvents, currentUser } from '@/data/mockData'
import type { ChatMessage } from '@/types'

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [inputText, setInputText] = useState('')
  const [showSeatModal, setShowSeatModal] = useState(false)
  const [showAAModal, setShowAAModal] = useState(false)
  const [seatNumber, setSeatNumber] = useState('')
  const [aaAmount, setAaAmount] = useState('')
  const scrollRef = useRef<ScrollView>(null)

  const currentEvent = mockMealEvents[0]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToBottom({ animated: true })
    }
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return

    const newMessage: ChatMessage = {
      id: String(Date.now()),
      sender: currentUser,
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }

    setMessages([...messages, newMessage])
    setInputText('')
  }

  const handleMarkArrival = () => {
    const arrivalMessage: ChatMessage = {
      id: String(Date.now()),
      sender: currentUser,
      content: `${currentUser.name} 已到达餐厅`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      type: 'system'
    }
    setMessages([...messages, arrivalMessage])
    Taro.showToast({ title: '已标记到达', icon: 'success' })
  }

  const handleCancelEvent = () => {
    Taro.showModal({
      title: '取消饭局',
      content: '确定要取消这个饭局吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已取消', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        }
      }
    })
  }

  const handleSubmitSeat = () => {
    if (!seatNumber.trim()) {
      Taro.showToast({ title: '请输入座位号', icon: 'none' })
      return
    }

    const seatMessage: ChatMessage = {
      id: String(Date.now()),
      sender: currentUser,
      content: `座位号：${seatNumber}`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }
    setMessages([...messages, seatMessage])
    setShowSeatModal(false)
    setSeatNumber('')
  }

  const handleSubmitAA = () => {
    if (!aaAmount.trim()) {
      Taro.showToast({ title: '请输入AA金额', icon: 'none' })
      return
    }

    const aaMessage: ChatMessage = {
      id: String(Date.now()),
      sender: currentUser,
      content: `AA金额：每人${aaAmount}元`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }
    setMessages([...messages, aaMessage])
    setShowAAModal(false)
    setAaAmount('')
  }

  return (
    <>
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.restaurantInfo}>
            <Image className={styles.restaurantImage} src={currentEvent.restaurant.image} mode="aspectFill" />
            <View>
              <Text className={styles.restaurantName}>{currentEvent.restaurant.name}</Text>
              <Text className={styles.statusBadge}>{currentEvent.status === 'pending' ? '待加入' : '进行中'}</Text>
            </View>
          </View>
        </View>

        <ScrollView className={styles.chatArea} ref={scrollRef} scrollY>
          <View className={styles.messageList}>
            {messages.map(message => (
              <View key={message.id} className={[styles.messageItem, styles[message.type === 'system' ? 'system' : message.sender.id === currentUser.id ? 'self' : 'other']].join(' ')}>
                {message.type !== 'system' && (
                  <Avatar src={message.sender.avatar} size="small" />
                )}
                <View className={styles.messageBubble}>
                  {message.type !== 'system' && message.sender.id !== currentUser.id && (
                    <Text className={styles.messageName}>{message.sender.name}</Text>
                  )}
                  <View className={styles.messageContent}>
                    {message.type === 'system' ? (
                      <Text className={styles.systemMessage}>{message.content}</Text>
                    ) : (
                      <Text>{message.content}</Text>
                    )}
                  </View>
                  <Text className={styles.messageTime}>{message.timestamp}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View className={styles.inputArea}>
          <View className={styles.actionBar}>
            <View className={styles.actionButton} onClick={() => setShowSeatModal(true)}>
              🪑 座位号
            </View>
            <View className={styles.actionButton} onClick={() => setShowAAModal(true)}>
              💰 AA金额
            </View>
            <View className={styles.actionButton} onClick={handleMarkArrival}>
              ✅ 到达
            </View>
            <View className={styles.actionButton} onClick={handleCancelEvent}>
              ❌ 取消
            </View>
          </View>
          <View className={styles.inputRow}>
            <Input
              placeholder="输入消息..."
              value={inputText}
              onChange={e => setInputText(e.detail.value)}
              onConfirm={handleSend}
            />
            <View className={styles.sendButton} onClick={handleSend}>
              发送
            </View>
          </View>
        </View>
      </View>

      {showSeatModal && (
        <View className={styles.modalOverlay} onClick={() => setShowSeatModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>填写座位号</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>当前座位号</Text>
              <Input className={styles.formInput} placeholder="请输入座位号" value={seatNumber} onChange={e => setSeatNumber(e.detail.value)} />
            </View>
            <View className={styles.modalButton} onClick={handleSubmitSeat}>确定</View>
            <View className={styles.cancelButton} onClick={() => setShowSeatModal(false)}>取消</View>
          </View>
        </View>
      )}

      {showAAModal && (
        <View className={styles.modalOverlay} onClick={() => setShowAAModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>AA金额记录</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>每人金额（元）</Text>
              <Input className={styles.formInput} placeholder="请输入金额" value={aaAmount} onChange={e => setAaAmount(e.detail.value)} type="digit" />
            </View>
            <View className={styles.modalButton} onClick={handleSubmitAA}>确定</View>
            <View className={styles.cancelButton} onClick={() => setShowAAModal(false)}>取消</View>
          </View>
        </View>
      )}
    </>
  )
}

export default ChatPage
