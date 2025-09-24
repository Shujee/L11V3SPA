<template>
  <v-app>
    <router-view />
    <v-snackbar v-model="showSnack" value="snackbarText">
      {{ snackText }}
      <template #actions>
        <v-btn icon="mdi-close" variant="text" @click="showSnack = false" />
      </template>
    </v-snackbar>

    <ConfirmationModal
      ref="confirm"
      cancel-text="No"
      confirm-text="Yes"
      :message="confirmText"
      :title="confirmTitle"
    />
  </v-app>
</template>

<script lang="ts" setup>
import { hideSnackMessageKey, showConfirmKey, showSnackMessageKey } from './InjectionKeys'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { User } from '@/composables/types'
import { useApi } from './composables/useApi'

const snackText = ref<string>('')
const snackColor = ref<string>('')
const showSnack = ref<boolean>(false)
const confirm = ref()

const confirmText = ref<string>('')
const confirmTitle = ref<string>('')

const showSnackMessage = (text: string, color = 'info') => {
  snackText.value = text
  snackColor.value = color
  showSnack.value = true
}

const hideSnackMessage = () => {
  snackText.value = ''
  snackColor.value = ''
  showSnack.value = false
}

const showConfirm = async (title: string, msg: string) : Promise<boolean> => {
  confirmText.value = msg
  confirmTitle.value = title

  return confirm.value.open()
}

// provide these refs to the child components to allow them to show snack messages
provide(showSnackMessageKey, showSnackMessage)
provide(hideSnackMessageKey, hideSnackMessage)
provide(showConfirmKey, showConfirm)

onBeforeMount(async () => {
  const { init, check } = useApi()

  // passing global snackbar refs to API composable to show error messages etc.
  init(showSnackMessage, hideSnackMessage)

  const router = useRouter()
  const store = useAppStore()

  const res = await check()

  if (!res) {
    store.user = {} as User
    router.push('/login')
  }
})
</script>
