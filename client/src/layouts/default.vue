<template>
  <v-app-bar>
    <v-img class="mx-2" contain max-width="120" src="@/assets/logo.png" />

    <template v-if="store.isLoggedIn">
      <v-spacer />
      <v-btn prepend-icon="mdi-home" to="/home">Home</v-btn>
      <v-btn prepend-icon="mdi-clipboard-file-outline" to="/activity">Activities</v-btn>
      <v-btn prepend-icon="mdi-checkbox-blank-badge-outline" to="/batches">Batches</v-btn>
      <v-spacer />
      <ProfileDropdown />
    </template>
    <template v-else>
      <v-spacer />
      <v-btn prepend-icon="mdi-login" to="/login" variant="text">Login</v-btn>
    </template>
  </v-app-bar>

  <AppFooter />

  <v-main>
    <router-view />
  </v-main>

</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/app'

const store = useAppStore()
</script>
