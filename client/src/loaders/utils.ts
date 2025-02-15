import type { LocationQueryValueRaw } from 'vue-router'

export function parsePageQuery (
  value: LocationQueryValueRaw | LocationQueryValueRaw[],
): number {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : 1
}

export function parseQuerySearch (
  value: LocationQueryValueRaw | LocationQueryValueRaw[],
) {
  return typeof value === 'string'
    ? value : value == null ? '' : null
}
