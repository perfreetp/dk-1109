import type { User, Restaurant, MealEvent, ChatMessage, CreditRecord, TopicCard } from '@/types'

export const mockUsers: User[] = [
  { id: '1', name: '美食达人', avatar: 'https://picsum.photos/id/64/200/200', creditScore: 95, tags: ['美食家', '话痨'] },
  { id: '2', name: '午餐小王子', avatar: 'https://picsum.photos/id/91/200/200', creditScore: 88, tags: ['效率控', '安静'] },
  { id: '3', name: '吃货小美', avatar: 'https://picsum.photos/id/177/200/200', creditScore: 92, tags: ['甜品控', '健谈'] },
  { id: '4', name: '程序员阿杰', avatar: 'https://picsum.photos/id/338/200/200', creditScore: 85, tags: ['技术宅', '沉默'] },
  { id: '5', name: '健身达人', avatar: 'https://picsum.photos/id/1027/200/200', creditScore: 98, tags: ['健康饮食', '开朗'] },
  { id: '6', name: '自由职业者', avatar: 'https://picsum.photos/id/64/200/200', creditScore: 80, tags: ['时间灵活', '随和'] }
]

export const mockRestaurants: Restaurant[] = [
  { id: '1', name: '川味小厨', image: 'https://picsum.photos/id/292/300/300', rating: 4.8, price: '人均60', distance: '500米', tags: ['川菜', '辣'], address: '科技园A座负一层', waitTime: '约15分钟' },
  { id: '2', name: '粤港茶餐厅', image: 'https://picsum.photos/id/312/300/300', rating: 4.6, price: '人均55', distance: '800米', tags: ['粤菜', '早茶'], address: '创新大厦1层', waitTime: '约25分钟' },
  { id: '3', name: '日式拉面馆', image: 'https://picsum.photos/id/326/300/300', rating: 4.7, price: '人均45', distance: '300米', tags: ['日式', '拉面'], address: '软件园B区', waitTime: '约10分钟' },
  { id: '4', name: '西北牛肉面', image: 'https://picsum.photos/id/401/300/300', rating: 4.5, price: '人均35', distance: '200米', tags: ['清真', '面食'], address: '创业大街12号', waitTime: '约8分钟' },
  { id: '5', name: '轻食沙拉', image: 'https://picsum.photos/id/431/300/300', rating: 4.9, price: '人均40', distance: '600米', tags: ['健康', '减脂'], address: '绿地中心B座', waitTime: '约5分钟' },
  { id: '6', name: '湘菜馆', image: 'https://picsum.photos/id/570/300/300', rating: 4.4, price: '人均50', distance: '1公里', tags: ['湘菜', '辣'], address: '科技园二期', waitTime: '约30分钟' }
]

export const mockMealEvents: MealEvent[] = [
  {
    id: '1',
    restaurant: mockRestaurants[0],
    timeWindow: 45,
    maxPeople: 4,
    currentPeople: 3,
    status: 'pending',
    creator: mockUsers[0],
    participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
    dishes: ['水煮鱼', '宫保鸡丁', '麻婆豆腐'],
    queueAcceptance: 'medium',
    isRushed: false,
    chatLevel: 'chatty',
    createdAt: '2024-01-15 10:30',
    meetingTime: '12:15'
  },
  {
    id: '2',
    restaurant: mockRestaurants[2],
    timeWindow: 30,
    maxPeople: 2,
    currentPeople: 2,
    status: 'ongoing',
    creator: mockUsers[3],
    participants: [mockUsers[3], mockUsers[4]],
    dishes: ['豚骨拉面', '煎饺'],
    queueAcceptance: 'low',
    isRushed: true,
    chatLevel: 'silent',
    createdAt: '2024-01-15 11:00',
    meetingTime: '12:00',
    seatNumber: 'A12'
  },
  {
    id: '3',
    restaurant: mockRestaurants[4],
    timeWindow: 60,
    maxPeople: 6,
    currentPeople: 4,
    status: 'pending',
    creator: mockUsers[4],
    participants: [mockUsers[4], mockUsers[0], mockUsers[2], mockUsers[5]],
    dishes: ['凯撒沙拉', '鸡胸肉套餐', '牛油果三明治'],
    queueAcceptance: 'high',
    isRushed: false,
    chatLevel: 'normal',
    createdAt: '2024-01-15 10:00',
    meetingTime: '12:30'
  }
]

export const mockChatMessages: ChatMessage[] = [
  { id: '1', sender: mockUsers[0], content: '大家好，今天中午一起去川味小厨吧！', timestamp: '10:30', type: 'text' },
  { id: '2', sender: mockUsers[1], content: '好的，我没问题', timestamp: '10:32', type: 'text' },
  { id: '3', sender: mockUsers[2], content: '太棒了，我想吃水煮鱼', timestamp: '10:35', type: 'text' },
  { id: '4', sender: mockUsers[0], content: '那我们12:15在餐厅门口集合', timestamp: '10:38', type: 'text' },
  { id: '5', sender: mockUsers[3], content: '系统提示：已到达餐厅', timestamp: '12:10', type: 'system' },
  { id: '6', sender: mockUsers[0], content: '我已经到了，在A区等你们', timestamp: '12:15', type: 'text' }
]

export const mockCreditRecords: CreditRecord[] = [
  { id: '1', type: 'positive', description: '按时到达餐厅', points: +5, timestamp: '2024-01-14' },
  { id: '2', type: 'positive', description: '主动AA付款', points: +3, timestamp: '2024-01-13' },
  { id: '3', type: 'negative', description: '迟到10分钟', points: -5, timestamp: '2024-01-12' },
  { id: '4', type: 'positive', description: '帮助他人占位', points: +5, timestamp: '2024-01-11' },
  { id: '5', type: 'positive', description: '完成饭后评价', points: +2, timestamp: '2024-01-10' }
]

export const mockTopicCards: TopicCard[] = [
  { id: '1', title: '今日话题', content: '你最喜欢的午餐搭配是什么？', image: 'https://picsum.photos/id/580/750/500' },
  { id: '2', title: '美食分享', content: '最近发现一家超好吃的日料店，推荐给大家！', image: 'https://picsum.photos/id/625/750/500' },
  { id: '3', title: '健康饮食', content: '上班族如何保持健康的午餐习惯？', image: 'https://picsum.photos/id/835/750/500' }
]

export const currentUser: User = {
  id: '0',
  name: '我',
  avatar: 'https://picsum.photos/id/1027/200/200',
  creditScore: 90,
  tags: ['美食爱好者', '准时达人']
}
