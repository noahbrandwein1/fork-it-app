const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY

let placesService = null

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })
}

async function init() {
  if (placesService) return
  await loadGoogleMaps()
  const mapDiv = document.createElement('div')
  const map = new window.google.maps.Map(mapDiv, {
    center: { lat: 0, lng: 0 },
    zoom: 15,
  })
  placesService = new window.google.maps.places.PlacesService(map)
}

function mapPlace(place) {
  return {
    id: place.place_id,
    name: place.name,
    rating: place.rating || 'N/A',
    priceLevel: place.price_level ?? null,
    address: place.vicinity || place.formatted_address,
    types: place.types,
    isOpen: place.opening_hours?.isOpen() ?? null,
    photoUrl: place.photos ? place.photos[0].getUrl({ maxWidth: 400 }) : null,
  }
}

const KEYWORD_BATCHES = [
  ['restaurant', 'fast food', 'pizza', 'sushi'],
  ['mexican', 'chinese', 'italian', 'burgers'],
  ['bbq', 'thai', 'indian', 'mediterranean'],
  ['american', 'japanese', 'korean', 'greek'],
]

export async function getNearbyRestaurants({ lat, lng, radius = 2000, type = '', page = 0 }) {
  await init()

  const keywords = type ? [type] : KEYWORD_BATCHES[page % KEYWORD_BATCHES.length]

  const searches = keywords.map((keyword) => {
    return new Promise((resolve) => {
      const request = {
        location: new window.google.maps.LatLng(lat, lng),
        radius,
        type: 'restaurant',
        keyword,
      }
      placesService.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results.map(mapPlace))
        } else {
          resolve([])
        }
      })
    })
  })

  const allResults = await Promise.all(searches)
  const flat = allResults.flat()

  const seen = new Set()
  return flat.filter((r) => {
    if (seen.has(r.id)) return false
    seen.add(r.id)
    return true
  })
}

export async function searchRestaurants({ lat, lng, query }) {
  await init()
  return new Promise((resolve, reject) => {
    const request = {
      query,
      location: new window.google.maps.LatLng(lat, lng),
      radius: 5000,
      type: 'restaurant',
    }
    placesService.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(results.map(mapPlace))
      } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([])
      } else {
        reject(new Error('Places API error: ' + status))
      }
    })
  })
}

export function getPhotoUrl(photo, maxWidth = 400) {
  return photo || null
}