import React, { useState, useEffect, useRef } from 'react';

const TenderRenderFinalSet = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [appState, setAppState] = useState('login'); // 'login', 'loading', 'app'
  const [frame, setFrame] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [logoTransition, setLogoTransition] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 120);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Handle loading progress
  useEffect(() => {
    if (appState === 'loading') {
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => setAppState('app'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 60);
      return () => clearInterval(progressInterval);
    }
  }, [appState]);

  const handleLogin = () => {
    setLogoTransition(true);
    setTimeout(() => {
      setAppState('loading');
      setLoadingProgress(0);
    }, 600);
  };

  const resetDemo = () => {
    setAppState('login');
    setLogoTransition(false);
    setLoadingProgress(0);
  };

  // TenderRender color palette
  const theme = darkMode ? {
    bg: '#1a2634',
    bgCard: '#243447',
    bgCardAlt: '#2d3e50',
    bgInput: '#1a2634',
    border: '#3d5a73',
    borderFocus: '#2a9d8f',
    text: '#f0f4f8',
    textMuted: '#8fa4b8',
    textBody: '#c8d4e0',
    primary: '#2a9d8f',
    primaryLight: '#3dbdad',
    accent: '#e76f51',
    accentLight: '#f4a460',
    success: '#4caf50',
    cream: '#2d3e50',
    inputBg: '#1a2634',
  } : {
    bg: '#faf8f5',
    bgCard: '#ffffff',
    bgCardAlt: '#f5f3f0',
    bgInput: '#ffffff',
    border: '#d4cfc5',
    borderFocus: '#2a9d8f',
    text: '#2d3436',
    textMuted: '#6b7c8a',
    textBody: '#4a5568',
    primary: '#2a9d8f',
    primaryLight: '#3dbdad',
    accent: '#e76f51',
    accentLight: '#f4a460',
    success: '#4caf50',
    cream: '#faf8f5',
    inputBg: '#ffffff',
  };

  // ===== COMBINED LOGO COMPONENT =====
  // StrideShift LG with TenderRender below
  
  const CombinedLogo = ({ size = 'large', animated = false, showPixelBoot = false }) => {
    const sizes = {
      medium: { icon: 48, ssTitle: 11, ssSubtitle: 7, trTitle: 10, gap: 6 },
      large: { icon: 64, ssTitle: 14, ssSubtitle: 9, trTitle: 12, gap: 8 },
      xlarge: { icon: 80, ssTitle: 18, ssSubtitle: 11, trTitle: 14, gap: 10 },
    };
    const s = sizes[size];

    const revealProgress = ((frame) % 40) / 40;
    const pixelSize = Math.max(3, Math.floor(s.icon / 16));
    
    const pixels = [
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,1,0,0,0,0,1,1,0],
      [1,1,0,0,0,0,0,0,1,1],
      [1,0,0,0,1,1,0,0,0,1],
      [1,0,0,1,1,1,1,0,0,1],
      [1,0,0,1,1,1,1,0,0,1],
      [1,0,0,0,1,1,0,0,0,1],
      [1,1,0,0,0,0,0,0,1,1],
      [0,1,1,0,0,0,0,1,1,0],
      [0,0,1,1,1,1,1,1,0,0],
    ];
    
    const totalPixels = pixels.flat().filter(p => p === 1).length;
    const visiblePixels = Math.floor(revealProgress * totalPixels);
    let pixelCount = 0;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: s.gap,
      }}>
        {/* Logo Icon / Pixel Boot */}
        <div style={{
          width: s.icon,
          height: s.icon,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Static circle logo */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: `${Math.max(3, s.icon/14)}px solid ${theme.primary}`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: showPixelBoot ? 0 : 1,
            transform: showPixelBoot ? 'scale(0.8)' : 'scale(1)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}>
            <div style={{
              width: s.icon * 0.4,
              height: s.icon * 0.4,
              background: theme.primary,
              borderRadius: '50%',
            }} />
          </div>

          {/* Pixel boot animation */}
          <div style={{
            position: 'absolute',
            opacity: showPixelBoot ? 1 : 0,
            transform: showPixelBoot ? 'scale(1)' : 'scale(1.2)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
            display: 'grid',
            gridTemplateColumns: `repeat(10, ${pixelSize}px)`,
            gap: 1,
          }}>
            {pixels.flat().map((pixel, i) => {
              if (pixel === 1) pixelCount++;
              const isVisible = pixel === 1 && pixelCount <= visiblePixels;
              return (
                <div key={i} style={{
                  width: pixelSize,
                  height: pixelSize,
                  background: isVisible ? theme.primary : `${theme.primary}20`,
                  transition: 'background 0.05s',
                }} />
              );
            })}
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: s.ssTitle,
            color: theme.primary,
            letterSpacing: '2px',
          }}>STRIDESHIFT</div>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: s.ssSubtitle,
            color: theme.textMuted,
            letterSpacing: '3px',
            marginTop: 4,
          }}>GLOBAL</div>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: s.trTitle,
            letterSpacing: '1px',
            marginTop: s.gap + 4,
          }}>
            <span style={{ color: theme.primary }}>TENDER</span>
            <span style={{ color: theme.accent }}>RENDER</span>
          </div>
        </div>
      </div>
    );
  };

  // ===== HEADER LOGO (for app state) =====
  
  const HeaderLogo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 36,
        height: 36,
        border: `3px solid ${theme.primary}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 14,
          height: 14,
          background: theme.primary,
          borderRadius: '50%',
        }} />
      </div>
      <div>
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 10,
          color: theme.primary,
          letterSpacing: '1px',
        }}>STRIDESHIFT</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 2,
        }}>
          <span style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 6,
            color: theme.textMuted,
            letterSpacing: '2px',
          }}>GLOBAL</span>
          <span style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 8,
            letterSpacing: '1px',
          }}>
            <span style={{ color: theme.primary }}>TENDER</span>
            <span style={{ color: theme.accent }}>RENDER</span>
          </span>
        </div>
      </div>
    </div>
  );

  // ===== LOGIN SCREEN =====
  
  const LoginScreen = () => (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: 380,
        background: theme.bgCard,
        border: `4px solid ${theme.primary}`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top racing stripe */}
        <div style={{
          height: 8,
          background: `repeating-linear-gradient(90deg, ${theme.accent} 0px, ${theme.accent} 12px, ${theme.cream} 12px, ${theme.cream} 24px)`,
        }} />

        <div style={{ padding: '40px 32px' }}>
          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <CombinedLogo size="large" showPixelBoot={logoTransition} />
          </div>

          {/* Tagline */}
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 7,
            color: theme.textMuted,
            textAlign: 'center',
            marginBottom: 32,
            letterSpacing: 1,
          }}>AI-POWERED TENDER ANALYSIS</div>

          {/* Divider */}
          <div style={{
            height: 3,
            background: `linear-gradient(90deg, transparent 0%, ${theme.border} 20%, ${theme.border} 80%, transparent 100%)`,
            marginBottom: 28,
          }} />

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Username */}
            <div>
              <label style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 7,
                color: theme.textMuted,
                display: 'block',
                marginBottom: 8,
                letterSpacing: 1,
              }}>USERNAME</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: theme.inputBg,
                border: `3px solid ${theme.border}`,
                padding: '0 12px',
                transition: 'border-color 0.2s',
              }}>
                <span style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 10,
                  color: theme.primary,
                  marginRight: 10,
                }}>▸</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username..."
                  style={{
                    flex: 1,
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 9,
                    color: theme.text,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '14px 0',
                    letterSpacing: 1,
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 7,
                color: theme.textMuted,
                display: 'block',
                marginBottom: 8,
                letterSpacing: 1,
              }}>PASSWORD</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: theme.inputBg,
                border: `3px solid ${theme.border}`,
                padding: '0 12px',
              }}>
                <span style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 10,
                  color: theme.primary,
                  marginRight: 10,
                }}>▸</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  style={{
                    flex: 1,
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 9,
                    color: theme.text,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '14px 0',
                    letterSpacing: 1,
                  }}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={logoTransition}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 11,
                color: '#ffffff',
                background: logoTransition 
                  ? theme.textMuted 
                  : `linear-gradient(180deg, ${theme.primary} 0%, ${theme.primaryLight} 50%, ${theme.primary} 100%)`,
                border: `4px solid ${logoTransition ? theme.textMuted : theme.primary}`,
                padding: '16px 24px',
                cursor: logoTransition ? 'default' : 'pointer',
                marginTop: 8,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s',
                boxShadow: logoTransition ? 'none' : `0 4px 0 0 ${theme.accent}`,
                transform: logoTransition ? 'translateY(4px)' : 'translateY(0)',
              }}
            >
              {logoTransition ? 'LOGGING IN...' : 'START GAME'}
            </button>

            {/* Forgot password */}
            <div style={{
              textAlign: 'center',
              marginTop: 8,
            }}>
              <span style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 6,
                color: theme.accent,
                cursor: 'pointer',
                letterSpacing: 1,
              }}>FORGOT PASSWORD?</span>
            </div>
          </div>
        </div>

        {/* Bottom racing stripe */}
        <div style={{
          height: 8,
          background: `repeating-linear-gradient(90deg, ${theme.cream} 0px, ${theme.cream} 12px, ${theme.accent} 12px, ${theme.accent} 24px)`,
        }} />

        {/* Corner decorations */}
        {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h], i) => (
          <div key={i} style={{
            position: 'absolute',
            [v]: v === 'top' ? 8 : 8,
            [h]: -4,
            width: 16,
            height: 16,
            borderTop: v === 'top' ? 'none' : `4px solid ${theme.accent}`,
            borderBottom: v === 'bottom' ? 'none' : `4px solid ${theme.accent}`,
            borderLeft: h === 'left' ? `4px solid ${theme.accent}` : 'none',
            borderRight: h === 'right' ? `4px solid ${theme.accent}` : 'none',
          }} />
        ))}
      </div>
    </div>
  );

  // ===== LOADING SCREEN =====
  
  const LoadingScreen = () => {
    const revealProgress = ((frame) % 40) / 40;
    const pixelSize = 6;
    
    const pixels = [
      [0,0,1,1,1,1,1,1,0,0],
      [0,1,1,0,0,0,0,1,1,0],
      [1,1,0,0,0,0,0,0,1,1],
      [1,0,0,0,1,1,0,0,0,1],
      [1,0,0,1,1,1,1,0,0,1],
      [1,0,0,1,1,1,1,0,0,1],
      [1,0,0,0,1,1,0,0,0,1],
      [1,1,0,0,0,0,0,0,1,1],
      [0,1,1,0,0,0,0,1,1,0],
      [0,0,1,1,1,1,1,1,0,0],
    ];
    
    const totalPixels = pixels.flat().filter(p => p === 1).length;
    const visiblePixels = Math.floor(revealProgress * totalPixels);
    let pixelCount = 0;

    return (
      <div style={{
        minHeight: '100vh',
        background: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 360,
          background: theme.bgCard,
          border: `4px solid ${theme.primary}`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top stripe */}
          <div style={{
            height: 6,
            background: `repeating-linear-gradient(90deg, ${theme.accent} 0px, ${theme.accent} 10px, ${theme.cream} 10px, ${theme.cream} 20px)`,
          }} />

          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            {/* Pixel boot animation */}
            <div style={{
              display: 'inline-grid',
              gridTemplateColumns: `repeat(10, ${pixelSize}px)`,
              gap: 1,
              marginBottom: 24,
            }}>
              {pixels.flat().map((pixel, i) => {
                if (pixel === 1) pixelCount++;
                const isVisible = pixel === 1 && pixelCount <= visiblePixels;
                return (
                  <div key={i} style={{
                    width: pixelSize,
                    height: pixelSize,
                    background: isVisible ? theme.primary : `${theme.primary}20`,
                    transition: 'background 0.05s',
                  }} />
                );
              })}
            </div>

            {/* Logo text */}
            <div style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 14,
              color: theme.primary,
              letterSpacing: '2px',
              marginBottom: 4,
            }}>STRIDESHIFT</div>
            <div style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 8,
              color: theme.textMuted,
              letterSpacing: '3px',
              marginBottom: 12,
            }}>GLOBAL</div>
            <div style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 11,
              letterSpacing: '1px',
              marginBottom: 32,
            }}>
              <span style={{ color: theme.primary }}>TENDER</span>
              <span style={{ color: theme.accent }}>RENDER</span>
            </div>

            {/* Progress bar */}
            <div style={{
              background: theme.bgCardAlt,
              border: `3px solid ${theme.border}`,
              padding: 4,
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 14 }).map((_, i) => {
                  const filled = i < Math.floor((loadingProgress / 100) * 14);
                  return (
                    <div key={i} style={{
                      flex: 1,
                      height: 14,
                      background: filled ? theme.primary : `${theme.primary}15`,
                      transition: 'background 0.1s',
                    }} />
                  );
                })}
              </div>
            </div>

            {/* Loading text */}
            <div style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 8,
              color: theme.textMuted,
            }}>
              {loadingProgress < 100 
                ? `LOADING${'.'.repeat((Math.floor(frame / 8) % 4))}`
                : 'READY!'
              }
            </div>
            <div style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              color: theme.accent,
              marginTop: 8,
            }}>{loadingProgress}%</div>
          </div>

          {/* Bottom stripe */}
          <div style={{
            height: 6,
            background: `repeating-linear-gradient(90deg, ${theme.cream} 0px, ${theme.cream} 10px, ${theme.accent} 10px, ${theme.accent} 20px)`,
          }} />
        </div>
      </div>
    );
  };

  // ===== APP SCREEN =====
  
  const AppScreen = () => (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
    }}>
      {/* Header */}
      <header style={{
        background: theme.bgCard,
        borderBottom: `4px solid ${theme.primary}`,
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
      }}>
        {/* Top racing stripe */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `repeating-linear-gradient(90deg, ${theme.accent} 0px, ${theme.accent} 8px, ${theme.cream} 8px, ${theme.cream} 16px)`,
        }} />

        <HeaderLogo />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 7,
              padding: '8px 12px',
              background: 'transparent',
              border: `2px solid ${theme.border}`,
              color: theme.textMuted,
              cursor: 'pointer',
            }}
          >
            {darkMode ? '☀' : '☾'}
          </button>
          <button
            onClick={resetDemo}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 7,
              padding: '8px 12px',
              background: theme.accent,
              border: `2px solid ${theme.accent}`,
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{
        padding: 48,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 14,
          color: theme.primary,
          marginBottom: 16,
        }}>WELCOME TO TENDERRENDER</div>
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 8,
          color: theme.textMuted,
          marginBottom: 32,
        }}>LOGIN SUCCESSFUL - DEMO COMPLETE</div>
        
        <div style={{
          display: 'inline-block',
          padding: '24px 32px',
          background: theme.bgCard,
          border: `3px solid ${theme.border}`,
        }}>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 8,
            color: theme.textMuted,
            marginBottom: 12,
          }}>CLICK LOGOUT TO RESTART DEMO</div>
          <div style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 7,
            color: theme.accent,
          }}>▸ {darkMode ? 'DARK' : 'LIGHT'} MODE ACTIVE</div>
        </div>
      </main>
    </div>
  );

  // ===== SHOWCASE SECTION (below the demo) =====

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 48 }}>
      <div style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 10,
        color: theme.primary,
        marginBottom: 20,
        paddingBottom: 10,
        borderBottom: `3px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ color: theme.accent }}>▶</span>
        {title}
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        alignItems: 'flex-start',
      }}>
        {children}
      </div>
    </div>
  );

  const Variant = ({ label, children, bg = null }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{
        background: bg || theme.bgCard,
        border: `3px solid ${theme.border}`,
        padding: 20,
        minWidth: 160,
        minHeight: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {children}
      </div>
      <span style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 6,
        color: theme.textMuted,
        textAlign: 'center',
      }}>{label}</span>
    </div>
  );

  return (
    <div style={{ background: theme.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />

      {/* Interactive Demo */}
      {appState === 'login' && <LoginScreen />}
      {appState === 'loading' && <LoadingScreen />}
      {appState === 'app' && <AppScreen />}

      {/* Component Showcase */}
      <div style={{
        borderTop: `4px solid ${theme.primary}`,
        padding: 32,
        background: theme.bgCardAlt,
      }}>
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 12,
          color: theme.primary,
          marginBottom: 8,
        }}>COMPONENT REFERENCE</div>
        <div style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 7,
          color: theme.textMuted,
          marginBottom: 32,
        }}>ALL LOGO VARIANTS FOR TENDERRENDER</div>

        <Section title="COMBINED LOGOS (STACKED)">
          <Variant label="MEDIUM"><CombinedLogo size="medium" /></Variant>
          <Variant label="LARGE"><CombinedLogo size="large" /></Variant>
          <Variant label="X-LARGE"><CombinedLogo size="xlarge" /></Variant>
        </Section>

        <Section title="HEADER LOGO">
          <Variant label="APP HEADER"><HeaderLogo /></Variant>
        </Section>

        <Section title="RACING STRIPE VARIANTS">
          <Variant label="STRIDESHIFT" bg="transparent">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              background: theme.bgCard,
              border: `3px solid ${theme.primary}`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 5,
                background: `repeating-linear-gradient(90deg, ${theme.accent} 0px, ${theme.accent} 8px, ${theme.cream} 8px, ${theme.cream} 16px)`,
              }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
                background: `repeating-linear-gradient(90deg, ${theme.cream} 0px, ${theme.cream} 8px, ${theme.accent} 8px, ${theme.accent} 16px)`,
              }} />
              <div style={{
                width: 28, height: 28,
                border: `3px solid ${theme.primary}`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 10, height: 10, background: theme.primary, borderRadius: '50%' }} />
              </div>
              <div>
                <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 9, color: theme.primary, letterSpacing: 1 }}>STRIDESHIFT</div>
                <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6, color: theme.textMuted, letterSpacing: 2, marginTop: 2 }}>GLOBAL</div>
              </div>
            </div>
          </Variant>
          <Variant label="TENDERRENDER" bg="transparent">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              background: theme.bgCard,
              border: `3px solid ${theme.primary}`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 5,
                background: `repeating-linear-gradient(90deg, ${theme.accent} 0px, ${theme.accent} 8px, ${theme.cream} 8px, ${theme.cream} 16px)`,
              }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
                background: `repeating-linear-gradient(90deg, ${theme.cream} 0px, ${theme.cream} 8px, ${theme.accent} 8px, ${theme.accent} 16px)`,
              }} />
              <div style={{
                width: 28, height: 28,
                border: `3px solid ${theme.primary}`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 10, height: 10, background: theme.primary, borderRadius: '50%' }} />
              </div>
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 9, letterSpacing: 1 }}>
                <span style={{ color: theme.primary }}>TENDER</span>
                <span style={{ color: theme.accent }}>RENDER</span>
              </div>
            </div>
          </Variant>
        </Section>

        <Section title="PIXEL BOOT LOADER">
          <Variant label="ANIMATED">
            <CombinedLogo size="medium" showPixelBoot={true} />
          </Variant>
        </Section>
      </div>
    </div>
  );
};

export default TenderRenderFinalSet;