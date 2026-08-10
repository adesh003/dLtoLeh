import React, { useState, useEffect } from 'react';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { SpotifyIcon } from './SpotifyIcon';
import { YouTubeMusicIcon } from './YouTubeMusicIcon';
import { DEFAULT_PLAYLIST_ID } from '../data/tracks';

export const Header = ({ onOpenBgSelector, activeBgId }) => {
  const [timeString, setTimeString] = useState('');
  const [activeOnlineUsers, setActiveOnlineUsers] = useState(1);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTimeString(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-Time Online Active Users via BroadcastChannel + Storage Heartbeat
  useEffect(() => {
    const tabId = 'tab_' + Math.random().toString(36).substring(2, 9);
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('deluxe_live_users_channel') : null;

    const updateActiveUsers = () => {
      const now = Date.now();
      let activeTabs = {};
      try {
        const stored = localStorage.getItem('deluxe_live_tabs');
        if (stored) activeTabs = JSON.parse(stored);
      } catch (e) {}

      // Clean inactive tabs older than 4 seconds
      Object.keys(activeTabs).forEach(id => {
        if (now - activeTabs[id] > 4000) delete activeTabs[id];
      });

      activeTabs[tabId] = now;
      const currentActiveCount = Object.keys(activeTabs).length;
      setActiveOnlineUsers(currentActiveCount);

      try {
        localStorage.setItem('deluxe_live_tabs', JSON.stringify(activeTabs));
      } catch (e) {}

      if (channel) {
        channel.postMessage({ type: 'HEARTBEAT', count: currentActiveCount });
      }
    };

    updateActiveUsers();
    const heartbeatInterval = setInterval(updateActiveUsers, 2000);

    const handleStorageChange = (e) => {
      if (e.key === 'deluxe_live_tabs') {
        try {
          const activeTabs = JSON.parse(e.newValue || '{}');
          setActiveOnlineUsers(Object.keys(activeTabs).length);
        } catch (err) {}
      }
    };

    if (channel) {
      channel.onmessage = (msg) => {
        if (msg.data && msg.data.type === 'HEARTBEAT') {
          updateActiveUsers();
        }
      };
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();

      try {
        const stored = localStorage.getItem('deluxe_live_tabs');
        if (stored) {
          const activeTabs = JSON.parse(stored);
          delete activeTabs[tabId];
          localStorage.setItem('deluxe_live_tabs', JSON.stringify(activeTabs));
        }
      } catch (e) {}
    };
  }, []);

  const defaultYTPlaylistUrl = `https://youtube.com/playlist?list=${DEFAULT_PLAYLIST_ID}`;

  return (
    <header className="absolute top-0 left-0 right-0 p-3 sm:p-5 pt-[calc(10px+var(--sat))] flex items-center justify-between z-30 pointer-events-none gap-2">
      {/* Top Left: Live Clock */}
      <div className="pointer-events-auto flex items-center">
        <div className="liquid-glass-pill liquid-glass-pill-sm sm:liquid-glass-pill text-xs sm:text-sm font-semibold tracking-wider opacity-90 hover:opacity-100 shadow-lg">
          <span className="text-white/90">{timeString || '9:37 pm'}</span>
        </div>
      </div>

      {/* Top Center: Real-time Online Active Badge */}
      <div className="pointer-events-auto flex items-center">
        <div className="liquid-glass-pill liquid-glass-pill-sm sm:liquid-glass-pill px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium tracking-wide shadow-lg">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 inline-block animate-[pulse-glow_2s_infinite]"></span>
          <span className="text-white font-bold">{activeOnlineUsers}</span>
          <span className="text-white/75 font-normal hidden xs:inline">online</span>
        </div>
      </div>

      {/* Top Right: Spotify, YT Music Playlist & BG Switcher */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5">
        {/* Spotify Liquid Glass Button */}
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="liquid-glass-pill liquid-glass-pill-sm group hover:scale-[1.03]"
          title="Open Spotify"
        >
          <SpotifyIcon size={14} />
          <span className="text-[11px] sm:text-xs font-medium hidden md:inline">Spotify</span>
        </a>

        {/* YT Music Default Playlist Liquid Glass Button */}
        <a
          href={defaultYTPlaylistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="liquid-glass-pill liquid-glass-pill-sm group hover:scale-[1.03] bg-red-500/15 border-red-500/30"
          title="Open YouTube Playlist"
        >
          <YouTubeMusicIcon size={14} />
          <span className="text-[11px] sm:text-xs font-medium hidden md:inline">Playlist</span>
        </a>

        {/* Background Selector Button */}
        <button
          onClick={onOpenBgSelector}
          className="liquid-glass-pill liquid-glass-pill-sm border-white/20 hover:scale-[1.03]"
          title="Switch Background Asset (1-10)"
        >
          <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
          <span className="text-[11px] sm:text-xs font-medium">#{activeBgId}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
