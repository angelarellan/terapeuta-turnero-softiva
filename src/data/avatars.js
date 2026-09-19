import { createAvatar } from '@dicebear/core'
import { personas } from '@dicebear/collection'

const cache = new Map()

export function getBarberAvatar(id) {
  if (!cache.has(id)) {
    cache.set(
      id,
      createAvatar(personas, {
        seed: id,
        backgroundColor: ['e8b4b8', 'd4af37', 'e2c7c3'],
      }).toDataUri(),
    )
  }
  return cache.get(id)
}
