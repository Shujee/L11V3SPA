<template>
  <BaseModal
    v-model="dialog"
    :fullscreen="false"
    icon="mdi-file-document-check"
    max-width="400"
    title="Login"
  >
    <template #text>
      <v-form class="ma-3">
        <v-text-field
          v-model="email"
          autofocus
          :maxlength="30"
          placeholder="E-mail*"
          :rules="[(v) => !!v || 'E-mail is required']"
          type="text"
        />

        <v-text-field
          v-model="pwd"
          :append-inner-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
          class="mb-0"
          hide-details
          placeholder="Password*"
          required
          :type="showPwd ? 'text' : 'password'"
          @click:append-inner="showPwd = !showPwd"
          @keyup.enter="tryToLogin"
        />

        <v-row>
          <v-col>
            <!-- <v-btn variant="text" class="text-caption" :to="{ name: 'ForgotPassword' }"> Forgot Password?</v-btn> -->
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #actions>
      <v-spacer />
      <v-btn :loading="loading" @click="tryToLogin"> Login </v-btn>
      <v-btn @click="close"> Close </v-btn>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { inject, ref } from 'vue'
import { ResourceResponse, User } from '@/composables/types'
import BaseModal from '@/components/BaseModal.vue'
import { showSnackKey, snackTextKey } from '@/InjectionKeys'
import useRequestHandler from '@/composables/useRequestHandler'

const showSnack = inject(showSnackKey, ref<boolean>(false))
const snackText = inject(snackTextKey, ref<string>(''))
const { loading, post } = useRequestHandler(showSnack, snackText)

const store = useAppStore()
const router = useRouter()

const email = ref<string>('a@a.co')
const pwd = ref<string>('12345678')
const dialog = defineModel<boolean>({
  default: true,
})
const showPwd = ref<boolean>(false)

const tryToLogin = async () => {
  if (!email.value || !pwd.value) {
    snackText.value = 'Please provide your email and password to login.'
    showSnack.value = true
  } else {
    // send login request (xhr)
    const res = await post<ResourceResponse<User>>('login', {
      email: email.value,
      password: pwd.value,
    })

    if (res !== null && res.data.id) {
      // hide login dialog after successful login
      dialog.value = false

      // and store user information in the store
      store.user = res.data

      // also clear email and password text fields for next login
      email.value = ''
      pwd.value = ''

      console.log(store.user)

      nextTick(() => {
        router.push('/home')
      })
    }
  }
}

const close = () => {
  dialog.value = false
  showSnack.value = false
  snackText.value = ''
  email.value = ''
  pwd.value = ''
}
</script>
