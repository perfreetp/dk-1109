import { create } from 'zustand'
import type { MealEvent, User, CreditRecord } from '@/types'
import { mockMealEvents, mockUsers, mockCreditRecords, currentUser } from '@/data/mockData'

interface AppState {
  mealEvents: MealEvent[]
  favoriteFriends: User[]
  blockedUsers: User[]
  creditRecords: CreditRecord[]
  addMealEvent: (event: MealEvent) => void
  toggleFavorite: (user: User) => void
  toggleBlock: (user: User) => void
  addCreditRecord: (record: CreditRecord) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  mealEvents: [...mockMealEvents],
  favoriteFriends: mockUsers.slice(0, 3),
  blockedUsers: [],
  creditRecords: [...mockCreditRecords],

  addMealEvent: (event) => {
    set((state) => ({
      mealEvents: [event, ...state.mealEvents]
    }))
  },

  toggleFavorite: (user) => {
    set((state) => {
      const isFavorite = state.favoriteFriends.some(f => f.id === user.id)
      if (isFavorite) {
        return {
          favoriteFriends: state.favoriteFriends.filter(f => f.id !== user.id)
        }
      } else {
        return {
          favoriteFriends: [...state.favoriteFriends, user]
        }
      }
    })
  },

  toggleBlock: (user) => {
    set((state) => {
      const isBlocked = state.blockedUsers.some(b => b.id === user.id)
      if (isBlocked) {
        return {
          blockedUsers: state.blockedUsers.filter(b => b.id !== user.id)
        }
      } else {
        return {
          blockedUsers: [...state.blockedUsers, user],
          favoriteFriends: state.favoriteFriends.filter(f => f.id !== user.id)
        }
      }
    })
  },

  addCreditRecord: (record) => {
    set((state) => ({
      creditRecords: [record, ...state.creditRecords]
    }))
  }
}))
