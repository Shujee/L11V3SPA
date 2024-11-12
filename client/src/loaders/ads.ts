import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada'
import { getUsers } from '@/loaders/api'
import { parsePageQuery, parseQuerySearch } from '@/loaders/utils'
import { PagedResponse, User } from '@/composables/types'

export const useAdsResults = defineColadaLoader(
  '/',
  {
    // the key is needed for pinia colada but not for a basic loader
    key: (to: any) => [
      '/',
      {
        query: parseQuerySearch(to.query.query),
        page: parsePageQuery(to.query.page),
        perPage: parsePageQuery(to.query.perPage),
      },
    ],
    query: async (to) : Promise<PagedResponse<User>|null> => {
      const query = parseQuerySearch(to.query.query)
      const page = parsePageQuery(to.query.page)
      const perPage = parsePageQuery(to.query.perPage)

      return getUsers(query, { page, perPage })
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    // lazy: (to, from) => to.name !== to.from
  },
)
