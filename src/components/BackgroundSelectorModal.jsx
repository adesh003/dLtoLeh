import React, { useState } from 'react';
import { X, Image as ImageIcon, Video, Check, Play } from 'lucide-react';
import { ASSETS } from './BackgroundMedia';

export const BackgroundSelectorModal = ({
  isOpen,
  onClose,
  activeBgId,
  onSelectBg
}) => {
  const [hoveredId, setHoveredId] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="glass-modal-backdrop animate-fadeIn" onClick={onClose}>
      <div
        className="liquid-glass-card w-full max-w-2xl p-6 relative overflow-hidden text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Highlights */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 shadow-inner">
              <ImageIcon className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-wide">Atmosphere & Visuals</h3>
              <p className="text-xs text-white/60">Choose video loop or scenic artwork from asset library (1-10)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/15 text-white/70 hover:text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[60vh] overflow-y-auto pr-1 relative z-10 custom-scrollbar">
          {ASSETS.map((asset) => {
            const isSelected = asset.id === activeBgId;
            const isHovered = hoveredId === asset.id;

            return (
              <div
                key={asset.id}
                onMouseEnter={() => setHoveredId(asset.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  onSelectBg(asset.id);
                  onClose();
                }}
                className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg scale-[1.02]'
                    : 'border-white/15 hover:border-white/40 hover:scale-[1.02]'
                }`}
                style={{ backgroundColor: asset.theme || '#111115' }}
              >
                {/* Media Preview Container */}
                <div className="w-full h-28 bg-black/60 relative overflow-hidden flex items-center justify-center">
                  {asset.type === 'video' ? (
                    <video
                      src={asset.src}
                      muted
                      loop
                      playsInline
                      preload="none"
                      ref={(el) => {
                        if (el) {
                          if (isHovered || isSelected) {
                            el.play().catch(() => {});
                          } else {
                            el.pause();
                            el.currentTime = 0;
                          }
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={asset.src}
                      alt={asset.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Play Indicator on Hover for Video */}
                  {asset.type === 'video' && !isHovered && !isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-70 group-hover:opacity-0 transition-opacity">
                      <div className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                        <Play className="w-3.5 h-3.5 text-white/90 fill-white/80" />
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-semibold tracking-wider flex items-center gap-1 border border-white/15 shadow-sm">
                    {asset.type === 'video' ? (
                      <Video className="w-3 h-3 text-cyan-300" />
                    ) : (
                      <ImageIcon className="w-3 h-3 text-amber-300" />
                    )}
                    <span className="uppercase">{asset.type} #{asset.id}</span>
                  </div>

                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-cyan-400 text-gray-900 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Footer Title */}
                <div className="p-2.5 bg-black/60 backdrop-blur-md border-t border-white/10">
                  <p className="text-xs font-semibold truncate text-white/90 group-hover:text-white">
                    {asset.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelectorModal;
