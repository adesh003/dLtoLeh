import React, { useState } from 'react';
import { X, Link2, Plus, Music, Check, Disc, Play } from 'lucide-react';
import { SpotifyIcon } from './SpotifyIcon';
import { YouTubeMusicIcon } from './YouTubeMusicIcon';

export const CustomPlaylistModal = ({
  isOpen,
  onClose,
  tracks,
  currentTrackId,
  onSelectTrack,
  onAddCustomTrack
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [artistInput, setArtistInput] = useState('');
  const [activeTab, setActiveTab] = useState('import'); // 'import' | 'playlist'
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  // Helper to extract YouTube video ID from URL
  const extractYTId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const ytId = extractYTId(urlInput);
    let newTrack;

    if (ytId) {
      newTrack = {
        id: `yt-${ytId}-${Date.now()}`,
        title: titleInput.trim() || `YouTube Track (${ytId})`,
        artist: artistInput.trim() || 'YouTube Audio Stream',
        albumArt: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        duration: 240, // 4 mins default
        audioUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1`,
        ytId: ytId,
        source: 'youtube'
      };
    } else {
      // Direct Audio or Spotify URL fallback
      newTrack = {
        id: `custom-${Date.now()}`,
        title: titleInput.trim() || 'Custom Imported Track',
        artist: artistInput.trim() || (urlInput.includes('spotify') ? 'Spotify Custom Track' : 'Web Audio Stream'),
        albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
        duration: 210,
        audioUrl: urlInput.trim(),
        source: urlInput.includes('spotify') ? 'spotify' : 'custom'
      };
    }

    onAddCustomTrack(newTrack);
    setStatusMsg({ type: 'success', text: 'Track successfully added to player!' });
    setUrlInput('');
    setTitleInput('');
    setArtistInput('');

    setTimeout(() => {
      setStatusMsg(null);
      setActiveTab('playlist');
    }, 1200);
  };

  return (
    <div className="glass-modal-backdrop" onClick={onClose}>
      <div
        className="liquid-glass-card w-full max-w-lg p-6 relative overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Specular Glow Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 shadow-inner flex items-center gap-2">
              <SpotifyIcon size={20} />
              <YouTubeMusicIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-wide">Custom Playlist & Links</h3>
              <p className="text-xs text-white/60">Import YouTube or Spotify URLs into your music stream</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/15 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-black/30 p-1 rounded-xl mb-5 border border-white/10">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'import'
                ? 'bg-white/20 text-white shadow-md border border-white/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Add YT / Spotify Link
          </button>
          <button
            onClick={() => setActiveTab('playlist')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'playlist'
                ? 'bg-white/20 text-white shadow-md border border-white/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            Playlist Tracklist ({tracks.length})
          </button>
        </div>

        {/* Tab 1: Import Link Form */}
        {activeTab === 'import' && (
          <form onSubmit={handleAddLink} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 flex items-center justify-between">
                <span>YouTube / Spotify / Audio Stream Link</span>
                <span className="text-[10px] text-emerald-400 font-mono">Supports YT, Spotify & Direct Audio</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste URL (e.g. https://www.youtube.com/watch?v=...)"
                  className="glass-input pr-10"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-70">
                  <YouTubeMusicIcon size={16} />
                  <SpotifyIcon size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Track Title (Optional)
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Mujhse Mohabbat Lofi"
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Artist Name (Optional)
                </label>
                <input
                  type="text"
                  value={artistInput}
                  onChange={(e) => setArtistInput(e.target.value)}
                  placeholder="e.g. Satrang Music"
                  className="glass-input"
                />
              </div>
            </div>

            {statusMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{statusMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-gray-900 bg-white hover:bg-gray-100 shadow-lg hover:shadow-white/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              Add Track to Playlist
            </button>
          </form>
        )}

        {/* Tab 2: Curated & Imported Tracks List */}
        {activeTab === 'playlist' && (
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {tracks.map((track, idx) => {
              const isCurrent = track.id === currentTrackId;
              return (
                <div
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'bg-white/20 border-white/40 shadow-md'
                      : 'bg-black/20 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-semibold text-white/40 w-5 text-center">
                      {idx + 1}
                    </span>
                    <img
                      src={track.albumArt}
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="truncate">
                      <h5 className={`text-sm font-semibold truncate ${isCurrent ? 'text-white' : 'text-white/90'}`}>
                        {track.title}
                      </h5>
                      <p className="text-xs text-white/60 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {track.source === 'youtube' && <YouTubeMusicIcon size={15} />}
                    {track.source === 'spotify' && <SpotifyIcon size={15} />}
                    {isCurrent ? (
                      <span className="text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40">
                        PLAYING
                      </span>
                    ) : (
                      <button className="p-1.5 rounded-full hover:bg-white/20 text-white/70">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
