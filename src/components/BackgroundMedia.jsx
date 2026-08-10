import React, { useState, useEffect, useRef } from 'react';

export const ASSETS = [
  { id: 1, type: 'video', src: '/asset/1.mp4', title: 'Aesthetic Alley Loop', theme: '#1a1024' },
  { id: 2, type: 'video', src: '/asset/2.mp4', title: 'Chai Stall Sunset', theme: '#2a140e' },
  { id: 3, type: 'video', src: '/asset/3.mp4', title: 'City Lights Motion', theme: '#0b1626' },
  { id: 4, type: 'video', src: '/asset/4.mp4', title: 'Midnight Chill Lounge', theme: '#140e21' },
  { id: 5, type: 'video', src: '/asset/5.mp4', title: 'Rainy Rooftop Vibe', theme: '#0f1f24' },
  { id: 6, type: 'image', src: '/asset/6.png', title: 'Deluxe Saloon Art (Original)', theme: '#1c1514' },
  { id: 7, type: 'image', src: '/asset/7.png', title: 'Retro Street Illustration', theme: '#211812' },
  { id: 8, type: 'image', src: '/asset/8.png', title: 'Desi Nostalgia View', theme: '#171922' },
  { id: 10, type: 'video', src: '/asset/10.mp4', title: 'Sunset Saloon Chill', theme: '#29120e' },
];

export const BackgroundMedia = ({ bgId }) => {
  const currentAsset = ASSETS.find(a => a.id === bgId) || ASSETS[0];

  // Primary active asset and previous asset for smooth seamless crossfade
  const [activeAsset, setActiveAsset] = useState(currentAsset);
  const [previousAsset, setPreviousAsset] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeVideoRef = useRef(null);
  const prevVideoRef = useRef(null);

  useEffect(() => {
    if (currentAsset.id !== activeAsset.id) {
      setPreviousAsset(activeAsset);
      setActiveAsset(currentAsset);
      setIsTransitioning(true);
    }
  }, [currentAsset, activeAsset]);

  // Page visibility battery / CPU saver: pause video when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (activeVideoRef.current && !activeVideoRef.current.paused) {
          activeVideoRef.current.pause();
        }
      } else {
        if (activeVideoRef.current && activeVideoRef.current.paused) {
          activeVideoRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle active media ready to display
  const handleActiveLoaded = () => {
    // Media is ready, complete transition after crossfade duration
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousAsset(null);
    }, 700);
    return () => clearTimeout(timer);
  };

  const renderMediaElement = (asset, isIncoming, videoRef) => {
    if (!asset) return null;

    if (asset.type === 'video') {
      return (
        <video
          key={asset.id}
          ref={videoRef}
          src={asset.src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onLoadedData={isIncoming ? handleActiveLoaded : undefined}
          onCanPlay={isIncoming ? handleActiveLoaded : undefined}
          className="w-full h-full object-cover will-change-[opacity,transform] scale-[1.01]"
        />
      );
    }

    return (
      <img
        key={asset.id}
        src={asset.src}
        alt={asset.title}
        decoding="async"
        loading="eager"
        onLoad={isIncoming ? handleActiveLoaded : undefined}
        className="w-full h-full object-cover will-change-[opacity,transform] scale-[1.01]"
      />
    );
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-none"
      style={{ backgroundColor: activeAsset.theme || '#000000' }}
    >
      {/* Underlying Previous Asset (during crossfade) */}
      {previousAsset && isTransitioning && (
        <div className="absolute inset-0 w-full h-full z-0 opacity-100 transition-opacity duration-700">
          {renderMediaElement(previousAsset, false, prevVideoRef)}
        </div>
      )}

      {/* Foreground Active Asset */}
      <div
        className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-700 ease-out ${
          isTransitioning ? 'opacity-95' : 'opacity-95'
        }`}
      >
        {renderMediaElement(activeAsset, true, activeVideoRef)}
      </div>

      {/* Cinematic Vignette & Ambient Gradient Overlays */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)] pointer-events-none" />
    </div>
  );
};

export default BackgroundMedia;
