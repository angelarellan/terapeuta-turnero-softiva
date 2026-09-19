import { createAvatar } from '@dicebear/core'
import { personas } from '@dicebear/collection'

const cache = new Map()

export function getBarberAvatar(id) {
  if (!cache.has(id)) {
    cache.set(
      id,
      createAvatar(personas, {
        seed: id,
        backgroundColor: ['b3c6a9', 'c9a86a', 'e4dbc9'],
      }).toDataUri(),
    )
  }
  return cache.get(id)
}
