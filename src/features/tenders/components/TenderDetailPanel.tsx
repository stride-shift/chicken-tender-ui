import { useState } from 'react'
import { useTenderDetail } from '../hooks/useTenderDetail'
import { TenderDetailHeader } from './TenderDetailHeader'
import { TenderDetailTabs } from './TenderDetailTabs'
import { TenderOpportunityTab } from './TenderOpportunityTab'
import { TenderDetailEval } from './TenderDetailEval'
import { TenderDetailDocs } from './TenderDetailDocs'
import { TenderDetailChanges } from './TenderDetailChanges'
import { PixelBox } from '@/components/ui'

interface TenderDetailPanelProps {
  tenderId: number | null
}

export function TenderDetailPanel({ tenderId }: TenderDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('Opportunity')
  const { tender, isLoading, error } = useTenderDetail({ tenderId })

  // No tender selected
  if (tenderId === null) {
    return (
      <PixelBox color="#2d8f8f" className="h-full flex flex-col overflow-hidden" bgColor="#ffffff">
        <div className="h-full flex items-center justify-center p-6 relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-stone-100 border-2 border-stone-300">
              <svg
                className="w-8 h-8 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-stone-600 font-mono font-bold">SELECT A TENDER</p>
            <p className="text-sm text-stone-500 mt-1 font-mono">
              Choose from the list to view details
            </p>
          </div>
        </div>
      </PixelBox>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <PixelBox color="#2d8f8f" className="h-full flex flex-col overflow-hidden" bgColor="#ffffff">
        <div className="p-6 space-y-6 relative z-10">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-6 bg-stone-200 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-stone-100 rounded w-1/4 animate-pulse" />
              </div>
              <div className="h-8 bg-stone-200 rounded w-24 animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-stone-100 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Tab bar skeleton */}
          <div className="flex border-b border-stone-200 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-stone-200 w-20 animate-pulse" />
            ))}
          </div>

          {/* Content skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 bg-stone-200 w-32 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-stone-100 w-full animate-pulse" />
                <div className="h-4 bg-stone-100 w-5/6 animate-pulse" />
                <div className="h-4 bg-stone-100 w-4/6 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </PixelBox>
    )
  }

  // Error state
  if (error) {
    return (
      <PixelBox color="#2d8f8f" className="h-full flex flex-col overflow-hidden" bgColor="#ffffff">
        <div className="p-6 relative z-10">
          <div className="bg-red-50 border-2 border-red-300 text-red-600 px-4 py-3 font-mono">
            <p className="font-bold">ERROR LOADING TENDER</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </PixelBox>
    )
  }

  // Tender not found
  if (!tender) {
    return (
      <PixelBox color="#2d8f8f" className="h-full flex flex-col overflow-hidden" bgColor="#ffffff">
        <div className="h-full flex items-center justify-center p-6 relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-amber-50 border-2 border-amber-300">
              <svg
                className="w-8 h-8 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-amber-600 font-mono font-bold">TENDER NOT FOUND</p>
            <p className="text-sm text-stone-500 mt-1 font-mono">
              This tender may have been removed
            </p>
          </div>
        </div>
      </PixelBox>
    )
  }

  // Success - render tender details with tabs
  return (
    <PixelBox color="#2d8f8f" className="h-full flex flex-col overflow-hidden" bgColor="#ffffff">
      {/* Header section */}
      <div className="relative z-10">
        <TenderDetailHeader tender={tender} />
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 bg-stone-100 relative z-10">
        <TenderDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4 bg-stone-50 relative z-10">
        {activeTab === 'Opportunity' && <TenderOpportunityTab tender={tender} />}
        {activeTab === 'Evaluation' && <TenderDetailEval tender={tender} />}
        {activeTab === 'Documents' && <TenderDetailDocs documents={tender.documents} />}
        {activeTab === 'Changes' && <TenderDetailChanges changes={tender.recent_changes} />}
      </div>
    </PixelBox>
  )
}
