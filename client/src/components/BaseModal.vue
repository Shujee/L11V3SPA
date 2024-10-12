<template>
  <v-dialog v-model="show" :fullscreen="fullscreen">
    <v-form ref="form" validate-on="blur">
      <v-card class="fill-height bg-white" :prepend-icon="props.icon" :rounded="1" :title="props.title">
        <VCardText class="fill-height">

          <slot name="text" />
        </VCardText>
        <VCardActions v-if="!hideActions">
          <slot name="actions">
            <v-btn class="ma-3" @click="validate">OK</v-btn>
            <v-btn class=" ma-3" @click="show = false">Cancel</v-btn>
          </slot>
        </VCardActions>
        <v-defaults-provider :defaults="defaults">
          <v-row class="my-0">
            <slot />
          </v-row>
        </v-defaults-provider>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const showSnack = ref<boolean>(false)
const snackText = ref<string>('')
const form = ref<HTMLFormElement>()

const router = useRouter()

const defaults = ref({
  VTextField: {
    variant: 'outlined',
  },
  VSelect: {
    variant: 'outlined',
  },
})

const props = defineProps<{
  title: string
  icon?: string
  fullscreen?: boolean
  hideActions?: boolean
}>()

const show = defineModel<boolean>({
  default: true,
})

const emit = defineEmits(['ok', 'cancel'])

watch(show, newValue => {
  if (!newValue && router.currentRoute.value.matched.length > 1) { router.push(router.currentRoute.value.matched[router.currentRoute.value.matched.length - 2]) }
})

const validate = async () => {
  if (form.value) {
    const { valid, errors } = await form.value.validate()

    if (!valid) {
      snackText.value = errors[0].errorMessages[0]
      showSnack.value = true
    } else {
      emit('ok')
    }
  }
}
</script>
