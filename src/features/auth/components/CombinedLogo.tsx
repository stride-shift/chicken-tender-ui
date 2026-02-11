import React from 'react';
import { PixelBootLoader } from './PixelBootLoader';

type CombinedLogoSize = 'medium' | 'large' | 'xlarge';

interface CombinedLogoProps {
  size?: CombinedLogoSize;
  showPixelBoot?: boolean;
}

// Gold Executive color palette
const theme = {
  primary: '#17171c',
  accent: '#f0b429',
  textMuted: '#555568',
  cream: '#faf8f5',
};

const CombinedLogo: React.FC<CombinedLogoProps> = ({ size = 'large', showPixelBoot = false }) => {
  const sizes = {
    medium: { icon: 48, ssTitle: 11, ssSubtitle: 7, trTitle: 10, gap: 6 },
    large: { icon: 64, ssTitle: 14, ssSubtitle: 9, trTitle: 12, gap: 8 },
    xlarge: { icon: 80, ssTitle: 18, ssSubtitle: 11, trTitle: 14, gap: 10 },
  };
  const s = sizes[size];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: s.gap,
      }}
    >
      {/* Circle Icon / Pixel Boot - with crossfade transition */}
      <div
        style={{
          width: s.icon,
          height: s.icon,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Static circle logo */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: `${Math.max(3, s.icon / 14)}px solid ${theme.primary}`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: showPixelBoot ? 0 : 1,
            transform: showPixelBoot ? 'scale(0.8)' : 'scale(1)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
        >
          <div
            style={{
              width: s.icon * 0.4,
              height: s.icon * 0.4,
              background: theme.accent,
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Pixel boot animation */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: showPixelBoot ? 1 : 0,
            transform: showPixelBoot ? 'scale(1)' : 'scale(1.2)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
        >
          <PixelBootLoader
            size={size === 'xlarge' ? 'large' : size === 'large' ? 'medium' : 'small'}
            color={theme.primary}
          />
        </div>
      </div>

      {/* Text Stack */}
      <div style={{ textAlign: 'center' }}>
        {/* STRIDESHIFT - near-black */}
        <div
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: s.ssTitle,
            color: theme.primary,
            letterSpacing: '0.5px',
            fontWeight: 600,
          }}
        >
          STRIDESHIFT
        </div>

        {/* GLOBAL - muted, smaller */}
        <div
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: s.ssSubtitle,
            color: theme.textMuted,
            letterSpacing: '1px',
            marginTop: 4,
            fontWeight: 500,
          }}
        >
          GLOBAL
        </div>

        {/* TENDER (near-black) + RENDER (gold) */}
        <div
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: s.trTitle,
            letterSpacing: '0.5px',
            marginTop: s.gap + 4,
            fontWeight: 600,
          }}
        >
          <span style={{ color: theme.primary }}>TENDER</span>
          <span style={{ color: theme.accent }}>RENDER</span>
        </div>
      </div>
    </div>
  );
};

export default CombinedLogo;
