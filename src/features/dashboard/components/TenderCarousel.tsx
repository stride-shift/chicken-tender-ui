import { useState, useEffect, useCallback } from 'react'
import { useRelevantTenders } from '../hooks/useRelevantTenders'
import { TenderCarouselCard } from './TenderCarouselCard'
import { LoadingState } from '@/components/shared/LoadingState'

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
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h2 className="font-serif font-semibold text-foreground mb-4">Featured Tenders</h2>
        <LoadingState variant="list" count={3} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h2 className="font-serif font-semibold text-foreground mb-4">Featured Tenders</h2>
        <div className="rounded-lg border border-destructive bg-destructive/5 px-4 py-3">
          <p className="font-semibold text-destructive">Error loading tenders</p>
          <p className="text-sm mt-1 text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  if (tenders.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h2 className="font-serif font-semibold text-foreground mb-4">Featured Tenders</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>No relevant tenders at this time.</p>
        </div>
      </div>
    )
  }

  const showNavigation = tenders.length > visibleCount

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-20">
        <h2 className="font-serif font-semibold text-foreground">Featured Tenders</h2>

        {/* Navigation controls */}
        <div className="flex items-center gap-2">
          {/* Expand/Collapse toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-border bg-background hover-lift"
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
                className="w-10 h-10 flex items-center justify-center text-lg text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-border bg-background hover-lift"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={goNext}
                className="w-10 h-10 flex items-center justify-center text-lg text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-border bg-background hover-lift"
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

          {/* Dot indicators */}
          {showNavigation && (
            <div className="flex justify-center gap-2 mt-4 relative z-20">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
