import { useState, useEffect } from 'react';
import { GridCanvas } from './GridCanvas';

export function Screensaver() {
  const [paused, setPaused] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          setPaused((p) => !p);
          break;
        case 'f':
        case 'F':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;
        case 'h':
        case 'H':
          setUiVisible((v) => !v);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cursor auto-hide on inactivity
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleMouseMove = () => {
      setUiVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setUiVisible(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', cursor: uiVisible ? 'default' : 'none', position: 'relative' }}>
      {/* Seamless 2D Grid Canvas with integrated text transformation */}
      <GridCanvas paused={paused} />

      {/* Minimal pause indicator only when paused */}
      {paused && (
        <div className="pause-indicator">PAUSED</div>
      )}
      
      <div className="vignette"></div>
    </div>
  );
}
