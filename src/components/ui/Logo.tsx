interface LogoProps {
  /** Size variant for different contexts */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show STRIDESHIFT GLOBAL text */
  showParentBrand?: boolean;
}

const sizes = {
  sm: {
    icon: 28,
    iconBorder: 2,
    iconDot: 10,
    strideshift: 8,
    global: 5,
    tenderrender: 7,
    gap: 8,
  },
  md: {
    icon: 36,
    iconBorder: 3,
    iconDot: 14,
    strideshift: 10,
    global: 6,
    tenderrender: 8,
    gap: 12,
  },
  lg: {
    icon: 48,
    iconBorder: 3,
    iconDot: 18,
    strideshift: 12,
    global: 7,
    tenderrender: 10,
    gap: 14,
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
                fontFamily: '"Press Start 2P", monospace',
                fontSize: s.strideshift,
                color: '#2a9d8f',
                letterSpacing: '1px',
              }}
            >
              STRIDESHIFT
            </div>
            <div
              className="flex items-center"
              style={{ gap: 8, marginTop: 2 }}
            >
              <span
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: s.global,
                  color: '#6b7c8a',
                  letterSpacing: '2px',
                }}
              >
                GLOBAL
              </span>
              <span
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: s.tenderrender,
                  letterSpacing: '1px',
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
              fontFamily: '"Press Start 2P", monospace',
              fontSize: s.tenderrender,
              letterSpacing: '1px',
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
