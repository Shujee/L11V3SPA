/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosErrorEx } from '@/composables/types'
import { AxiosError, AxiosRequestConfig, AxiosResponse, HttpStatusCode } from 'axios'
import useLaravelAxios from './useLaravelAxios'

const loading = ref<boolean>(false)

const ax = useLaravelAxios()

const token = localStorage.getItem('access_token')
if (token)
  ax.defaults.headers.common.Authorization = `Bearer ${token}`;

export default function (showSnackMessage: (text: string, color: string) => void, hideSnackMessage: () => void) {
  return {
    loading,

    setBearerToken: (token: string) => {
      if (token) {
        ax.defaults.headers.common.Authorization = `Bearer ${token}`;
      } else {
        delete ax.defaults.headers.common.Authorization;
      }
    },

    get: async <T>(url: string, query?: any): Promise<T | null> => {
      loading.value = true
      try {
        hideSnackMessage()

        const res = await ax.get<T>(url, {
          params: query,
        })
        return res.data
      } catch (err) {
        showError(err as AxiosError, showSnackMessage)
        return null
      } finally {
        loading.value = false
      }
    },

    post: async <T>(url: string, data?: any, headers?: any, query?: any): Promise<T | null> => {
      loading.value = true
      try {
        hideSnackMessage()

        let res = null as AxiosResponse<T> | null
        if (headers || query) {
          res = await ax.post<T>(url, data, {
            params: query,
            headers,
          } as AxiosRequestConfig)
        } else res = await ax.post<T>(url, data)

        if (
          res.status === HttpStatusCode.Ok ||
          res.status === HttpStatusCode.Created ||
          res.status === HttpStatusCode.NoContent
        ) {
          return res.data
        } else {
          showSnackMessage('Request did not succeed.', 'error')
          return null
        }
      } catch (err) {
        showError(err as AxiosError, showSnackMessage)
        return null
      } finally {
        loading.value = false
      }
    },

    put: async <T>(url: string, data: any, headers?: any, query?: any): Promise<T | null> => {
      loading.value = true
      try {
        hideSnackMessage()

        let res = null as AxiosResponse<T> | null
        if (headers || query) {
          res = await ax.put<T>(url, data, {
            params: query,
            headers,
          } as AxiosRequestConfig)
        } else res = await ax.put<T>(url, data)

        if (res.status === HttpStatusCode.Ok) return res.data
        else {
          showSnackMessage('Request did not succeed.', 'error')
          return null
        }
      } catch (err) {
        showError(err as AxiosError, showSnackMessage)
        return null
      } finally {
        loading.value = false
      }
    },

    del: async <T>(url: string): Promise<T | null> => {
      loading.value = true
      try {
        hideSnackMessage()

        const res = await ax.delete<T>(url)
        if (res.status === HttpStatusCode.Ok) return res.data
        else {
          showSnackMessage('Request did not succeed.', 'error')
          return null
        }
      } catch (err) {
        showError(err as AxiosError, showSnackMessage)
        return null
      } finally {
        loading.value = false
      }
    },
  }
}

function showError (error: AxiosError, showSnackMessage: (text: string, color: string) => void) {
  switch (error?.response?.status) {
    case HttpStatusCode.Unauthorized:
      showSnackMessage('You are not authorized to perform this action.', 'error')
      break

    case HttpStatusCode.InternalServerError:
      if (instanceOfAxiosErrorEx(error.response.data)) {
        showSnackMessage((error as AxiosErrorEx).response.data.message, 'error')
      } else {
        showSnackMessage('An error occurred on the server.', 'error')
      }
      break

    case HttpStatusCode.UnprocessableEntity:
      const errors = (error as AxiosErrorEx)?.response.data?.errors
      let errorMsg = ''
      if (Array.isArray(errors)) {
        errorMsg = errors.join('<br>')
      } else if (typeof errors === 'object' && errors !== null) {
        errorMsg = Object.values(errors).flat().join('<br>')
      } else {
        errorMsg = String(errors)
      }
      showSnackMessage(errorMsg, 'error')
      break

    default:
      showSnackMessage(JSON.stringify('Connectivity error: ' + error), 'error')
      break
  }
}

function instanceOfAxiosErrorEx (object: any): object is AxiosErrorEx {
  return 'message' in object
}
