import React, { useState, useEffect } from 'react';
import { ExternalLink, Image as ImageIcon, Eye, Users } from 'lucide-react';
import { SpotifyIcon } from './SpotifyIcon';
import { YouTubeMusicIcon } from './YouTubeMusicIcon';
import { DEFAULT_PLAYLIST_ID } from '../data/tracks';

export const Header = ({ onOpenBgSelector, activeBgId }) => {
  const [timeString, setTimeString] = useState('');
  const [activeOnlineUsers, setActiveOnlineUsers] = useState(1);
  const [totalVisits, setTotalVisits] = useState(1);

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

  // Track Total Visits & Real - Time Active Users
  useEffect(() => {
    // 1. Total Visitor Count tracking
    try {
      const storedVisits = parseInt(localStorage.getItem('deluxe_total_visits') || '0', 10);
      const isNewSession = !sessionStorage.getItem('deluxe_session_active');

      let newVisitCount = storedVisits;
      if (isNewSession || storedVisits === 0) {
        newVisitCount = storedVisits > 0 ? storedVisits + 1 : 128; // Start baseline visit count
        localStorage.setItem('deluxe_total_visits', newVisitCount.toString());
        sessionStorage.setItem('deluxe_session_active', 'true');
      }
      setTotalVisits(newVisitCount);
    } catch (e) {
      setTotalVisits(1);
    }

    // 2. Real-Time Online Active Users via BroadcastChannel + Storage Heartbeat
    const tabId = 'tab_' + Math.random().toString(36).substring(2, 9);
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('deluxe_live_users_channel') : null;

    const updateActiveUsers = () => {
      const now = Date.now();
      let activeTabs = {};
      try {
        const stored = localStorage.getItem('deluxe_live_tabs');
        if (stored) activeTabs = JSON.parse(stored);
      } catch (e) { }

      // Clean inactive tabs older than 4 seconds
      Object.keys(activeTabs).forEach(id => {
        if (now - activeTabs[id] > 4000) delete activeTabs[id];
      });

      activeTabs[tabId] = now;
      const currentActiveCount = Object.keys(activeTabs).length;
      setActiveOnlineUsers(currentActiveCount);

      try {
        localStorage.setItem('deluxe_live_tabs', JSON.stringify(activeTabs));
      } catch (e) { }

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
        } catch (err) { }
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
      } catch (e) { }
    };
  }, []);

  const defaultYTPlaylistUrl = `https://youtube.com/playlist?list=${DEFAULT_PLAYLIST_ID}`;

  return (
    <header className="absolute top-0 left-0 right-0 p-5 flex items-center justify-between z-30 pointer-events-none">
      {/* Top Left: Live Clock */}
      <div className="pointer-events-auto flex items-center gap-2">
        <div className="liquid-glass-pill text-sm font-semibold tracking-wider opacity-90 hover:opacity-100 shadow-lg">
          <span className="text-white/90">{timeString || '9:37 pm'}</span>
        </div>
      </div>

      {/* Top Center: Real-time Online Badge & Total Visits Badge */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Live Active Online Badge */}
        <div className="liquid-glass-pill px-3.5 py-1.5 text-xs font-medium tracking-wide shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-[pulse-glow_2s_infinite]"></span>
          <span className="text-white font-bold">{activeOnlineUsers}</span>
          <span className="text-white/75 font-normal">online</span>
        </div>

        {/* Total Visits Counter Badge */}
        <div className="liquid-glass-pill px-3 py-1.5 text-xs font-medium tracking-wide shadow-lg border-white/15 hidden sm:inline-flex items-center gap-1.5 text-white/80">
          <Eye className="w-3.5 h-3.5 text-cyan-300" />
          <span className="font-bold text-white">{totalVisits.toLocaleString()}</span>
          <span className="text-white/60">visits</span>
        </div>
      </div>

      {/* Top Right: Spotify, YT Music Playlist & BG Switcher */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        {/* Spotify Liquid Glass Button */}
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="liquid-glass-pill liquid-glass-pill-sm group hover:scale-[1.03]"
          title="Open Spotify"
        >
          <SpotifyIcon size={15} />
          <span className="text-xs font-medium">Spotify</span>
          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* YT Music Default Playlist Liquid Glass Button */}
        <a
          href={defaultYTPlaylistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="liquid-glass-pill liquid-glass-pill-sm group hover:scale-[1.03] bg-red-500/15 border-red-500/30"
          title="Open YouTube Playlist"
        >
          <YouTubeMusicIcon size={15} />
          <span className="text-xs font-medium">YT Playlist</span>
          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Background Selector Button */}
        <button
          onClick={onOpenBgSelector}
          className="liquid-glass-pill liquid-glass-pill-sm border-white/20 hover:scale-[1.03]"
          title="Switch Background Asset (1-10)"
        >
          <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
          <span className="text-xs font-medium">BG #{activeBgId}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
