import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/ui'
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

  const currentClientName = availableClients.find((c) => c.client_code === clientCode)?.client_name || 'Select Client'
  const displayName = profile?.display_name || 'User'

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="h-16 flex items-center px-4">
        {/* Burger menu */}
        <button
          onClick={onMenuClick}
          className="p-2.5 hover:bg-muted transition-colors rounded-lg"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6 text-foreground"
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
          <Logo size="lg" showParentBrand={true} />
        </div>

        {/* Breadcrumb - current page */}
        {pageName && (
          <div className="ml-6 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              /
            </span>
            <span className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-primary">
              {pageName}
            </span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Profile pill button */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full transition-all hover:bg-muted border border-border"
          >
            {/* User avatar */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold bg-primary">
              {displayName.charAt(0).toUpperCase()}
            </div>
            {/* User name and client */}
            <div className="text-left">
              <div className="text-sm text-foreground font-medium leading-tight">
                {displayName}
              </div>
              <div className="text-xs text-muted-foreground leading-tight">
                {currentClientName}
              </div>
            </div>
            {/* Dropdown arrow */}
            <svg
              className={`w-4 h-4 text-muted-foreground transition-transform ml-1 ${isProfileOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 z-50 rounded-lg overflow-hidden bg-card border border-border shadow-lg">
              {/* User info */}
              <div className="px-4 py-3 border-b border-border bg-muted">
                <div className="text-sm text-foreground font-semibold truncate">
                  {displayName}
                </div>
                {isStrideShift && (
                  <div className="mt-0.5 text-xs font-medium text-accent">
                    StrideShift Admin
                  </div>
                )}
              </div>

              {/* Client selector for StrideShift */}
              {isStrideShift && availableClients.length > 0 && (
                <div className="px-4 py-3 border-b border-border">
                  <div className="text-xs font-sans font-semibold text-muted-foreground mb-2">
                    Switch Client
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {availableClients.map((client) => (
                      <button
                        key={client.client_code}
                        onClick={() => {
                          setActiveClient(client.client_code)
                          setIsProfileOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors flex items-center gap-2 text-sm ${
                          client.client_code === clientCode
                            ? 'bg-accent/10 text-accent font-medium'
                            : 'text-foreground'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            client.client_code === clientCode ? 'bg-accent' : 'bg-border'
                          }`}
                        />
                        <span className="truncate">{client.client_name}</span>
                        {client.client_code === clientCode && (
                          <svg className="w-4 h-4 ml-auto text-accent" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Logout */}
              <div className="px-4 py-3">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all text-white bg-destructive hover:bg-destructive/90"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
