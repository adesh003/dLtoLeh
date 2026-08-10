import React from 'react';

export const ASSETS = [
  { id: 1, type: 'video', src: '/asset/1.mp4', title: 'Aesthetic Alley Loop' },
  { id: 2, type: 'video', src: '/asset/2.mp4', title: 'Chai Stall Sunset' },
  { id: 3, type: 'video', src: '/asset/3.mp4', title: 'City Lights Motion' },
  { id: 4, type: 'video', src: '/asset/4.mp4', title: 'Midnight Chill Lounge' },
  { id: 5, type: 'video', src: '/asset/5.mp4', title: 'Rainy Rooftop Vibe' },
  { id: 6, type: 'image', src: '/asset/6.png', title: 'Deluxe Saloon Art (Original)' },
  { id: 7, type: 'image', src: '/asset/7.png', title: 'Retro Street Illustration' },
  { id: 8, type: 'image', src: '/asset/8.png', title: 'Desi Nostalgia View' },
  { id: 10, type: 'video', src: '/asset/10.mp4', title: 'Sunset Saloon Chill' },
];

export const BackgroundMedia = ({ bgId }) => {
  const currentAsset = ASSETS.find(a => a.id === bgId) || ASSETS[0];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-none">
      {currentAsset.type === 'video' ? (
        <video
          key={currentAsset.src}
          src={currentAsset.src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-700 opacity-95 scale-[1.01]"
        />
      ) : (
        <img
          key={currentAsset.src}
          src={currentAsset.src}
          alt={currentAsset.title}
          className="w-full h-full object-cover transition-opacity duration-700 opacity-95 scale-[1.01]"
        />
      )}

      {/* Subtle Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
    </div>
  );
};

export default BackgroundMedia;
