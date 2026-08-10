import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Music,
  ListMusic
} from 'lucide-react';
import { YouTubeMusicIcon } from './YouTubeMusicIcon';

export const MusicPlayerBar = ({
  currentTrack,
  isPlaying,
  onPlayPauseToggle,
  onNextTrack,
  onPrevTrack,
  onOpenPlaylistModal,
  isShuffle,
  onToggleShuffle,
  isRepeat,
  onToggleRepeat,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  const progressBarRef = useRef(null);
  const previousVolume = useRef(volume);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(previousVolume.current || 0.8);
    } else {
      previousVolume.current = volume;
      setIsMuted(true);
      onVolumeChange(0);
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleMouseMove = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  return (
    <div className="player-bar-container select-none">
      {/* Left Section: Album Cover & Track Info */}
      <div className="flex items-center gap-3 min-w-0 max-w-[220px] md:max-w-[270px]">
        {/* Album Artwork */}
        <div className="relative group flex-shrink-0">
          <div className="w-12 h-12 md:w-13 md:h-13 rounded-2xl overflow-hidden border border-white/25 shadow-lg relative bg-black/40">
            {currentTrack?.albumArt ? (
              <img
                src={currentTrack.albumArt}
                alt={currentTrack.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110 rotate-1' : 'scale-100'}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-rose-900/60">
                <Music className="w-6 h-6 text-white/70" />
              </div>
            )}
          </div>
          {isPlaying && (
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-md -z-10 animate-pulse" />
          )}
        </div>

        {/* Title & Artist */}
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-1.5 truncate">
            <h4 className="text-sm font-bold text-white truncate tracking-wide leading-snug">
              {currentTrack?.title || 'Delhi to Ladakh Highway Vibe (Track 1)'}
            </h4>
            <YouTubeMusicIcon size={14} className="flex-shrink-0 text-red-500" />
          </div>
          <p className="text-xs text-white/65 truncate font-medium mt-0.5">
            {currentTrack?.artist || 'YouTube Playlist • PLxS10Q6YmEN...'}
          </p>
        </div>
      </div>

      {/* Middle Section: Progress Bar */}
      <div className="flex-1 flex flex-col justify-center px-1 md:px-3 min-w-[140px]">
        <div
          ref={progressBarRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex items-center w-full group py-2 cursor-pointer"
        >
          {hoverTime !== null && (
            <div
              className="absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/20 text-[10px] font-mono text-white shadow-lg pointer-events-none z-30"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden relative group-hover:h-2.5 transition-all">
            <div
              className="h-full rounded-full transition-all duration-75 relative bg-gradient-to-r from-amber-300 via-rose-400 to-cyan-300 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime || 0}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-amber-300 shadow-[0_0_10px_rgba(255,255,255,0.9)] pointer-events-none transition-transform group-hover:scale-125 z-10"
            style={{ left: `calc(${progressPercentage}% - 8px)` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold text-white/70 tracking-wider mt-0.5 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span className="text-white/40 font-mono">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Section: Controls */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <button
          onClick={onToggleShuffle}
          className={`p-1.5 rounded-full transition-all ${isShuffle ? 'text-amber-300 bg-white/15 shadow-sm' : 'text-white/60 hover:text-white'}`}
          title="Shuffle"
        >
          <Shuffle className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>

        <button
          onClick={onPrevTrack}
          className="p-1.5 text-white/80 hover:text-white transition-transform active:scale-90"
          title="Previous Track"
        >
          <SkipBack className="w-4 h-4 md:w-5 md:h-5 fill-current" />
        </button>

        <button
          onClick={onPlayPauseToggle}
          className="play-btn-circle"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current text-gray-900" />
          ) : (
            <Play className="w-5 h-5 fill-current text-gray-900 translate-x-0.5" />
          )}
        </button>

        <button
          onClick={onNextTrack}
          className="p-1.5 text-white/80 hover:text-white transition-transform active:scale-90"
          title="Next Track"
        >
          <SkipForward className="w-4 h-4 md:w-5 md:h-5 fill-current" />
        </button>

        <button
          onClick={onToggleRepeat}
          className={`p-1.5 rounded-full transition-all hidden sm:block ${isRepeat ? 'text-amber-300 bg-white/15 shadow-sm' : 'text-white/60 hover:text-white'}`}
          title="Repeat"
        >
          <Repeat className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>

        <button
          onClick={onOpenPlaylistModal}
          className="p-1.5 text-white/70 hover:text-white transition-colors relative"
          title="Backgrounds Gallery"
        >
          <ListMusic className="w-4 h-4 md:w-4.5 md:h-4.5" />
        </button>

        <div
          className="relative flex items-center hidden sm:flex"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            onClick={handleMuteToggle}
            className="p-1.5 text-white/70 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {showVolumeSlider && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2.5 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center animate-fadeIn">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setIsMuted(false);
                  onVolumeChange(parseFloat(e.target.value));
                }}
                className="w-20 accent-white cursor-pointer h-1.5 bg-white/30 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerBar;
