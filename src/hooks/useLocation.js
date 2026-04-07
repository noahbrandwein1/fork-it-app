import { useState, useEffect } from 'react'

export function useLocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('no-geolocation')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoading(false)
      },
      () => {
        setError('permission-denied')
        setLoading(false)
      }
    )
  }, [])

  function setManualLocation(lat, lng) {
    setLocation({ lat, lng })
    setError(null)
  }

  return { location, error, loading, setManualLocation }
}