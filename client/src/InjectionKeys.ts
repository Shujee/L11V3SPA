import type { InjectionKey } from 'vue'
import { IRequestHandler } from './composables/types'

const showSnackMessageKey = Symbol('showSnackMessageKey') as InjectionKey<(text: string, color: string) => void>
const hideSnackMessageKey = Symbol('hideSnackMessageKey') as InjectionKey<() => void>
const showConfirmKey = Symbol('showConfirmKey') as InjectionKey<(title: string, msg: string) => Promise<boolean>>
const requestHandlerKey = Symbol('requestHandlerKey') as InjectionKey<IRequestHandler>

export { showSnackMessageKey, hideSnackMessageKey, showConfirmKey, requestHandlerKey }
