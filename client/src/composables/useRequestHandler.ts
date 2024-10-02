import { ref, Ref } from 'vue'
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios'
import { AxiosErrorEx } from '@/composables/types'
import useLaravelAxios from '@/composables/useLaravelAxios'

const loading = ref<boolean>(false)

const ax = useLaravelAxios()

export default function (showSnack?: Ref<boolean>, snackText?: Ref<string>) {
  return {
    loading,
    get: async <T>(url: string, params?: any): Promise<T | null> => {
      loading.value = true
      try {
        if (showSnack && snackText) {
          showSnack.value = false
          snackText.value = ''
        }

        const res = await ax.get<T>(url, {
          params,
        })
        return res.data
      } catch (err) {
        showError(err as AxiosError, showSnack, snackText)
        return null
      } finally {
        loading.value = false
      }
    },

    post: async <T>(url: string, data?: any, headers?: any): Promise<T | null> => {
      loading.value = true
      try {
        if (showSnack && snackText) {
          showSnack.value = false
          snackText.value = ''
        }

        let res = null as AxiosResponse<T> | null
        if (headers) res = await ax.post<T>(url, data, headers)
        else res = await ax.post<T>(url, data)

        if (
          res.status === HttpStatusCode.Ok ||
          res.status === HttpStatusCode.Created ||
          res.status === HttpStatusCode.NoContent
        ) {
          return res.data
        } else {
          if (showSnack && snackText) {
            snackText.value = 'Request did not succeed.'
            showSnack.value = true
          }

          return null
        }
      } catch (err) {
        showError(err as AxiosError, showSnack, snackText)
        return null
      } finally {
        loading.value = false
      }
    },

    put: async <T>(url: string, data: any): Promise<T | null> => {
      loading.value = true
      try {
        if (showSnack && snackText) {
          showSnack.value = false
          snackText.value = ''
        }

        const res = await ax.put<T>(url, data)
        if (res.status === HttpStatusCode.Ok) return res.data
        else {
          if (showSnack && snackText) {
            snackText.value = 'Request did not succeed.'
            showSnack.value = true
          }

          return null
        }
      } catch (err) {
        showError(err as AxiosError, showSnack, snackText)
        return null
      } finally {
        loading.value = false
      }
    },

    del: async <T>(url: string): Promise<T | null> => {
      loading.value = true
      try {
        if (showSnack && snackText) {
          showSnack.value = false
          snackText.value = ''
        }

        const res = await ax.delete<T>(url)
        if (res.status === HttpStatusCode.Ok) return res.data
        else {
          if (showSnack && snackText) {
            snackText.value = 'Request did not succeed.'
            showSnack.value = true
          }
          return null
        }
      } catch (err) {
        showError(err as AxiosError, showSnack, snackText)
        return null
      } finally {
        loading.value = false
      }
    },
  }
}

function showError (error: AxiosError, showSnack?: Ref<boolean>, snackText?: Ref<string>) {
  if (showSnack && snackText) {
    switch (error?.response?.status) {
      case HttpStatusCode.Unauthorized:
        showSnack.value = true
        snackText.value = 'You are not authorized to perform this action.'
        break

      case HttpStatusCode.InternalServerError:
        showSnack.value = true
        snackText.value = 'Unexpected error occurred on the server.'
        break

      case HttpStatusCode.UnprocessableEntity:
        showSnack.value = true
        snackText.value = (error as AxiosErrorEx)?.response.data?.message
        break

      default:
        showSnack.value = true
        snackText.value = JSON.stringify(error + ' here')
        break
    }
  }
}
