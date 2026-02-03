import { NavLink } from 'react-router-dom'
import { PixelBox } from '@/components/ui'

interface SidebarProps {
  collapsed: boolean
}

// Animation type for each nav item - adds variety
type IconAnimation = 'bounce' | 'wiggle' | 'pop'

const navItems: {
  to: string
  label: string
  icon: React.ReactNode
  animation: IconAnimation
}[] = [
  {
    to: '/',
    label: 'Dashboard',
    animation: 'bounce',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    to: '/tenders',
    label: 'Tenders',
    animation: 'wiggle',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    to: '/rubric',
    label: 'Rubric',
    animation: 'pop',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
]

// Map animation types to CSS classes
const animationClasses: Record<IconAnimation, string> = {
  bounce: 'group-hover:animate-arcade-bounce',
  wiggle: 'group-hover:animate-arcade-wiggle',
  pop: 'group-hover:animate-arcade-pop',
}

export function Sidebar({ collapsed }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-[4.5rem] h-[calc(100vh-4.5rem)] transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <PixelBox color="#2d8f8f" bgColor="#ffffff" className="h-full">
        <nav className="p-3 space-y-2">
          {/* Section label with diamond marker */}
          {!collapsed && (
            <div className="px-3 py-2 text-xs font-mono tracking-wider text-[#78716c] uppercase">
              <span className="text-[#c75d32] mr-2">◆</span>
              Navigation
            </div>
          )}

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 transition-all font-mono text-sm tracking-wide rounded-md ${
                  collapsed ? 'justify-center' : ''
                } ${isActive ? 'nav-active-pulse' : 'hover:bg-[#4ecdc4]/10'}`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(180deg, #4ecdc4 0%, #2d8f8f 100%)',
                      boxShadow: '0 3px 0 #1a5f5f',
                      color: '#ffffff',
                    }
                  : {
                      color: '#1a3a4a',
                    }
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex-shrink-0 transition-all duration-200 ${
                      animationClasses[item.animation]
                    } ${
                      isActive
                        ? 'animate-arcade-float drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]'
                        : 'group-hover:scale-110 group-hover:text-[#2d8f8f]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className={`transition-all duration-200 ${
                      isActive
                        ? 'text-white font-bold'
                        : 'group-hover:text-[#2d8f8f] group-hover:translate-x-0.5'
                    }`}>
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </PixelBox>
    </aside>
  )
}
