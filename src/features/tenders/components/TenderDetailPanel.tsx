import { useState } from 'react'
import { useTenderDetail } from '../hooks/useTenderDetail'
import { TenderDetailHeader } from './TenderDetailHeader'
import { TenderDetailTabs } from './TenderDetailTabs'
import { TenderOpportunityTab } from './TenderOpportunityTab'
import { TenderAISummaryTab } from './TenderAISummaryTab'
import { TenderDetailEval } from './TenderDetailEval'
import { TenderDetailDocs } from './TenderDetailDocs'
import { TenderDetailChanges } from './TenderDetailChanges'
import { useToast } from '@/hooks/useToast'

interface TenderDetailPanelProps {
  tenderId: number | null
}

export function TenderDetailPanel({ tenderId }: TenderDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('Opportunity')
  const { tender, isLoading, error } = useTenderDetail({ tenderId })
  const { addToast } = useToast()

  const handleLifecycleAction = () => {
    addToast('Coming soon — Tender lifecycle management is on the way!', 'info')
  }

  // No tender selected
  if (tenderId === null) {
    return (
      <div className="h-full flex flex-col overflow-hidden bg-background">
        <div className="h-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-muted border border-border rounded-lg">
              <svg
                className="w-8 h-8 text-muted-foreground"
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
            <p className="text-foreground font-semibold">Select a Tender</p>
            <p className="text-body-small text-muted-foreground mt-1">
              Choose from the list to view details
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex flex-col overflow-hidden bg-background">
        <div className="p-6 space-y-6">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-muted/50 rounded w-1/4 animate-pulse" />
              </div>
              <div className="h-8 bg-muted rounded w-24 animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted/50 rounded animate-pulse" />
              ))}
            </div>
          </div>

          {/* Tab bar skeleton */}
          <div className="flex border-b border-border gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-muted rounded w-20 animate-pulse" />
            ))}
          </div>

          {/* Content skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 bg-muted w-32 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 w-full rounded animate-pulse" />
                <div className="h-4 bg-muted/50 w-5/6 rounded animate-pulse" />
                <div className="h-4 bg-muted/50 w-4/6 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col overflow-hidden bg-background">
        <div className="p-6">
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
            <p className="font-semibold">Error Loading Tender</p>
            <p className="text-body-small mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  // Tender not found
  if (!tender) {
    return (
      <div className="h-full flex flex-col overflow-hidden bg-background">
        <div className="h-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-warning/10 border border-warning/30 rounded-lg">
              <svg
                className="w-8 h-8 text-warning"
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
            <p className="text-warning font-semibold">Tender Not Found</p>
            <p className="text-body-small text-muted-foreground mt-1">
              This tender may have been removed
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Success - render tender details with tabs
  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Header section */}
      <div>
        <TenderDetailHeader tender={tender} />
      </div>

      {/* Tabs + Actions row */}
      <div className="px-4 py-2 bg-muted flex items-center justify-between gap-2">
        <TenderDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1 px-2.5 py-1.5 text-label font-semibold rounded-md transition-all
              bg-success/10 text-success border border-success/30
              hover:bg-success/20 hover:border-success/40 active:translate-y-px"
          >
            <span>&#9733;</span> Shortlist
          </button>
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1 px-2.5 py-1.5 text-label font-semibold rounded-md transition-all
              bg-info/10 text-info border border-info/30
              hover:bg-info/20 hover:border-info/40 active:translate-y-px"
          >
            <span>&#9998;</span> Review
          </button>
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1 px-2.5 py-1.5 text-label font-semibold rounded-md transition-all
              bg-warning/10 text-warning border border-warning/30
              hover:bg-warning/20 hover:border-warning/40 active:translate-y-px"
          >
            <span>&#9673;</span> Watch
          </button>
          <button
            onClick={handleLifecycleAction}
            className="flex items-center gap-1 px-2.5 py-1.5 text-label font-semibold rounded-md transition-all
              bg-muted text-muted-foreground border border-border
              hover:bg-muted/80 active:translate-y-px"
          >
            <span>&#10005;</span> Decline
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/50">
        {activeTab === 'Opportunity' && <TenderOpportunityTab tender={tender} />}
        {activeTab === 'AI Summary' && <TenderAISummaryTab tender={tender} />}
        {activeTab === 'Evaluation' && <TenderDetailEval tender={tender} />}
        {activeTab === 'Documents' && <TenderDetailDocs documents={tender.documents} />}
        {activeTab === 'Changes' && <TenderDetailChanges changes={tender.recent_changes} />}
      </div>
    </div>
  )
}
