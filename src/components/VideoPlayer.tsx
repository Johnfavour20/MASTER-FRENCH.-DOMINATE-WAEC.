import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl: string
  title?: string
  thumbnail?: string
}

export default function VideoPlayer({ videoUrl, title = "Video Lesson", thumbnail }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch((error) => {
              console.error('Video play error:', error)
              setIsPlaying(false)
            })
        } else {
          setIsPlaying(true)
        }
      }
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
      setHasError(false)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    if (videoRef.current) {
      videoRef.current.volume = vol
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
        setIsFullscreen(false)
      } else {
        videoRef.current.requestFullscreen?.().catch(err => {
          console.log('Fullscreen request failed:', err)
        })
        setIsFullscreen(true)
      }
    }
  }

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
      setIsPlaying(false)
      videoRef.current.pause()
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-black group">
      <div className="relative w-full bg-black aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnail}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('Video load error:', e)
            setIsPlaying(false)
            setIsLoading(false)
            setHasError(true)
          }}
          crossOrigin="anonymous"
          preload="metadata"
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Error Message */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <div className="bg-red-500/20 border border-red-500 text-white px-6 py-4 rounded-xl text-center">
              <p className="text-sm font-semibold">⚠️ Erreur de chargement vidéo</p>
              <p className="text-xs text-red-200 mt-1">Veuillez vérifier l'URL de la vidéo</p>
            </div>
          </div>
        )}

        {/* Play Button Overlay (when not playing) */}
        {!isPlaying && !hasError && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group-hover:bg-black/50"
            title="Play video"
          >
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer">
              <Play className="w-8 h-8 fill-black text-black ml-1" />
            </div>
          </button>
        )}

        {/* Player Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-slate-600 rounded-full cursor-pointer appearance-none accent-[#FFD214] hover:h-1.5 transition-all"
            title="Seek video"
          />

          <div className="flex items-center justify-between mt-3">
            {/* Left Controls: Play, Time, Volume */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 fill-white" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-slate-600 rounded-full cursor-pointer appearance-none accent-[#FFD214]"
                title="Volume"
              />

              <span className="text-xs font-mono text-white font-bold whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls: Reset, Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                onClick={resetVideo}
                className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="Reset video"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
