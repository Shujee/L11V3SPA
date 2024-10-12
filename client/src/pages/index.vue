<template>
  <v-responsive class="align-centerfill-height mx-auto" max-width="900">
    <v-container>
      <v-row />
    </v-container>
  </v-responsive>
  <router-view name="dialog" />
</template>

<script setup lang="ts">
// import { PagedResponse } from '@/composables/types'
// import useRequestHandler from '@/composables/useRequestHandler'
// import { showSnackKey, snackTextKey } from '@/InjectionKeys'

// const showSnack = inject(showSnackKey, ref<boolean>(false))
// const snackText = inject(snackTextKey, ref<string>(''))

onBeforeMount(() => {
  // use get function to fetch api data
})
</script>
