import { useLocation, useNavigate } from 'react-router-dom'
import { getClientCode } from '@/lib/supabase'
import { PixelBox, PixelStrip, ArcadeButton } from '@/components/ui'
import { useAuth } from '@/features/auth'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAuth()
  const clientCode = getClientCode()

  const handleLogout = () => {
    auth.logout()
    navigate('/login')
  }

  // Get the current page name based on the route
  const getPageName = () => {
    const path = location.pathname
    if (path === '/') return 'Dashboard'
    if (path.startsWith('/tenders')) return 'Tenders'
    if (path === '/rubric') return 'Rubric'
    return ''
  }

  const pageName = getPageName()

  const isActive = (page: string) => pageName === page

  return (
    <PixelBox color="#c75d32" bgColor="#ffffff" className="sticky top-0 z-40">
      <PixelStrip colors={['#c75d32', '#2d8f8f']} segments={80} />
      <header className="h-14 flex items-center px-4">
        {/* Burger menu */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-[#2d8f8f22] transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-5 h-5 text-[#1a3a4a]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Brand area with gradient */}
        <div
          className="ml-4 px-4 py-1 font-mono tracking-wider"
          style={{
            background: 'linear-gradient(180deg, #4ecdc4 0%, #2d8f8f 100%)',
          }}
        >
          <span className="text-[#1a3a4a] font-bold text-lg">TENDER</span>
          <span className="text-[#e8e4dc] font-bold text-lg">RENDER</span>
        </div>

        {/* Navigation items with arcade styling */}
        <div className="ml-6 flex items-center gap-2">
          {pageName && (
            <>
              <span className="text-[#1a3a4a44] font-mono">{'>'}</span>
              <button
                className={`px-3 py-1 font-mono text-sm tracking-wider transition-all ${
                  isActive(pageName)
                    ? 'text-[#e8e4dc]'
                    : 'text-[#78716c] hover:text-[#1a3a4a]'
                }`}
                style={isActive(pageName) ? {
                  background: 'linear-gradient(180deg, #4ecdc4 0%, #2d8f8f 100%)',
                  boxShadow: '0 3px 0 #1a5f5f',
                } : {}}
              >
                {pageName.toUpperCase()}
              </button>
            </>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Client indicator - subtle badge on light bg */}
        <div
          className="flex items-center gap-2 px-3 py-1 font-mono text-xs tracking-wider bg-stone-100 border-2 border-stone-200"
        >
          <span
            className="w-2 h-2"
            style={{
              backgroundColor: '#2d8f8f',
            }}
          />
          <span className="text-[#1a3a4a] font-bold">{clientCode}</span>
        </div>

        {/* Logout button */}
        <ArcadeButton
          variant="danger"
          size="sm"
          onClick={handleLogout}
          className="ml-3"
        >
          LOGOUT
        </ArcadeButton>
      </header>
    </PixelBox>
  )
}
