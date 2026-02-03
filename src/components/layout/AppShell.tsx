import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { PixelStrip } from '@/components/ui'
import { useSidebar } from '@/contexts/SidebarContext'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <div className="min-h-screen bg-[#e8e4dc]">
      <Header onMenuClick={toggleSidebar} />
      <PixelStrip />
      <div className="flex">
        <Sidebar collapsed={isCollapsed} />
        <main
          className={`flex-1 min-w-0 transition-all duration-300 ${
            isCollapsed ? 'ml-16' : 'ml-56'
          }`}
        >
          <div className="p-3">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
