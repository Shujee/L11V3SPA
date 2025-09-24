/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/composables/types'
import { PagedResponse, ResourceResponse, } from '@/composables/types'
import useRequestHandler from '@/composables/useRequestHandler'

// import { LocationQueryValueRaw } from 'vue-router'

let get: <T>(url: string, query?: any) => Promise<T | null>
let post: <T>(url: string, data?: any, headers?: any, query?: any) => Promise<T | null>
let put: <T>(url: string, data?: any, headers?: any, query?: any) => Promise<T | null>
let del: <T>(url: string) => Promise<T | null>

export function useApi() {
  let loading
  
  const init = (showSnackMessage: (text: string, color: string) => void, hideSnackMessage: () => void) => {
    ({ get, post, put, del, loading } = useRequestHandler(showSnackMessage, hideSnackMessage))
  }

  const check = async (): Promise<string | null> => {
    return await get<string>(`health`)
  }

  const authAPI = {
    register: async (email: string, name: string, password: string): Promise<User | null> => {
      const res = await post<User>('auth/signup', { email, password, name })

       if (res) {
         return res
      } else {
        return null
      }
    },

    login: async (email: string, password: string): Promise<User | null> => {
      const res = await post<User>('login', {
        email,
        password,
      })

      if (res) {
        return res
      } else {
        return null
      }
    },

    logout: async (): Promise<void | null> => {
      return post('auth/signout')
    },

    // Updates password for authenticated user. User must provide current and new passwords.
    updatePassword: async (curPass: string, newPass: string, confirmPass: string): Promise<string | null> => {
      return put('user/password', { current_password: curPass, password: newPass, password_confirmation: confirmPass })
    },
  }

  const usersAPI = {
    list: async () => {
      return await get<ResourceResponse<User[]>>('user')
    },

    paged_list: async (page: number, perPage: number) => {
        const query = `user?page=${page}&perPage=${perPage}`
        return await get<PagedResponse<User>>(query)
    },

    add: async (user: User) => {
      //todo: This route does not exist in the current API. Check for alternate.
      return post<ResourceResponse<User>>('user', user)
    },

    remove: async (id: number) => {
      return await del<boolean>(`/user/${id}`)
    },

    edit: async (user: User) => {
      return await put<boolean>(`user/editTag/${user.id}`, user)
    }
  }

  return {
    init,
    check,
    authAPI,
    usersAPI,
    loading,
  }
}
