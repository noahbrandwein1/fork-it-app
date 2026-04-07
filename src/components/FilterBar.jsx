const CUISINES = [
  { label: 'All', value: '' },
  { label: 'American', value: 'american' },
  { label: 'Mexican', value: 'mexican' },
  { label: 'Italian', value: 'italian' },
  { label: 'Asian', value: 'asian' },
  { label: 'Fast Food', value: 'fast food' },
  { label: 'Pizza', value: 'pizza' },
  { label: 'Burgers', value: 'burgers' },
  { label: 'Sushi', value: 'sushi' },
  { label: 'BBQ', value: 'bbq' },
]

const PRICES = [
  { label: 'Any', value: null },
  { label: '$', value: 1 },
  { label: '$$', value: 2 },
  { label: '$$$', value: 3 },
  { label: '$$$$', value: 4 },
]

const DISTANCES = [
  { label: '0.5 mi', value: 800 },
  { label: '1 mi', value: 1600 },
  { label: '3 mi', value: 4800 },
  { label: '5 mi', value: 8000 },
  { label: '10 mi', value: 16000 },
]

export default function FilterBar({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-gray-900 rounded-xl mb-4">
      
      {/* Cuisine */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 uppercase tracking-wide">Cuisine</label>
        <select
          className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-orange-500"
          value={filters.cuisine}
          onChange={(e) => onChange({ ...filters, cuisine: e.target.value })}
        >
          {CUISINES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 uppercase tracking-wide">Price</label>
        <div className="flex gap-2">
          {PRICES.map((p) => (
            <button
              key={p.label}
              onClick={() => onChange({ ...filters, price: p.value })}
              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                filters.price === p.value
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-orange-500'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 uppercase tracking-wide">Distance</label>
        <div className="flex gap-2">
          {DISTANCES.map((d) => (
            <button
              key={d.value}
              onClick={() => onChange({ ...filters, distance: d.value })}
              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                filters.distance === d.value
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-orange-500'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}