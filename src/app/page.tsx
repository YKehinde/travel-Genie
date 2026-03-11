'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { fetchPlaces } from './lib/fetchPlaces'
import { generateGygLink } from './lib/generateGygLink'
import type { Activity } from './types'

const MAX_HISTORY = 5

function ActivityCard({ activity, destination }: { activity: Activity; destination: string }) {
  const bookingUrl = generateGygLink(destination, activity.name)
  return (
    <div className="bg-white/75 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/60 dark:border-white/10 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl leading-none" role="img" aria-label={activity.name}>
          {activity.emoji}
        </span>
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-snug">{activity.name}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1">{activity.description}</p>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 self-start inline-flex items-center gap-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1"
      >
        Book now <span aria-hidden="true">→</span>
      </a>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="bg-white/75 rounded-2xl p-5 shadow-sm border border-white/60 motion-safe:animate-pulse"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>
      <div className="mt-4 h-8 bg-gray-200 rounded-full w-28" />
    </div>
  )
}

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const autoSearched = useRef(false)

  const { mutate, data, isPending, error, isError, reset } = useMutation({
    mutationFn: fetchPlaces,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('travelgenie:history')
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  // Auto-search from URL on first load
  useEffect(() => {
    if (autoSearched.current) return
    const dest = searchParams.get('destination')
    if (dest) {
      autoSearched.current = true
      setDestination(dest)
      mutate(dest)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveToHistory = (dest: string) => {
    const updated = [dest, ...history.filter((s) => s.toLowerCase() !== dest.toLowerCase())].slice(
      0,
      MAX_HISTORY,
    )
    setHistory(updated)
    try {
      localStorage.setItem('travelgenie:history', JSON.stringify(updated))
    } catch {}
  }

  const runSearch = (dest: string) => {
    const trimmed = dest.trim()
    if (!trimmed || isPending) return
    reset()
    const params = new URLSearchParams()
    params.set('destination', trimmed)
    router.replace(`?${params.toString()}`, { scroll: false })
    saveToHistory(trimmed)
    mutate(trimmed)
  }

  const handleSubmit = () => runSearch(destination)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {}
  }

  const errorMessage =
    error instanceof Error ? error.message : 'Something went wrong. Please try again.'

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 flex flex-col">
      {/* Hero */}
      <header className="text-center pt-16 pb-10 px-6">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
          🌍 Travel Genie
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-sm mx-auto">
          Discover what to do in any city, instantly.
        </p>
      </header>

      {/* Search & results */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pb-16">
        {/* Input row */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="flex gap-2">
          <input
            type="search"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter a city (e.g. Tokyo)"
            aria-label="Destination city"
            autoComplete="off"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-900 placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 text-base"
          />
          <button
            type="submit"
            disabled={isPending || !destination.trim()}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap"
          >
            {isPending ? 'Finding…' : 'Explore ✨'}
          </button>
        </form>

        {/* Recent searches */}
        {history.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 items-center">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Recent:
            </span>
            {history.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => {
                  setDestination(dest)
                  runSearch(dest)
                }}
                className="px-3 py-1 text-sm bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 rounded-full text-gray-600 dark:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                {dest}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            role="alert"
            className="mt-6 text-red-700 bg-red-50 border border-red-200 rounded-xl p-4 text-sm"
          >
            {errorMessage}
          </div>
        )}

        {/* Skeleton */}
        {isPending && (
          <div
            aria-busy="true"
            aria-label="Loading activity suggestions"
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {data && !isPending && (
          <>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map((activity) => (
                <ActivityCard key={activity.name} activity={activity} destination={destination} />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 bg-white/80 hover:bg-white text-sm text-gray-600 font-medium transition-colors shadow-sm"
              >
                {copied ? '✓ Link copied!' : '🔗 Share these results'}
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-500 border-t border-white/40 dark:border-white/10">
        Powered by AI · Activity links via GetYourGuide
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}
