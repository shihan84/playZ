'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, SkipBack, SkipForward, Square, Volume2, VolumeX, MonitorSpeaker } from 'lucide-react'

interface NowPlaying {
  id: string
  title: string
  duration: number
  currentTime: number
  type: 'video' | 'live' | 'cg'
}

interface NextUp {
  id: string
  title: string
  duration: number
  type: 'video' | 'live'
}

export default function PlayoutDashboard() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(100)
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({
    id: '1',
    title: 'News Bulletin - January 15, 2024',
    duration: 1800,
    currentTime: 872,
    type: 'video'
  })
  const [nextUp, setNextUp] = useState<NextUp>({
    id: '2',
    title: 'Weather Report',
    duration: 300,
    type: 'video'
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (nowPlaying.currentTime / nowPlaying.duration) * 100

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <Card className="bg-slate-900 border-slate-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-video bg-black flex items-center justify-center relative">
            {/* Simulated video preview */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MonitorSpeaker className="h-16 w-16 text-purple-400 mx-auto" />
                <p className="text-slate-400 text-sm">Live Preview</p>
              </div>
            </div>

            {/* Overlay info */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
              <Badge className="bg-red-600 animate-pulse">LIVE</Badge>
            </div>

            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-sm">
              CH01
            </div>

            {/* Timecode overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div className="text-white font-mono text-lg">
                {formatTime(nowPlaying.currentTime)} / {formatDuration(nowPlaying.duration)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Now Playing Info */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={nowPlaying.type === 'live' ? 'bg-red-600' : 'bg-purple-600'}>
                  {nowPlaying.type === 'live' ? 'LIVE' : 'FILE'}
                </Badge>
                <h2 className="text-white text-xl font-semibold">{nowPlaying.title}</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>Duration: {formatDuration(nowPlaying.duration)}</span>
                <span>Elapsed: {formatDuration(nowPlaying.currentTime)}</span>
                <span>Remaining: {formatDuration(nowPlaying.duration - nowPlaying.currentTime)}</span>
              </div>
            </div>

            {/* Transport Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-12 rounded-full border-slate-600"
                onClick={() => console.log('Previous')}
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              {isPlaying ? (
                <Button
                  variant="default"
                  size="lg"
                  className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => setIsPlaying(false)}
                >
                  <Pause className="h-6 w-6" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="h-6 w-6 ml-1" />
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                className="h-12 w-12 rounded-full border-slate-600"
                onClick={() => console.log('Next')}
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button
                variant="destructive"
                size="lg"
                className="h-12 w-12 rounded-full"
                onClick={() => setIsPlaying(false)}
              >
                <Square className="h-5 w-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-400 hover:text-white"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <div className="w-24">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value))
                    setIsMuted(Number(e.target.value) === 0)
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
              <span className="text-slate-400 text-sm w-8">{volume}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
              {/* Seek handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-all"
                style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Up */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl">▶</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">NEXT UP</p>
                <h3 className="text-white font-semibold">{nextUp.title}</h3>
                <p className="text-slate-400 text-sm">Duration: {formatDuration(nextUp.duration)}</p>
              </div>
            </div>
            <Badge className="bg-blue-600">AUTO-ADVANCE</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}