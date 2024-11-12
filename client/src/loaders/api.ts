import { PagedResponse, User } from '@/composables/types'
import useRequestHandler from '@/composables/useRequestHandler'
import { LocationQueryValueRaw } from 'vue-router'

export interface PaginationParams {
  page?: number
  perPage?: number
}

const { get } = useRequestHandler()

export async function getUsers (
  query: string | LocationQueryValueRaw,
  {
    page = 1,
    perPage = 25,
  }: PaginationParams,
) {
  const response = await get<PagedResponse<User>>('/user', {
    query,
    page,
    perPage,
  })

  return response
}
