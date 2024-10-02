import type { InjectionKey, Ref } from 'vue'

const showSnackKey = Symbol('showSnackKey') as InjectionKey<Ref<boolean>>
const snackTextKey = Symbol('snackTextKey') as InjectionKey<Ref<string>>
const showConfirmKey = Symbol('showConfirmKey') as InjectionKey<(title: string, msg: string) => Promise<boolean>>

export { showSnackKey, snackTextKey, showConfirmKey }
