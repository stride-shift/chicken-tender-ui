interface LogoProps {
  /** Size variant for different contexts */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show STRIDESHIFT GLOBAL text */
  showParentBrand?: boolean;
}

const sizes = {
  sm: {
    icon: 28,
    iconBorder: 2,
    iconDot: 10,
    strideshift: 11,
    global: 9,
    tenderrender: 10,
    gap: 8,
  },
  md: {
    icon: 36,
    iconBorder: 3,
    iconDot: 14,
    strideshift: 13,
    global: 10,
    tenderrender: 12,
    gap: 12,
  },
  lg: {
    icon: 44,
    iconBorder: 3,
    iconDot: 16,
    strideshift: 15,
    global: 11,
    tenderrender: 14,
    gap: 14,
  },
  xl: {
    icon: 52,
    iconBorder: 4,
    iconDot: 20,
    strideshift: 18,
    global: 13,
    tenderrender: 16,
    gap: 16,
  },
};

export function Logo({ size = 'md', showParentBrand = true }: LogoProps) {
  const s = sizes[size];

  return (
    <div className="flex items-center" style={{ gap: s.gap }}>
      {/* Circular icon */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: s.icon,
          height: s.icon,
          border: `${s.iconBorder}px solid #2a9d8f`,
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: s.iconDot,
            height: s.iconDot,
            backgroundColor: '#2a9d8f',
          }}
        />
      </div>

      {/* Text */}
      <div>
        {showParentBrand && (
          <>
            <div
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontSize: s.strideshift,
                fontWeight: 700,
                color: '#2a9d8f',
                letterSpacing: '0.5px',
                lineHeight: 1.1,
              }}
            >
              STRIDESHIFT
            </div>
            <div
              className="flex items-center"
              style={{ gap: 6, marginTop: 1 }}
            >
              <span
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  fontSize: s.global,
                  fontWeight: 500,
                  color: '#6b7c8a',
                  letterSpacing: '1px',
                }}
              >
                GLOBAL
              </span>
              <span
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  fontSize: s.tenderrender,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                <span style={{ color: '#2a9d8f' }}>TENDER</span>
                <span style={{ color: '#e76f51' }}>RENDER</span>
              </span>
            </div>
          </>
        )}
        {!showParentBrand && (
          <span
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontSize: s.tenderrender,
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            <span style={{ color: '#2a9d8f' }}>TENDER</span>
            <span style={{ color: '#e76f51' }}>RENDER</span>
          </span>
        )}
      </div>
    </div>
  );
}
