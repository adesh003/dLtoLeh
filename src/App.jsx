import React, { useState, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import BackgroundMedia from './components/BackgroundMedia';
import HindiOverlay from './components/HindiOverlay';
import MusicPlayerBar from './components/MusicPlayerBar';
import BackgroundSelectorModal from './components/BackgroundSelectorModal';
import YouTubeAudioPlayer from './components/YouTubeAudioPlayer';
import { Eye, EyeOff } from 'lucide-react';

// Sequential order of background asset IDs: 1, 2, 3, 4, 5, 6, 7, 8, 10
const BG_SEQUENCE = [1, 2, 3, 4, 5, 6, 7, 8, 10];

function App() {
  // Live Track Metadata received dynamically from YouTube Player
  const [liveTrack, setLiveTrack] = useState({
    title: 'Loading YouTube Playlist...',
    artist: 'YouTube Playlist • PLxS10Q6YmEN...',
    albumArt: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    index: 0
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const [volume, setVolume] = useState(0.85);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);

  // Background asset pointer in sequence 1, 2, 3, 4, 5, 6, 7, 8, 10
  const [bgSeqIndex, setBgSeqIndex] = useState(0);

  // UI Toggles
  const [showOverlayText, setShowOverlayText] = useState(true);
  const [isBgSelectorOpen, setIsBgSelectorOpen] = useState(false);

  // YouTube Player Ref
  const ytPlayerRef = useRef(null);

  const activeBgId = BG_SEQUENCE[bgSeqIndex % BG_SEQUENCE.length];

  // Helper to advance to next background in sequence 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 10
  const advanceToNextBackground = () => {
    setBgSeqIndex(prev => (prev + 1) % BG_SEQUENCE.length);
  };

  const advanceToPrevBackground = () => {
    setBgSeqIndex(prev => (prev === 0 ? BG_SEQUENCE.length - 1 : prev - 1));
  };

  // Dynamic Metadata Update handler from YouTube Player
  const handleMetaDataUpdate = (meta) => {
    if (meta && meta.title) {
      setLiveTrack(meta);
      if (typeof meta.index === 'number' && meta.index >= 0) {
        setBgSeqIndex(meta.index % BG_SEQUENCE.length);
      }
    }
  };

  // Track change callback
  const handleTrackIndexChange = (newTrackIdx) => {
    if (typeof newTrackIdx === 'number' && newTrackIdx >= 0) {
      setBgSeqIndex(newTrackIdx % BG_SEQUENCE.length);
    }
  };

  // Play / Pause Toggle
  const handlePlayPauseToggle = () => {
    if (ytPlayerRef.current) {
      try {
        if (isPlaying) {
          if (ytPlayerRef.current.pauseVideo) ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          if (ytPlayerRef.current.unMute) ytPlayerRef.current.unMute();
          if (ytPlayerRef.current.playVideo) ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch (e) {
        setIsPlaying(!isPlaying);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Next Track -> Advances YouTube video & cycles background 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 10
  const handleNextTrack = () => {
    advanceToNextBackground();

    if (ytPlayerRef.current && ytPlayerRef.current.nextVideo) {
      try {
        ytPlayerRef.current.nextVideo();
      } catch (e) {}
    }
    setIsPlaying(true);
  };

  // Previous Track
  const handlePrevTrack = () => {
    advanceToPrevBackground();

    if (ytPlayerRef.current && ytPlayerRef.current.previousVideo) {
      try {
        ytPlayerRef.current.previousVideo();
      } catch (e) {}
    }
    setIsPlaying(true);
  };

  // Seek handler
  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
    if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      try {
        ytPlayerRef.current.seekTo(newTime, true);
      } catch (e) {}
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden select-none bg-black cursor-default">
      {/* Vercel Analytics */}
      <Analytics />

      {/* Background Media Engine */}
      <BackgroundMedia bgId={activeBgId} />

      {/* YouTube Audio Player Engine */}
      <YouTubeAudioPlayer
        isPlaying={isPlaying}
        volume={volume}
        playerRef={ytPlayerRef}
        onMetaDataUpdate={handleMetaDataUpdate}
        onTrackChange={handleTrackIndexChange}
        onProgressUpdate={(time, dur) => {
          if (time >= 0) setCurrentTime(time);
          if (dur > 0) setDuration(dur);
        }}
        onStateChange={(state) => {
          if (state === 1) setIsPlaying(true);
          else if (state === 2) setIsPlaying(false);
        }}
      />

      {/* Top Header */}
      <Header
        onOpenBgSelector={() => setIsBgSelectorOpen(true)}
        activeBgId={activeBgId}
      />

      {/* Center Devanagari Title ("दिल्ली से लद्दाख") */}
      <HindiOverlay showText={showOverlayText} />

      {/* Floating Bottom Music Player Bar */}
      <MusicPlayerBar
        currentTrack={liveTrack}
        isPlaying={isPlaying}
        onPlayPauseToggle={handlePlayPauseToggle}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        onOpenPlaylistModal={() => setIsBgSelectorOpen(true)}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        isRepeat={isRepeat}
        onToggleRepeat={() => setIsRepeat(!isRepeat)}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={(newVol) => setVolume(newVol)}
      />

      {/* Text Overlay Toggle Button (Above player on mobile, bottom-left on desktop) */}
      <button
        onClick={() => setShowOverlayText(!showOverlayText)}
        className="liquid-glass-pill liquid-glass-pill-sm absolute bottom-[calc(132px+var(--sab))] sm:bottom-6 left-3 sm:left-6 z-30 opacity-75 hover:opacity-100 active:scale-95 shadow-lg transition-all"
        title="Toggle Title Text Overlay"
      >
        {showOverlayText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        <span className="text-[10px] sm:text-[11px] font-medium hidden xs:inline">
          {showOverlayText ? 'Hide Title' : 'Show Title'}
        </span>
      </button>

      {/* Background Asset Switcher Modal */}
      <BackgroundSelectorModal
        isOpen={isBgSelectorOpen}
        onClose={() => setIsBgSelectorOpen(false)}
        activeBgId={activeBgId}
        onSelectBg={(id) => {
          const idx = BG_SEQUENCE.indexOf(id);
          if (idx !== -1) setBgSeqIndex(idx);
        }}
      />
    </div>
  );
}

export default App;
export { App };
