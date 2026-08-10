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
      onVolumeChange(previousVolume.current || 0.85);
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

  const handleTouchSeek = (e) => {
    if (!progressBarRef.current || !duration || !e.touches || !e.touches[0]) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX;
    const pos = Math.max(0, Math.min(1, (touchX - rect.left) / rect.width));
    onSeek(pos * duration);
  };

  return (
    <div className="player-bar-container select-none">
      {/* Mobile Top Row: Track Artwork & Info + Time */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-2.5 min-w-0 sm:max-w-[220px] md:max-w-[270px]">
        {/* Album Artwork */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative group flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden border border-white/25 shadow-lg relative bg-black/40">
              {currentTrack?.albumArt ? (
                <img
                  src={currentTrack.albumArt}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110 rotate-1' : 'scale-100'}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-rose-900/60">
                  <Music className="w-5 h-5 text-white/70" />
                </div>
              )}
            </div>
            {isPlaying && (
              <div className="absolute -inset-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-md -z-10 animate-pulse" />
            )}
          </div>

          {/* Title & Artist */}
          <div className="flex flex-col truncate min-w-0">
            <div className="flex items-center gap-1 truncate">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate tracking-wide leading-snug">
                {currentTrack?.title || 'Delhi to Ladakh Highway Vibe'}
              </h4>
              <YouTubeMusicIcon size={13} className="flex-shrink-0 text-red-500" />
            </div>
            <p className="text-[11px] sm:text-xs text-white/60 truncate font-medium mt-0.5">
              {currentTrack?.artist || 'YouTube Playlist'}
            </p>
          </div>
        </div>

        {/* Mobile-only compact time badge */}
        <div className="sm:hidden text-[10px] font-mono text-white/60 flex-shrink-0 bg-white/10 px-2 py-0.5 rounded-md">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Middle Section: Progress Bar */}
      <div className="w-full sm:flex-1 flex flex-col justify-center px-0.5 sm:px-2 min-w-0 sm:min-w-[140px]">
        <div
          ref={progressBarRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchSeek}
          className="relative flex items-center w-full group py-1 sm:py-2 cursor-pointer touch-none"
        >
          {hoverTime !== null && (
            <div
              className="absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/20 text-[10px] font-mono text-white shadow-lg pointer-events-none z-30 hidden sm:block"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          <div className="w-full h-1.5 sm:h-2 rounded-full bg-white/15 overflow-hidden relative group-hover:h-2 sm:group-hover:h-2.5 transition-all">
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
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-amber-300 shadow-[0_0_10px_rgba(255,255,255,0.9)] pointer-events-none transition-transform group-hover:scale-125 z-10"
            style={{ left: `calc(${progressPercentage}% - 7px)` }}
          />
        </div>

        {/* Desktop time display */}
        <div className="hidden sm:flex items-center justify-between text-[11px] font-semibold text-white/70 tracking-wider mt-0.5 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span className="text-white/40 font-mono">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls Row (Mobile & Desktop) */}
      <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2.5 flex-shrink-0 w-full sm:w-auto pt-0.5 sm:pt-0">
        {/* Shuffle */}
        <button
          onClick={onToggleShuffle}
          className={`p-2 rounded-full transition-all ${isShuffle ? 'text-amber-300 bg-white/15 shadow-sm' : 'text-white/60 hover:text-white'}`}
          title="Shuffle"
        >
          <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Previous Track */}
        <button
          onClick={onPrevTrack}
          className="p-2 text-white/80 hover:text-white transition-transform active:scale-90"
          title="Previous Track"
        >
          <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        </button>

        {/* Play / Pause Primary Button */}
        <button
          onClick={onPlayPauseToggle}
          className="play-btn-circle"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-gray-900" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-gray-900 translate-x-0.5" />
          )}
        </button>

        {/* Next Track */}
        <button
          onClick={onNextTrack}
          className="p-2 text-white/80 hover:text-white transition-transform active:scale-90"
          title="Next Track"
        >
          <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        </button>

        {/* Repeat */}
        <button
          onClick={onToggleRepeat}
          className={`p-2 rounded-full transition-all ${isRepeat ? 'text-amber-300 bg-white/15 shadow-sm' : 'text-white/60 hover:text-white'}`}
          title="Repeat"
        >
          <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Backgrounds Gallery Modal Button */}
        <button
          onClick={onOpenPlaylistModal}
          className="p-2 text-white/70 hover:text-white transition-colors relative"
          title="Atmosphere & Visuals"
        >
          <ListMusic className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        {/* Volume / Mute Button */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            onClick={handleMuteToggle}
            className="p-2 text-white/70 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Desktop volume hover popup */}
          {showVolumeSlider && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2.5 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-xl hidden sm:flex items-center justify-center animate-fadeIn">
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
