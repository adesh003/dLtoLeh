import React, { useEffect, useRef } from 'react';

export const YOUTUBE_PLAYLIST_ID = 'PLxS10Q6YmENIjQIgRVGa26GYTTzCwAB0E';

export const YouTubeAudioPlayer = ({
  isPlaying,
  volume,
  onStateChange,
  onTrackChange,
  onProgressUpdate,
  onMetaDataUpdate,
  onPlayerReady,
  playerRef
}) => {
  const containerRef = useRef(null);
  const lastVideoIdRef = useRef(null);

  useEffect(() => {
    let intervalId;

    const initPlayer = () => {
      try {
        if (window.YT && window.YT.Player && !playerRef.current) {
          playerRef.current = new window.YT.Player('youtube-audio-frame', {
            height: '200',
            width: '200',
            playerVars: {
              listType: 'playlist',
              list: YOUTUBE_PLAYLIST_ID,
              autoplay: 1,
              controls: 1,
              enablejsapi: 1,
              loop: 1,
              rel: 0
            },
            events: {
              onReady: (event) => {
                try {
                  if (event.target.unMute) event.target.unMute();
                  if (event.target.setVolume) event.target.setVolume(volume * 100);
                  if (isPlaying && event.target.playVideo) event.target.playVideo();
                } catch (e) {}
                if (onPlayerReady) onPlayerReady(event.target);
              },
              onStateChange: (event) => {
                try {
                  if (onStateChange) onStateChange(event.data);
                  
                  // Query real-time video metadata on state change (e.g. when next video starts playing)
                  if (playerRef.current && playerRef.current.getVideoData) {
                    const videoData = playerRef.current.getVideoData();
                    const idx = playerRef.current.getPlaylistIndex ? playerRef.current.getPlaylistIndex() : 0;
                    
                    if (videoData && videoData.video_id && videoData.video_id !== lastVideoIdRef.current) {
                      lastVideoIdRef.current = videoData.video_id;
                      if (onMetaDataUpdate) {
                        onMetaDataUpdate({
                          title: videoData.title || 'YouTube Track',
                          artist: videoData.author || 'YouTube Playlist',
                          albumArt: `https://img.youtube.com/vi/${videoData.video_id}/hqdefault.jpg`,
                          videoId: videoData.video_id,
                          index: idx
                        });
                      }
                      if (onTrackChange) {
                        onTrackChange(idx);
                      }
                    }
                  }
                } catch (e) {}
              }
            }
          });
        }
      } catch (e) {
        console.warn('YouTube Player init warning:', e);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    intervalId = setInterval(() => {
      if (playerRef.current) {
        try {
          // Poll current time & duration
          if (playerRef.current.getCurrentTime) {
            const currentTime = playerRef.current.getCurrentTime() || 0;
            const duration = playerRef.current.getDuration() || 240;
            if (onProgressUpdate) onProgressUpdate(currentTime, duration);
          }

          // Poll metadata if video_id changed
          if (playerRef.current.getVideoData) {
            const videoData = playerRef.current.getVideoData();
            const idx = playerRef.current.getPlaylistIndex ? playerRef.current.getPlaylistIndex() : 0;

            if (videoData && videoData.video_id && videoData.title && videoData.video_id !== lastVideoIdRef.current) {
              lastVideoIdRef.current = videoData.video_id;
              if (onMetaDataUpdate) {
                onMetaDataUpdate({
                  title: videoData.title,
                  artist: videoData.author || 'YouTube Playlist',
                  albumArt: `https://img.youtube.com/vi/${videoData.video_id}/hqdefault.jpg`,
                  videoId: videoData.video_id,
                  index: idx
                });
              }
              if (onTrackChange) {
                onTrackChange(idx);
              }
            }
          }
        } catch (e) {}
      }
    }, 500);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      try {
        if (playerRef.current.setVolume) playerRef.current.setVolume(volume * 100);
        if (volume > 0 && playerRef.current.unMute) playerRef.current.unMute();
      } catch (e) {}
    }
  }, [volume]);

  useEffect(() => {
    if (playerRef.current) {
      try {
        if (isPlaying) {
          if (playerRef.current.unMute) playerRef.current.unMute();
          if (playerRef.current.playVideo) playerRef.current.playVideo();
        } else {
          if (playerRef.current.pauseVideo) playerRef.current.pauseVideo();
        }
      } catch (e) {}
    }
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: '-999px',
        right: '-999px',
        width: '200px',
        height: '200px',
        opacity: 0.001,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: -10
      }}
    >
      <iframe
        id="youtube-audio-frame"
        title="YouTube Audio Player"
        width="200"
        height="200"
        src={`https://www.youtube-nocookie.com/embed/videoseries?si=5YRPK_RmSgBIbipk&list=${YOUTUBE_PLAYLIST_ID}&enablejsapi=1&autoplay=1&loop=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
};

export default YouTubeAudioPlayer;
