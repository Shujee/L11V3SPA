import { Dayjs } from 'dayjs'

interface Link {
  active: boolean
  label: string
  url: string
}

interface PagedResponse<T> {
  data: T[]
  meta: {
    from: number
    to: number
    total: number
    current_page: number
    last_page: number
    per_page: number
    path: string
    links: Link[]
  }
  links: {
    first: string
    last: string
    prev: string
    next: string
  }
}

interface IRequestHandler {
  loading: Ref<boolean>
  get: <T>(url: string, params?: any) => Promise<T | null>
  post: <T>(url: string, data?: any, headers?: any) => Promise<T | null>
  put: <T>(url: string, data: any) => Promise<T | null>
  del: <T>(url: string) => Promise<T | null>
}

interface ResourceResponse<T> {
  data: T
}

type UserRole = 'Admin'

interface User {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: Dayjs
}

type ValidationField = 'email' | 'name' | 'password' | 'user_id'

interface AxiosErrorEx {
  response: {
    data: {
      message: string,
      errors: Record<ValidationField, string[]>
    }
  }
}
interface PagingArgs {
  page: number
  itemsPerPage: number
  sortBy?: string[]
}

type SelectItemKey = (number | string)[] | boolean | string | ((item: Record<string, any>, fallback?: any) => any)
type DataTableCompareFunction<T = any> = (a: T, b: T) => number
type DataTableHeader = {
  key: string
  value?: SelectItemKey
  title: string
  colspan?: number
  rowspan?: number
  fixed?: boolean
  align?: 'center' | 'end' | 'start'
  width?: number
  minWidth?: string
  maxWidth?: string
  sortable?: boolean
  sort?: DataTableCompareFunction
}
interface ConfirmDialogOptions {
  color?: string
  icon?: string
  width?: number
  zIndex?: number
  showCancel?: boolean
  okText?: string
  cancelText?: string
  okColor?: string
  cancelColor?: string
}
interface ConfirmDialogArgs {
  title?: string,
  message: string,
  type: 'string' | 'validation',
  errors: Record<string, string[]>,
  options?: ConfirmDialogOptions,
}
interface ValidationErrorResponse {
  message: string,
  errors: Record<string, string[]>
}

export type {
  IRequestHandler,
  User,
  PagedResponse,
  ResourceResponse,
  AxiosErrorEx,
  UserRole,
  DataTableHeader,
  PagingArgs,
  ConfirmDialogArgs,
  ConfirmDialogOptions,
  ValidationErrorResponse,
}
