interface TenderDetailTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TABS = ['Opportunity', 'Evaluation', 'Documents', 'Changes'] as const

export function TenderDetailTabs({ activeTab, onTabChange }: TenderDetailTabsProps) {
  return (
    <div className="flex bg-stone-200 p-0.5 rounded gap-0.5 mx-4">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className="px-3 py-1 font-bold text-xs transition-all"
          style={activeTab === tab ? {
            background: 'linear-gradient(180deg, #4ecdc4 0%, #2d8f8f 100%)',
            color: 'white',
            borderRadius: '3px',
            boxShadow: '0 1px 0 #1a5f5f'
          } : {
            color: '#57534e',
            background: 'transparent'
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
