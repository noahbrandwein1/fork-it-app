import { getPhotoUrl } from '../services/placesAPI'

const PRICE_LABELS = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' }

export default function RestaurantCard({ restaurant, onAdd, isAdded }) {
  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden border transition-colors ${
      isAdded ? 'border-orange-500' : 'border-gray-800 hover:border-gray-600'
    }`}>
      
      {/* Photo */}
      {restaurant.photoUrl ? (
  <img
    src={restaurant.photoUrl}
          alt={restaurant.name}
          className="w-full h-32 object-cover"
        />
      ) : (
        <div className="w-full h-32 bg-gray-800 flex items-center justify-center text-4xl">
          🍴
        </div>
      )}

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm truncate">{restaurant.name}</h3>
        
        <div className="flex items-center gap-2 mt-1">
          {restaurant.rating !== 'N/A' && (
            <span className="text-yellow-400 text-xs">⭐ {restaurant.rating}</span>
          )}
          {restaurant.priceLevel && (
            <span className="text-gray-400 text-xs">{PRICE_LABELS[restaurant.priceLevel]}</span>
          )}
          {restaurant.isOpen === true && (
            <span className="text-green-400 text-xs">Open</span>
          )}
          {restaurant.isOpen === false && (
            <span className="text-red-400 text-xs">Closed</span>
          )}
        </div>

        <p className="text-gray-500 text-xs mt-1 truncate">{restaurant.address}</p>

        <button
          onClick={() => onAdd(restaurant)}
          disabled={isAdded}
          className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            isAdded
              ? 'bg-orange-500 text-white cursor-default'
              : 'bg-gray-800 text-gray-300 hover:bg-orange-500 hover:text-white'
          }`}
        >
          {isAdded ? '✓ Added to Wheel' : '+ Add to Wheel'}
        </button>
      </div>
    </div>
  )
}