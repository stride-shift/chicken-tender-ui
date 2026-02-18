import { useState, useEffect, useCallback } from 'react'
import { useRelevantTenders } from '../hooks/useRelevantTenders'
import { TenderCarouselCard } from './TenderCarouselCard'
import { LoadingState } from '@/components/shared/LoadingState'
import type { TenderListItem } from '@/lib/types'

interface TenderCarouselProps {
  autoScrollInterval?: number
}

function groupTendersByRecency(tenders: TenderListItem[]) {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const newThisWeek: TenderListItem[] = []
  const earlier: TenderListItem[] = []

  for (const t of tenders) {
    if (new Date(t.date_published) >= sevenDaysAgo) {
      newThisWeek.push(t)
    } else {
      earlier.push(t)
    }
  }

  // Sort each group: most recently published first
  const byDateDesc = (a: TenderListItem, b: TenderListItem) =>
    new Date(b.date_published).getTime() - new Date(a.date_published).getTime()

  newThisWeek.sort(byDateDesc)
  earlier.sort(byDateDesc)

  return { newThisWeek, earlier }
}

interface CarouselSectionProps {
  tenders: TenderListItem[]
  title: string
  autoScrollInterval: number
}

function CarouselSection({ tenders, title, autoScrollInterval }: CarouselSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
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

  const showNavigation = tenders.length > visibleCount

  return (
    <div className="mb-6 last:mb-0">
      {/* Section header + nav controls */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-sans font-semibold text-foreground text-lg">{title}</h3>
        <span className="text-caption text-muted-foreground">{tenders.length} tenders</span>
        {showNavigation && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={goPrev}
              className="w-8 h-8 flex items-center justify-center text-lg text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-border bg-background hover-lift"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              className="w-8 h-8 flex items-center justify-center text-lg text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-border bg-background hover-lift"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-x-clip overflow-y-visible py-1"
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
        <div className="flex justify-center gap-2 mt-4">
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
    </div>
  )
}

export function TenderCarousel({ autoScrollInterval = 5000 }: TenderCarouselProps) {
  const { tenders, isLoading, error } = useRelevantTenders({ limit: 12 })
  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h2 className="font-sans font-semibold text-foreground mb-4">Featured Tenders</h2>
        <LoadingState variant="list" count={3} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-sm p-6">
        <h2 className="font-sans font-semibold text-foreground mb-4">Featured Tenders</h2>
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
        <h2 className="font-sans font-semibold text-foreground mb-4">Featured Tenders</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>No relevant tenders at this time.</p>
        </div>
      </div>
    )
  }

  const { newThisWeek, earlier } = groupTendersByRecency(tenders)

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-20">
        <h2 className="font-sans font-semibold text-foreground">Featured Tenders</h2>

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
      </div>

      {isExpanded ? (
        // Expanded grid view
        <div className="relative z-20">
          {newThisWeek.length > 0 && (
            <div className="mb-6 last:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-sans font-semibold text-foreground text-lg">New This Week</h3>
                <span className="text-caption text-muted-foreground">{newThisWeek.length} tenders</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {newThisWeek.map((tender) => (
                  <TenderCarouselCard key={tender.tender_pk} tender={tender} />
                ))}
              </div>
            </div>
          )}

          {earlier.length > 0 && (
            <div className="mb-6 last:mb-0">
              {newThisWeek.length > 0 && (
                <div className="border-t border-border my-6" />
              )}
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-sans font-semibold text-foreground text-lg">Earlier</h3>
                <span className="text-caption text-muted-foreground">{earlier.length} tenders</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {earlier.map((tender) => (
                  <TenderCarouselCard key={tender.tender_pk} tender={tender} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Carousel view
        <div className="relative z-20">
          {newThisWeek.length > 0 && (
            <CarouselSection
              tenders={newThisWeek}
              title="New This Week"
              autoScrollInterval={autoScrollInterval}
            />
          )}

          {newThisWeek.length > 0 && earlier.length > 0 && (
            <div className="border-t border-border my-6" />
          )}

          {earlier.length > 0 && (
            <CarouselSection
              tenders={earlier}
              title="Earlier"
              autoScrollInterval={autoScrollInterval}
            />
          )}
        </div>
      )}
    </div>
  )
}
