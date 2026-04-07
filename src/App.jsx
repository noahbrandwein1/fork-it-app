import { useState, useEffect } from 'react'
import { useLocation } from './hooks/useLocation'
import { getNearbyRestaurants, searchRestaurants } from './services/placesAPI'
import FilterBar from './components/FilterBar'
import RestaurantCard from './components/RestaurantCard'
import Wheel from './components/Wheel'
import ResultModal from './components/ResultModal'

export default function App() {
  const { location, error: locationError, loading: locationLoading } = useLocation()
  const [restaurants, setRestaurants] = useState([])
  const [wheelRestaurants, setWheelRestaurants] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('discover')
  const [page, setPage] = useState(0)
  const [seenIds, setSeenIds] = useState(new Set())
  const [filters, setFilters] = useState({
    cuisine: '',
    price: null,
    distance: 1600,
  })

  useEffect(() => {
    if (location) {
      setRestaurants([])
      setSeenIds(new Set())
      setPage(0)
      fetchRestaurants(0, new Set())
    }
  }, [location, filters])

  async function fetchRestaurants(pageNum = 0, currentSeenIds = seenIds) {
    if (pageNum === 0) setLoading(true)
    else setLoadingMore(true)
    setError(null)
    try {
      const results = await getNearbyRestaurants({
        lat: location.lat,
        lng: location.lng,
        radius: filters.distance,
        type: filters.cuisine,
        page: pageNum,
      })
      const filtered = filters.price
        ? results.filter((r) => r.priceLevel === filters.price)
        : results

      const newSeen = new Set(currentSeenIds)
      const unique = filtered.filter((r) => {
        if (newSeen.has(r.id)) return false
        newSeen.add(r.id)
        return true
      })

      setSeenIds(newSeen)
      setRestaurants((prev) => pageNum === 0 ? unique : [...prev, ...unique])
    } catch (err) {
      setError('Failed to load restaurants. Check your API key.')
    }
    setLoading(false)
    setLoadingMore(false)
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!searchQuery.trim() || !location) return
    setLoading(true)
    setError(null)
    try {
      const results = await searchRestaurants({
        lat: location.lat,
        lng: location.lng,
        query: searchQuery,
      })
      setRestaurants(results)
    } catch (err) {
      setError('Search failed. Try again.')
    }
    setLoading(false)
  }

  function handleLoadMore() {
    const nextPage = page + 1
    setPage(nextPage)
    fetchRestaurants(nextPage)
  }

  function handleAddToWheel(restaurant) {
    if (wheelRestaurants.find((r) => r.id === restaurant.id)) return
    if (wheelRestaurants.length >= 8) return
    setWheelRestaurants([...wheelRestaurants, restaurant])
  }

  function handleResult(restaurant) {
    setResult(restaurant)
  }

  function handleSpinAgain() {
    setResult(null)
  }

  function handleClearWheel() {
    setResult(null)
    setWheelRestaurants([])
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <h1 className="text-2xl font-bold text-orange-500 text-center">Fork It 🍴</h1>
        <p className="text-gray-400 text-sm text-center mt-1">Can't decide where to eat? Let fate decide.</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'discover'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab('wheel')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'wheel'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Wheel {wheelRestaurants.length > 0 && `(${wheelRestaurants.length})`}
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search for a restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors"
              >
                Search
              </button>
            </form>

            <FilterBar filters={filters} onChange={setFilters} />

            {locationLoading && (
              <p className="text-gray-400 text-center py-10">Getting your location...</p>
            )}
            {locationError && (
              <p className="text-red-400 text-center py-10">{locationError}</p>
            )}
            {loading && (
              <p className="text-gray-400 text-center py-10">Finding restaurants near you...</p>
            )}
            {error && (
              <p className="text-red-400 text-center py-10">{error}</p>
            )}

            {!loading && !error && restaurants.length > 0 && (
              <div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {restaurants.map((r) => (
                    <RestaurantCard
                      key={r.id}
                      restaurant={r}
                      onAdd={handleAddToWheel}
                      isAdded={!!wheelRestaurants.find((w) => w.id === r.id)}
                    />
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading more...' : 'Load More Restaurants'}
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && restaurants.length === 0 && !locationLoading && (
              <p className="text-gray-400 text-center py-10">No restaurants found. Try adjusting your filters.</p>
            )}
          </div>
        )}

        {/* Wheel Tab */}
        {activeTab === 'wheel' && (
          <div>
            {wheelRestaurants.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🎡</p>
                <p className="text-gray-400">Your wheel is empty.</p>
                <p className="text-gray-500 text-sm mt-1">Go to Discover and add some restaurants!</p>
              </div>
            ) : (
              <Wheel
                restaurants={wheelRestaurants}
                onResult={handleResult}
              />
            )}
          </div>
        )}

      </main>

      {/* Sticky Bottom Spin Bar */}
{wheelRestaurants.length > 0 && (
  <div className="fixed bottom-0 left-0 right-0 p-3 bg-gray-950 border-t border-gray-800 z-40">
    <button
      onClick={() => setActiveTab('wheel')}
      className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3"
    >
      <span className="bg-white text-orange-500 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
        {wheelRestaurants.length}
      </span>
      Spin the Wheel 🍴
    </button>
  </div>
)}

      {/* Result Modal */}
      <ResultModal
        restaurant={result}
        onSpinAgain={handleSpinAgain}
        onClose={handleClearWheel}
      />

    </div>
  )
}