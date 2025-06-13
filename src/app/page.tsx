'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { fetchPlaces } from './lib/fetchPlaces'
import ReactMarkdown from 'react-markdown'
import { transformAiMarkdown } from './lib/transformAiMarkdown'

export default function Home() {
  const [destination, setDestination] = useState('')

  const { mutate, data, isPending } = useMutation({
    mutationFn: fetchPlaces,
  })

  const finalOutput = transformAiMarkdown(data, destination)

  const handleSubmit = () => {
    if (destination.trim()) {
      mutate(destination)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-100 to-pink-200 flex flex-col items-center justify-center p-6 text-center text-black">
      <h1 className="text-4xl font-bold mb-4">🌍 Travel Genie</h1>
      <input
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Enter a city (e.g. Tokyo)"
        className="p-3 rounded border w-full max-w-md mb-4 text-lg"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit()
          }
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-semibold"
      >
        {isPending ? 'Vibing...' : 'Show Me Ideas ✨'}
      </button>

      {data && (
        <div className="result-content whitespace-pre-wrap text-left mt-6 max-w-xl bg-white bg-opacity-60 p-4 rounded-xl shadow">
          <ReactMarkdown
            components={{
              a: ({ ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                />
              ),
            }}
          >
            {finalOutput}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
