'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, SkipBack, SkipForward, Square, Mic, Volume2, Radio, Clock, AlertTriangle, CheckCircle2, Activity, Gauge } from 'lucide-react'

interface AudioLevel {
  left: number
  right: number
  peakLeft: number
  peakRight: number
}

interface SignalMonitor {
  bitrate: number
  fps: number
  droppedFrames: number
  bufferHealth: number
}

export default function BroadcastDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [audioLevels, setAudioLevels] = useState<AudioLevel>({
    left: 0,
    right: 0,
    peakLeft: 0,
    peakRight: 0
  })
  const [signal, setSignal] = useState<SignalMonitor>({
    bitrate: 5000000,
    fps: 30,
    droppedFrames: 0,
    bufferHealth: 100
  })
  const [isOnAir, setIsOnAir] = useState(true)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const audioInterval = setInterval(() => {
      const left = Math.random() * 0.8
      const right = Math.random() * 0.8
      setAudioLevels(prev => ({
        left,
        right,
        peakLeft: Math.max(prev.peakLeft, left) * 0.95,
        peakRight: Math.max(prev.peakRight, right) * 0.95
      }))
    }, 50)

    const signalInterval = setInterval(() => {
      setSignal(prev => ({
        bitrate: 4800000 + Math.random() * 400000,
        fps: 29.8 + Math.random() * 0.4,
        droppedFrames: prev.droppedFrames,
        bufferHealth: 95 + Math.random() * 5
      }))
    }, 1000)

    return () => {
      clearInterval(audioInterval)
      clearInterval(signalInterval)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false })
  }

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const currentDuration = 3600
  const elapsedTime = 1800 + (Date.now() % 100) / 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Radio className="h-8 w-8 text-red-500" />
                <div>
                  <h1 className="text-xl font-bold text-white">Broadcast Control Center</h1>
                  <p className="text-xs text-slate-400">Enterprise Playout Automation v3.0</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-white font-mono text-lg">{formatTime(currentTime)}</span>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isOnAir ? 'bg-red-600' : 'bg-slate-700'}`}>
                <Radio className={`h-4 w-4 ${isOnAir ? 'animate-pulse' : ''}`} />
                <span className="text-white font-bold text-sm">
                  {isOnAir ? 'ON AIR' : 'OFF AIR'}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">System Normal</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 space-y-4">
            <Card className="bg-slate-900 border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white font-bold text-lg">Program Monitor</h2>
                    <p className="text-slate-400 text-sm">CH01 - Main Channel • Live Output</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600">LIVE</Badge>
                    <Badge variant="outline" className="border-slate-500">1080p50</Badge>
                    <Badge variant="outline" className="border-slate-500">5Mbps</Badge>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Radio className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-white text-2xl font-bold">Live On Air</p>
                    <p className="text-slate-400 mt-2">Morning News Broadcast</p>
                  </div>
                </div>

                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-2 rounded">
                  <Radio className="h-4 w-4 text-red-500 animate-pulse" />
                  <span className="text-white text-sm font-semibold">LIVE</span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-2 rounded">
                  <Activity className="h-4 w-4 text-green-400" />
                  <span className="text-white text-sm font-mono">{(signal.bitrate / 1000000).toFixed(2)} Mbps</span>
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-2 rounded">
                  <Gauge className="h-4 w-4 text-slate-400" />
                  <span className="text-white text-sm font-mono">{signal.fps.toFixed(1)} FPS</span>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-2 rounded">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-white text-sm font-mono">{formatDuration(elapsedTime)}</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm w-20">Audio L:</span>
                  <div className="flex-1 h-6 bg-slate-800 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
                      style={{ width: `${audioLevels.left * 100}%` }}
                    />
                  </div>
                  <span className="text-white text-sm w-12 font-mono">{Math.round(audioLevels.peakLeft * 100)}%</span>
                  <Button size="sm" variant="ghost" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm w-20">Audio R:</span>
                  <div className="flex-1 h-6 bg-slate-800 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
                      style={{ width: `${audioLevels.right * 100}%` }}
                    />
                  </div>
                  <span className="text-white text-sm w-12 font-mono">{Math.round(audioLevels.peakRight * 100)}%</span>
                  <Button size="sm" variant="ghost" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-white font-bold text-lg">Transport Controls</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button size="lg" variant="outline" className="w-16 h-16 rounded-full">
                    <SkipBack className="h-8 w-8" />
                  </Button>

                  <Button size="lg" className={`w-20 h-20 rounded-full ${isOnAir ? 'bg-red-600' : 'bg-green-600'}`}>
                    {isOnAir ? <Square className="h-10 w-10" /> : <Play className="h-10 w-10" />}
                  </Button>

                  <Button size="lg" variant="outline" className="w-16 h-16 rounded-full">
                    <SkipForward className="h-8 w-8" />
                  </Button>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between text-slate-400 text-sm mb-2">
                    <span>{formatDuration(elapsedTime)}</span>
                    <span>-{formatDuration(currentDuration - elapsedTime)}</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all"
                      style={{ width: `${(elapsedTime / currentDuration) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-400 text-sm">Morning News (00:30:00.00)</span>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Seek
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-white font-bold text-lg">Up Next</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <div className="p-4 bg-red-600 rounded-lg">
                    <Radio className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-lg">News Update - Weather Report</div>
                    <div className="text-slate-400 text-sm mt-1">Scheduled: 15:00:00 • Duration: 00:10:00</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-xs">Time to Air</div>
                    <div className="text-white font-mono text-2xl font-bold">00:15:42</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-4 space-y-4">
            <Card className="bg-slate-900 border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-white font-bold text-lg">Signal Monitor</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Bitrate</span>
                  <span className="text-white font-mono font-semibold">{(signal.bitrate / 1000000).toFixed(2)} Mbps</span>
                </div>
                <div className="h-2 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(signal.bitrate / 6000000) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-slate-400 text-sm">FPS</span>
                  <span className="text-white font-mono font-semibold">{signal.fps.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-slate-400 text-sm">Dropped Frames</span>
                  <span className="text-red-400 font-mono font-semibold">{signal.droppedFrames}</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-slate-400 text-sm">Buffer Health</span>
                  <span className="text-green-400 font-mono font-semibold">{signal.bufferHealth.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded overflow-hidden mt-2">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${signal.bufferHealth}%` }}
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-white font-bold text-lg">Active Streams</h2>
              </div>
              <div className="p-4 space-y-2">
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">Primary Stream</span>
                    <Badge className="bg-green-500">Streaming</Badge>
                  </div>
                  <div className="text-slate-400 text-xs">RTMP: rtmp://stream.example.com/live</div>
                  <div className="text-slate-400 text-xs mt-1">5.2 Mbps • 30 FPS • 1080p</div>
                </div>

                <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">Backup Stream</span>
                    <Badge variant="outline" className="border-slate-500">Standby</Badge>
                  </div>
                  <div className="text-slate-400 text-xs">SRT: srt://backup.example.com:4000</div>
                </div>

                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">YouTube Live</span>
                    <Badge className="bg-green-500">Streaming</Badge>
                  </div>
                  <div className="text-slate-400 text-xs">RTMP: rtmp://a.rtmp.youtube.com/live2</div>
                  <div className="text-slate-400 text-xs mt-1">4.8 Mbps • 30 FPS • 720p</div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h2 className="text-white font-bold text-lg">System Status</h2>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-slate-400 text-sm">Playout Engine</span>
                  </div>
                  <span className="text-green-400 text-xs font-semibold">Running</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-slate-400 text-sm">CG Renderer</span>
                  </div>
                  <span className="text-green-400 text-xs font-semibold">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-slate-400 text-sm">SCTE-35</span>
                  </div>
                  <span className="text-green-400 text-xs font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-slate-400 text-sm">Database</span>
                  </div>
                  <span className="text-green-400 text-xs font-semibold">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-slate-400 text-sm">WebSocket</span>
                  </div>
                  <span className="text-green-400 text-xs font-semibold">Connected</span>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900 border-red-900/30 border border-red-500/30">
              <div className="p-4 border-b border-red-500/30">
                <h2 className="text-red-400 font-bold text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Controls
                </h2>
              </div>
              <div className="p-4 space-y-2">
                <Button className="w-full" variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Cut to Black
                </Button>
                <Button className="w-full" variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Break Away
                </Button>
                <Button className="w-full" variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Manual Override
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700 bg-slate-900/95 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>Enterprise Broadcast Control v3.0</span>
              <span>•</span>
              <span>Channels: 4 Active</span>
              <span>•</span>
              <span>Streams: 8 Online</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Uptime: 14d 7h 32m</span>
              <span>•</span>
              <span>CPU: 45% • RAM: 62%</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}