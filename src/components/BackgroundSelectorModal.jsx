import React from 'react';
import { X, Image as ImageIcon, Video, Check } from 'lucide-react';
import { ASSETS } from './BackgroundMedia';

export const BackgroundSelectorModal = ({
  isOpen,
  onClose,
  activeBgId,
  onSelectBg
}) => {
  if (!isOpen) return null;

  return (
    <div className="glass-modal-backdrop" onClick={onClose}>
      <div
        className="liquid-glass-card w-full max-w-2xl p-6 relative overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20">
              <ImageIcon className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-wide">Background Atmosphere</h3>
              <p className="text-xs text-white/60">Choose video loop or aesthetic artwork from asset collection (1-10)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/15 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-96 overflow-y-auto pr-1">
          {ASSETS.map((asset) => {
            const isSelected = asset.id === activeBgId;
            return (
              <div
                key={asset.id}
                onClick={() => {
                  onSelectBg(asset.id);
                  onClose();
                }}
                className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg scale-[1.02]'
                    : 'border-white/15 hover:border-white/40 hover:scale-[1.02]'
                }`}
              >
                {/* Thumbnail */}
                <div className="w-full h-28 bg-black/50 relative overflow-hidden">
                  {asset.type === 'video' ? (
                    <video
                      src={asset.src}
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={asset.src}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold tracking-wider flex items-center gap-1 border border-white/10">
                    {asset.type === 'video' ? (
                      <Video className="w-3 h-3 text-cyan-300" />
                    ) : (
                      <ImageIcon className="w-3 h-3 text-amber-300" />
                    )}
                    <span className="uppercase">{asset.type} #{asset.id}</span>
                  </div>

                  {/* Selected Indicator Checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-cyan-400 text-gray-900 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Footer Title */}
                <div className="p-2.5 bg-black/40 backdrop-blur-md border-t border-white/10">
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
