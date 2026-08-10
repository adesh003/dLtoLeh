import React, { useState, useEffect, useRef } from 'react';

export const ASSETS = [
  { id: 1, type: 'image', src: '/asset2/1.png', title: 'Mountain Pass Panorama', theme: '#151324' },
  { id: 2, type: 'image', src: '/asset2/2.png', title: 'Himalayan Golden Glow', theme: '#24140e' },
  { id: 3, type: 'image', src: '/asset2/3.png', title: 'Ladakh Valley Twilight', theme: '#0d1829' },
  { id: 4, type: 'image', src: '/asset2/4.png', title: 'Desi Saloon Retro Art', theme: '#171021' },
  { id: 5, type: 'image', src: '/asset2/5.png', title: 'Monastery Horizon', theme: '#102126' },
  { id: 6, type: 'image', src: '/asset2/6.png', title: 'Deluxe Saloon Art', theme: '#1c1514' },
  { id: 7, type: 'image', src: '/asset2/7.png', title: 'Retro Street Illustration', theme: '#211812' },
  { id: 8, type: 'image', src: '/asset2/8.png', title: 'Desi Nostalgia View', theme: '#171922' },
  { id: 9, type: 'image', src: '/asset2/9.png', title: 'Highway Solitude', theme: '#1f1520' },
  { id: 10, type: 'image', src: '/asset2/10.jfif', title: 'Sunset Saloon Chill', theme: '#28130e' },
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

  // Handle active media ready to display
  const handleActiveLoaded = () => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousAsset(null);
    }, 600);
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
        <div className="absolute inset-0 w-full h-full z-0 opacity-100 transition-opacity duration-600">
          {renderMediaElement(previousAsset, false, prevVideoRef)}
        </div>
      )}

      {/* Foreground Active Asset */}
      <div
        className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-600 ease-out ${
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
