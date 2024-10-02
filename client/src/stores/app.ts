// Utilities
import { User } from '@/composables/types'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: useStorage<User>('user', {} as User),
  }),
  getters: {
    isLoggedIn: state => !!(state.user?.id),
    userName: state => (state.user?.name),
    userEmail: state => (state.user?.email),
  },
})
