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
import { showConfirmKey, showSnackKey, snackTextKey } from '@/InjectionKeys'
import useRequestHandler from '@/composables/useRequestHandler'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { User } from '@/composables/types'

const snackText = ref<string>('')
const showSnack = ref<boolean>(false)
const confirm = ref()

const confirmText = ref<string>('')
const confirmTitle = ref<string>('')

const showConfirm = async (title: string, msg: string) : Promise<boolean> => {
  confirmText.value = msg
  confirmTitle.value = title

  return confirm.value.open()
}

// provide these refs to the child components to allow them to show snack messages
provide(showSnackKey, showSnack)
provide(snackTextKey, snackText)
provide(showConfirmKey, showConfirm)

onBeforeMount(async () => {
  const { get } = useRequestHandler(showSnack, snackText)

  const router = useRouter()
  const store = useAppStore()

  const res = await get('check')

  if (!res) {
    store.user = {} as User
    router.push('/login')
  }
})
</script>
