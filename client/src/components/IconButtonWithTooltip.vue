<template>
  <v-tooltip>
    {{ tooltip }}
    <template #activator="{ props }">
      <v-icon
        :class="classes"
        :color="color"
        v-bind="props"
        :icon="icon"
        variant="text"
        @click="emit('click')"
      />
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    icon: string
    tooltip?: string
    classes?: string
    color?: string
  }>(), {
    classes: 'me-2',
    tooltip: '',
  })

  const emit = defineEmits(['click'])
</script>
