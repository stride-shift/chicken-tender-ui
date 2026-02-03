import { useState, useEffect, useCallback } from 'react'
import { useRelevantTenders } from '../hooks/useRelevantTenders'
import { TenderCarouselCard } from './TenderCarouselCard'
import { LoadingState } from '@/components/shared/LoadingState'
import { PixelBox } from '@/components/ui'

interface TenderCarouselProps {
  autoScrollInterval?: number
}

export function TenderCarousel({ autoScrollInterval = 5000 }: TenderCarouselProps) {
  const { tenders, isLoading, error } = useRelevantTenders({ limit: 8 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Responsive visible count
  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2)
      } else {
        setVisibleCount(3)
      }
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  const maxIndex = Math.max(0, tenders.length - visibleCount)

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || tenders.length <= visibleCount) return

    const interval = setInterval(goNext, autoScrollInterval)
    return () => clearInterval(interval)
  }, [isPaused, tenders.length, visibleCount, autoScrollInterval, goNext])

  // Reset index when tenders change
  useEffect(() => {
    setCurrentIndex(0)
  }, [tenders.length])

  if (isLoading) {
    return (
      <PixelBox color="#2d8f8f" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-orange-500" />
          <span className="text-xs tracking-widest font-black text-stone-600">FEATURED TENDERS</span>
        </div>
        <LoadingState variant="list" count={3} />
      </PixelBox>
    )
  }

  if (error) {
    return (
      <PixelBox color="#2d8f8f" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-orange-500" />
          <span className="text-xs tracking-widest font-black text-stone-600">FEATURED TENDERS</span>
        </div>
        <div className="bg-red-900/30 border-2 border-red-500 text-red-400 px-4 py-3 font-mono">
          <p className="font-bold">[ERROR] Loading tenders failed</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </PixelBox>
    )
  }

  if (tenders.length === 0) {
    return (
      <PixelBox color="#2d8f8f" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-orange-500" />
          <span className="text-xs tracking-widest font-black text-stone-600">FEATURED TENDERS</span>
        </div>
        <div className="text-center py-8 text-stone-500 font-mono">
          <p>{'>'} No relevant tenders at this time.</p>
        </div>
      </PixelBox>
    )
  }

  const showNavigation = tenders.length > visibleCount

  return (
    <PixelBox color="#2d8f8f" className="p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500" />
          <span className="text-xs tracking-widest font-black text-stone-600">FEATURED TENDERS</span>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center gap-2">
          {/* Expand/Collapse toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 flex items-center justify-center font-black text-lg text-stone-600 active:translate-y-0.5 transition-transform"
            style={{
              background: 'linear-gradient(180deg, #f5f5f4 0%, #e7e5e4 100%)',
              boxShadow: '0 3px 0 #a8a29e',
              borderRadius: '6px'
            }}
            aria-label={isExpanded ? 'Collapse to carousel' : 'Expand to grid'}
            title={isExpanded ? 'Collapse to carousel' : 'Expand to grid'}
          >
            {isExpanded ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </button>

          {/* Carousel navigation arrows */}
          {showNavigation && !isExpanded && (
            <>
              <button
                onClick={goPrev}
                className="w-10 h-10 flex items-center justify-center font-black text-lg text-stone-600 active:translate-y-0.5 transition-transform"
                style={{
                  background: 'linear-gradient(180deg, #f5f5f4 0%, #e7e5e4 100%)',
                  boxShadow: '0 3px 0 #a8a29e',
                  borderRadius: '6px'
                }}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={goNext}
                className="w-10 h-10 flex items-center justify-center font-black text-lg text-stone-600 active:translate-y-0.5 transition-transform"
                style={{
                  background: 'linear-gradient(180deg, #f5f5f4 0%, #e7e5e4 100%)',
                  boxShadow: '0 3px 0 #a8a29e',
                  borderRadius: '6px'
                }}
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>

      {isExpanded ? (
        // Expanded grid view
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-20">
          {tenders.map((tender) => (
            <TenderCarouselCard key={tender.tender_pk} tender={tender} />
          ))}
        </div>
      ) : (
        // Carousel view
        <>
          <div
            className="relative overflow-hidden z-20"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {tenders.map((tender) => (
                <div
                  key={tender.tender_pk}
                  className="flex-shrink-0 px-2 first:pl-0 last:pr-0"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <TenderCarouselCard tender={tender} />
                </div>
              ))}
            </div>
          </div>

          {/* LED-style dot indicators */}
          {showNavigation && (
            <div className="flex justify-center gap-2 mt-4 relative z-20">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="w-3 h-3 rounded-full transition-all"
                  style={{
                    backgroundColor: idx === currentIndex ? '#2d8f8f' : '#d6d3d1',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </PixelBox>
  )
}
