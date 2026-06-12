export interface User {
  id: string
  name: string
  avatar: string
  creditScore: number
  tags: string[]
  isFavorite?: boolean
}

export interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  price: string
  distance: string
  tags: string[]
  address: string
  waitTime?: string
}

export interface MealEvent {
  id: string
  restaurant: Restaurant
  timeWindow: number
  maxPeople: number
  currentPeople: number
  status: 'pending' | 'ongoing' | 'finished'
  creator: User
  participants: User[]
  dishes: string[]
  queueAcceptance: 'low' | 'medium' | 'high'
  isRushed: boolean
  chatLevel: 'silent' | 'normal' | 'chatty'
  createdAt: string
  meetingTime?: string
  seatNumber?: string
  aaAmount?: number
}

export interface ChatMessage {
  id: string
  sender: User
  content: string
  timestamp: string
  type: 'text' | 'system'
}

export interface FoodAllergy {
  id: string
  name: string
  severity: 'mild' | 'severe'
}

export interface CreditRecord {
  id: string
  type: 'positive' | 'negative'
  description: string
  points: number
  timestamp: string
}

export interface TopicCard {
  id: string
  title: string
  content: string
  image?: string
}
