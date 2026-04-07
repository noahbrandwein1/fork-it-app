import { getPhotoUrl } from '../services/placesAPI'

const PRICE_LABELS = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' }

export default function ResultModal({ restaurant, onSpinAgain, onClose }) {
  if (!restaurant) return null

  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(restaurant.name + ' ' + restaurant.address)
  const doordashUrl = 'https://www.doordash.com/search/store/' + encodeURIComponent(restaurant.name) + '/'
  const uberEatsUrl = 'https://www.ubereats.com/search?q=' + encodeURIComponent(restaurant.name)

  const photo = restaurant.photoUrl
    ? <img src={restaurant.photoUrl} alt={restaurant.name} className="w-full h-48 object-cover" />
    : <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-6xl">🍴</div>

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl overflow-hidden max-w-sm w-full border border-orange-500 shadow-2xl">

        {photo}

        <div className="p-5">
          <div className="text-center mb-4">
            <p className="text-orange-400 text-sm font-medium uppercase tracking-wide mb-1">Tonight you are eating at</p>
            <h2 className="text-2xl font-bold text-white">{restaurant.name}</h2>
            <div className="flex items-center justify-center gap-3 mt-2">
              {restaurant.rating !== 'N/A' && (
                <span className="text-yellow-400 text-sm">⭐ {restaurant.rating}</span>
              )}
              {restaurant.priceLevel && (
                <span className="text-gray-400 text-sm">{PRICE_LABELS[restaurant.priceLevel]}</span>
              )}
              {restaurant.isOpen === true && (
                <span className="text-green-400 text-sm">Open Now</span>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-2">{restaurant.address}</p>
          </div>

          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium mb-2 transition-colors">
            📍 Open in Google Maps
          </a>

          <div className="flex gap-2 mb-4">
            <a href={doordashUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium text-sm transition-colors">
              🛵 DoorDash
            </a>
            <a href={uberEatsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 bg-green-700 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-colors">
              🟢 Uber Eats
            </a>
          </div>

          <div className="flex gap-2">
            <button onClick={onSpinAgain} className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-medium transition-colors">
              Spin Again
            </button>
            <button onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors">
              Clear Wheel
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}