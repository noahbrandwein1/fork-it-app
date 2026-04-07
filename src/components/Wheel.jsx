import { useState } from 'react'
import { Wheel as SpinWheel } from 'react-custom-roulette'

const COLORS = [
  '#f97316', '#ef4444', '#eab308', '#22c55e',
  '#3b82f6', '#a855f7', '#ec4899', '#14b8a6',
]

export default function Wheel({ restaurants, onResult }) {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeIndex, setPrizeIndex] = useState(0)

  const data = restaurants.map((r, i) => ({
    option: r.name.length > 15 ? r.name.slice(0, 15) + '…' : r.name,
    style: {
      backgroundColor: COLORS[i % COLORS.length],
      textColor: '#ffffff',
    },
  }))

  function handleSpin() {
    if (mustSpin || restaurants.length < 2) return
    const index = Math.floor(Math.random() * restaurants.length)
    setPrizeIndex(index)
    setMustSpin(true)
  }

  function handleStopSpinning() {
    setMustSpin(false)
    onResult(restaurants[prizeIndex])
  }

  return (
    <div className="flex flex-col items-center gap-6">
      
      {restaurants.length < 2 ? (
        <p className="text-gray-400 text-sm">Add at least 2 restaurants to spin</p>
      ) : (
        <SpinWheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeIndex}
          data={data}
          onStopSpinning={handleStopSpinning}
          backgroundColors={COLORS}
          textColors={['#ffffff']}
          outerBorderColor="#1f2937"
          outerBorderWidth={8}
          innerRadius={20}
          radiusLineColor="#1f2937"
          radiusLineWidth={2}
          fontSize={13}
          perpendicularText={false}
        />
      )}

      <button
        onClick={handleSpin}
        disabled={mustSpin || restaurants.length < 2}
        className={`px-10 py-4 rounded-full text-lg font-bold transition-all ${
          mustSpin || restaurants.length < 2
            ? 'bg-gray-700 text-gray-500 cursor-default'
            : 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg hover:shadow-orange-500/30'
        }`}
      >
        {mustSpin ? 'Spinning...' : 'SPIN 🍴'}
      </button>

      {/* Wheel slot list */}
      <div className="w-full flex flex-col gap-2">
        {restaurants.map((r, i) => (
          <div
            key={r.id}
            className="flex items-center gap-3 bg-gray-900 rounded-lg px-3 py-2"
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-sm text-white flex-1 truncate">{r.name}</span>
          </div>
        ))}
      </div>

    </div>
  )
}