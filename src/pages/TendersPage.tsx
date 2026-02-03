import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TenderListPanel, TenderDetailPanel } from '@/features/tenders'
import { useSidebar } from '@/contexts/SidebarContext'

export function TendersPage() {
  const { tenderId } = useParams()
  const navigate = useNavigate()
  const { collapseSidebar } = useSidebar()

  // Track whether we've already auto-collapsed the sidebar on first tender click
  const hasAutoCollapsed = useRef(false)

  const selectedTenderId = tenderId ? parseInt(tenderId, 10) : null

  const handleSelectTender = (id: number) => {
    // Auto-collapse sidebar on first tender click only
    if (!hasAutoCollapsed.current) {
      collapseSidebar()
      hasAutoCollapsed.current = true
    }
    navigate(`/tenders/${id}`)
  }

  return (
    <div className="grid grid-cols-[380px_1fr] gap-3 h-[calc(100vh-7rem)]">
      {/* Left panel - Tender list */}
      <TenderListPanel
        selectedTenderId={selectedTenderId}
        onSelectTender={handleSelectTender}
      />

      {/* Right panel - Tender detail */}
      <TenderDetailPanel tenderId={selectedTenderId} />
    </div>
  )
}
