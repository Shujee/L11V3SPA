<template>
  <v-responsive class="align-centerfill-height mx-auto" max-width="900">
    <v-img class="my-8" height="150" src="@/assets/logo.png" />

    <div class="text-center">
      <h1 class="text-h1">L11V3-SPA</h1>
      <v-chip class="mt-2" size="x-large">
        <h3 class="text-h4 ma-2">Laravel API with Vuetify SPA</h3>
      </v-chip>
    </div>
  </v-responsive>
  <router-view name="dialog" />
</template>

 <script setup lang="ts">
 //
 </script>
