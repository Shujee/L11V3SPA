<template>
  <v-menu v-model="menu" close-on-click close-on-content-click offset-y>
    <template #activator="{ props }">
      <v-btn v-show="store.user" variant="text" v-bind="props">
        <v-avatar class="mr-2" color="background" size="36">
          <span v-if="store.user?.name" class="white--text headline">{{ store.user?.name[0] }}</span>
          <span v-else class="white--text headline">
            <v-icon>mdi-account</v-icon>
          </span>
        </v-avatar>

        <div class="hidden-xs-only">Welcome {{ store.user && store.user.name ? store.user.name : "?" }}</div>
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>

    <v-card min-width="300">
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :subtitle="store.userEmail"
          :title="store.userName"
        />
      </v-list>
      <v-card-actions>
        <v-spacer />
        <v-list-item prepend-icon="mdi-logout" title="Logout" @click="logout" />
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import useRequestHandler from '@/composables/useRequestHandler'
import { useRouter } from 'vue-router'
import { showSnackKey, snackTextKey } from '@/InjectionKeys'
import { inject, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { User } from '@/composables/types'

const showSnack = inject(showSnackKey, ref<boolean>(false))
const snackText = inject(snackTextKey, ref<string>(''))

const store = useAppStore()
const router = useRouter()
const menu = ref<boolean>(false)

const logout = async () => {
  const req = useRequestHandler(showSnack, snackText)

  await req.post('logout')
  store.user = {} as User
  router.push('/login')
}
</script>
