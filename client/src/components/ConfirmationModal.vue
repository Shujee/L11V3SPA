<template>
  <v-dialog v-model="show" max-width="400px" persistent>
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
      <v-card-text v-html="`${message}`" />
      <v-card-actions>
        <v-spacer />
        <v-btn color="green darken-1" variant="text" @click="confirm">{{ confirmText }}</v-btn>
        <v-btn color="red darken-1" variant="text" @click="cancel">{{ cancelText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>

  defineProps<{
    title: string,
    message: string,
    confirmText: string,
    cancelText: string,
  }>()

  let resolvePromise : (value: unknown) => void
  const show = ref<boolean>(false)

  const open = async () => {
    show.value = true
    return new Promise(resolve => {
      resolvePromise = resolve
    })
  }

  defineExpose({
    open,
  })

  const confirm = () => {
    show.value = false
    if (resolvePromise != null) {
      resolvePromise(true)
    }
  }

  const cancel = () => {
    show.value = false
    if (resolvePromise != null) {
      resolvePromise(false)
    }
  }
</script>
