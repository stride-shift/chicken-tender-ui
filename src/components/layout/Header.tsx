import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PixelBox, PixelStrip, Logo } from '@/components/ui'
import { useAuth } from '@/features/auth'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const {
    availableClients,
    clientCode,
    setActiveClient,
    isStrideShift,
    profile,
    logout
  } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
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

  return (
    <PixelBox color="#2a9d8f" bgColor="#ffffff" className="sticky top-0 z-40">
      {/* Racing stripe - coral/cream pattern */}
      <PixelStrip colors={['#e76f51', '#faf8f5']} segments={80} />

      <header className="h-16 flex items-center px-4">
        {/* Burger menu */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-[#2a9d8f22] transition-colors rounded"
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

        {/* Logo */}
        <div className="ml-4">
          <Logo size="md" showParentBrand={true} />
        </div>

        {/* Breadcrumb - current page */}
        {pageName && (
          <div className="ml-6 flex items-center gap-2">
            <span
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 10,
                color: '#6b7c8a',
              }}
            >
              {'>'}
            </span>
            <span
              className="px-3 py-1"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 9,
                color: '#ffffff',
                background: 'linear-gradient(180deg, #3dbdad 0%, #2a9d8f 100%)',
                boxShadow: '0 3px 0 #1a6b6b',
                letterSpacing: '1px',
              }}
            >
              {pageName.toUpperCase()}
            </span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Current client badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 8,
            background: '#faf8f5',
            border: '3px solid #d4cfc5',
            letterSpacing: '1px',
          }}
        >
          <span
            className="w-2 h-2"
            style={{ backgroundColor: clientCode ? '#2a9d8f' : '#e76f51' }}
          />
          <span style={{ color: '#2d3436' }}>
            {availableClients.find((c) => c.client_code === clientCode)?.client_name || 'Select Client'}
          </span>
        </div>

        {/* Profile dropdown */}
        <div className="relative ml-3" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-3 py-2 transition-all hover:bg-[#2a9d8f22] rounded"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 8,
            }}
          >
            {/* User icon */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(180deg, #3dbdad 0%, #2a9d8f 100%)',
                boxShadow: '0 2px 0 #1a6b6b',
              }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            {/* Dropdown arrow */}
            <svg
              className={`w-3 h-3 text-[#2a9d8f] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isProfileOpen && (
            <div
              className="absolute right-0 mt-2 w-64 z-50"
              style={{
                background: '#faf8f5',
                border: '4px solid #2a9d8f',
                boxShadow: '4px 4px 0 #1a6b6b',
              }}
            >
              {/* User info */}
              <div className="px-4 py-3 border-b-2 border-[#d4cfc5]">
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 8,
                    color: '#2d3436',
                    lineHeight: '1.6',
                  }}
                >
                  <div className="truncate">{profile?.display_name || 'User'}</div>
                  {isStrideShift && (
                    <div className="mt-1" style={{ color: '#2a9d8f', fontSize: 7 }}>
                      STRIDESHIFT ADMIN
                    </div>
                  )}
                </div>
              </div>

              {/* Client selector for StrideShift */}
              {isStrideShift && availableClients.length > 0 && (
                <div className="px-4 py-3 border-b-2 border-[#d4cfc5]">
                  <div
                    style={{
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: 7,
                      color: '#6b7c8a',
                      marginBottom: 8,
                    }}
                  >
                    SELECT CLIENT
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {availableClients.map((client) => (
                      <button
                        key={client.client_code}
                        onClick={() => {
                          setActiveClient(client.client_code)
                          setIsProfileOpen(false)
                        }}
                        className="w-full text-left px-2 py-1.5 hover:bg-[#2a9d8f22] transition-colors flex items-center gap-2"
                        style={{
                          fontFamily: '"Press Start 2P", monospace',
                          fontSize: 7,
                          color: client.client_code === clientCode ? '#2a9d8f' : '#2d3436',
                          background: client.client_code === clientCode ? '#2a9d8f22' : 'transparent',
                        }}
                      >
                        <span
                          className="w-2 h-2 flex-shrink-0"
                          style={{
                            backgroundColor: client.client_code === clientCode ? '#2a9d8f' : '#d4cfc5',
                          }}
                        />
                        <span className="truncate">{client.client_name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Logout */}
              <div className="px-4 py-3">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 font-bold tracking-wider transition-all hover:translate-y-0.5 active:translate-y-1"
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 8,
                    color: '#ffffff',
                    background: 'linear-gradient(180deg, #f87171 0%, #ef4444 50%, #dc2626 100%)',
                    boxShadow: '0 4px 0 #991b1b, inset 0 2px 0 rgba(255,255,255,0.3)',
                    borderRadius: '4px',
                    letterSpacing: '1px',
                  }}
                >
                  LOGOUT
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </PixelBox>
  )
}
