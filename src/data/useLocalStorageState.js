import { useEffect, useState } from 'react'

// Guarda un estado en localStorage para que sobreviva a un refresco de
// página. Es persistencia solo del navegador del dispositivo donde se usa
// (no hay backend/base de datos compartida), pero alcanza para que la dueña
// no tenga que volver a cargar sus vacaciones cada vez que abre el sitio.
export default function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage no disponible (modo privado, cuota llena, etc.)
    }
  }, [key, value])

  return [value, setValue]
}
