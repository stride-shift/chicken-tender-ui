interface TenderDetailTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TABS = ['Opportunity', 'AI Summary', 'Evaluation', 'Documents', 'Changes'] as const

export function TenderDetailTabs({ activeTab, onTabChange }: TenderDetailTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`
            rounded-md px-3 py-1 text-sm font-medium transition-all
            ${activeTab === tab
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
