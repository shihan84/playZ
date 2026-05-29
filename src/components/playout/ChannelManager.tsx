'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Square, Radio, Tv, Plus, Settings, AlertCircle, CheckCircle, Clock, Copy, Trash2 } from 'lucide-react'

interface Channel {
  id: string
  name: string
  description?: string
  callSign?: string
  isActive: boolean
  status: string
  currentProgram?: string
  currentEvent?: string
  currentTime: number
  totalDuration: number
  resolution: string
  bitrate: number
  streamCount: number
}

interface StreamOutput {
  id: string
  name: string
  protocol: string
  status: string
  isPrimary: boolean
  bitrate?: number
  fps?: number
}

const STATUS_COLORS: Record<string, string> = {
  idle: 'bg-slate-500',
  live: 'bg-green-500',
  streaming: 'bg-green-500',
  stopped: 'bg-red-500',
  paused: 'bg-yellow-500',
  emergency: 'bg-red-600',
  failover: 'bg-orange-500'
}

const STATUS_ICONS: Record<string, React.ComponentType> = {
  idle: Clock,
  live: Radio,
  streaming: Radio,
  stopped: Square,
  paused: Pause,
  emergency: AlertCircle,
  failover: AlertCircle
}

export default function ChannelManager() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const channels: Channel[] = [
    {
      id: '1',
      name: 'Main Channel',
      description: 'Primary broadcast channel',
      callSign: 'CH01',
      isActive: true,
      status: 'live',
      currentProgram: 'Morning News',
      currentEvent: null,
      currentTime: 1800,
      totalDuration: 3600,
      resolution: '1920x1080',
      bitrate: 5000000,
      streamCount: 2
    },
    {
      id: '2',
      name: 'News 24/7',
      description: '24-hour news coverage',
      callSign: 'CH02',
      isActive: true,
      status: 'streaming',
      currentProgram: 'Breaking News Live',
      currentEvent: null,
      currentTime: 5400,
      totalDuration: 86400,
      resolution: '1280x720',
      bitrate: 3000000,
      streamCount: 3
    },
    {
      id: '3',
      name: 'Sports Channel',
      description: 'Sports and live events',
      callSign: 'SPRT',
      isActive: false,
      status: 'idle',
      currentProgram: null,
      currentEvent: null,
      currentTime: 0,
      totalDuration: 0,
      resolution: '1920x1080',
      bitrate: 6000000,
      streamCount: 1
    },
    {
      id: '4',
      name: 'Documentary Channel',
      description: 'Documentaries and educational content',
      callSign: 'DOC',
      isActive: true,
      status: 'paused',
      currentProgram: 'Nature Documentary',
      currentEvent: null,
      currentTime: 2700,
      totalDuration: 5400,
      resolution: '1920x1080',
      bitrate: 4000000,
      streamCount: 2
    }
  ]

  const streams: Record<string, StreamOutput[]> = {
    '1': [
      { id: 's1', name: 'Primary Stream', protocol: 'RTMP', status: 'streaming', isPrimary: true, bitrate: 5000000, fps: 30 },
      { id: 's2', name: 'Backup Stream', protocol: 'RTMP', status: 'idle', isPrimary: false }
    ],
    '2': [
      { id: 's3', name: 'YouTube Live', protocol: 'RTMP', status: 'streaming', isPrimary: true, bitrate: 3000000, fps: 30 },
      { id: 's4', name: 'Facebook Live', protocol: 'RTMP', status: 'streaming', isPrimary: false, bitrate: 2500000, fps: 30 },
      { id: 's5', name: 'Twitch', protocol: 'RTMP', status: 'streaming', isPrimary: false, bitrate: 4000000, fps: 60 }
    ],
    '3': [
      { id: 's6', name: 'Main Stream', protocol: 'RTMP', status: 'idle', isPrimary: true }
    ],
    '4': [
      { id: 's7', name: 'Primary', protocol: 'RTMP', status: 'paused', isPrimary: true, bitrate: 4000000, fps: 30 },
      { id: 's8', name: 'Backup', protocol: 'RTMP', status: 'idle', isPrimary: false }
    ]
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const formatBitrate = (bps: number) => {
    return (bps / 1000000).toFixed(2) + ' Mbps'
  }

  const handleChannelAction = (channelId: string, action: string) => {
    console.log(`Channel ${channelId} action: ${action}`)
  }

  const handleStreamAction = (streamId: string, action: string) => {
    console.log(`Stream ${streamId} action: ${action}`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Channels</CardTitle>
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <CardDescription className="text-slate-400">
              Manage your broadcast channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {channels.map((channel) => {
              const StatusIcon = STATUS_ICONS[channel.status] || Clock
              return (
                <div
                  key={channel.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedChannel === channel.id
                      ? 'bg-purple-600 border-2 border-purple-400'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  onClick={() => setSelectedChannel(channel.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4 text-purple-400" />
                      <span className="text-white font-medium text-sm">{channel.name}</span>
                    </div>
                    <Badge className={`${STATUS_COLORS[channel.status]} ${channel.status === 'live' || channel.status === 'streaming' ? 'animate-pulse' : ''}`}>
                      {channel.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{channel.callSign || 'N/A'}</span>
                    <span>•</span>
                    <span>{channel.resolution}</span>
                    <span>•</span>
                    <span>{formatBitrate(channel.bitrate)}</span>
                    <span>•</span>
                    <span>{channel.streamCount} streams</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Channels</span>
              <span className="text-white font-semibold">{channels.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Active</span>
              <span className="text-green-400 font-semibold">{channels.filter(c => c.isActive).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">On Air</span>
              <span className="text-green-400 font-semibold">
                {channels.filter(c => c.status === 'live' || c.status === 'streaming').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Streams</span>
              <span className="text-white font-semibold">{Object.values(streams).flat().length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3 space-y-4">
        {selectedChannel ? (() => {
          const channel = channels.find(c => c.id === selectedChannel)
          if (!channel) return null

          const channelStreams = streams[channel.id] || []

          return (
            <>
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Tv className="h-5 w-5" />
                        {channel.name}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1">
                        {channel.description || 'No description'} • {channel.callSign || 'N/A'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-slate-400 text-xs mb-1">Status</div>
                      <div className={`font-semibold flex items-center gap-2 ${
                        channel.status === 'live' || channel.status === 'streaming' ? 'text-green-400' :
                        channel.status === 'stopped' ? 'text-red-400' : 'text-white'
                      }`}>
                        {STATUS_COLORS[channel.status] && (
                          <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[channel.status]} ${
                            channel.status === 'live' || channel.status === 'streaming' ? 'animate-pulse' : ''
                          }`} />
                        )}
                        {channel.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-slate-400 text-xs mb-1">Current Program</div>
                      <div className="text-white font-semibold truncate">{channel.currentProgram || 'N/A'}</div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-slate-400 text-xs mb-1">Progress</div>
                      <div className="text-white font-semibold">
                        {formatTime(channel.currentTime)} / {formatTime(channel.totalDuration)}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-slate-400 text-xs mb-1">Output</div>
                      <div className="text-white font-semibold">
                        {channel.resolution} @ {formatBitrate(channel.bitrate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {channel.status === 'live' || channel.status === 'streaming' ? (
                      <>
                        <Button size="sm" variant="destructive" onClick={() => handleChannelAction(channel.id, 'stop')}>
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleChannelAction(channel.id, 'pause')}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      </>
                    ) : channel.status === 'paused' ? (
                      <>
                        <Button size="sm" onClick={() => handleChannelAction(channel.id, 'resume')}>
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleChannelAction(channel.id, 'stop')}>
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => handleChannelAction(channel.id, 'start')}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Playout
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleChannelAction(channel.id, 'emergency')}>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Emergency Cut
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Stream Outputs</CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stream
                    </Button>
                  </div>
                  <CardDescription className="text-slate-400">
                    Manage output destinations for this channel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {channelStreams.map((stream) => (
                      <div key={stream.id} className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Radio className={`h-5 w-5 ${
                              stream.status === 'streaming' ? 'text-green-400' :
                              stream.status === 'paused' ? 'text-yellow-400' :
                              stream.status === 'failover' ? 'text-orange-400' : 'text-slate-400'
                            }`} />
                            <div>
                              <div className="text-white font-medium flex items-center gap-2">
                                {stream.name}
                                {stream.isPrimary && <Badge className="bg-purple-500 text-xs">PRIMARY</Badge>}
                              </div>
                              <div className="text-slate-400 text-xs flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="border-slate-500 text-xs">{stream.protocol}</Badge>
                                {stream.bitrate && <span>{formatBitrate(stream.bitrate)}</span>}
                                {stream.fps && <span>{stream.fps} fps</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${STATUS_COLORS[stream.status]} ${
                              stream.status === 'streaming' ? 'animate-pulse' : ''
                            }`}>
                              {stream.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {stream.status === 'streaming' ? (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleStreamAction(stream.id, 'restart')}>
                                <Radio className="h-4 w-4 mr-2" />
                                Restart
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleStreamAction(stream.id, 'stop')}>
                                <Square className="h-4 w-4 mr-2" />
                                Stop
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" onClick={() => handleStreamAction(stream.id, 'start')}>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                              </Button>
                              {stream.isPrimary && (
                                <Button size="sm" variant="outline" onClick={() => handleStreamAction(stream.id, 'failover')}>
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  Test Failover
                                </Button>
                              )}
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )
        })() : (
          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-12 text-center">
              <Tv className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">No Channel Selected</h3>
              <p className="text-slate-400 mb-6">Select a channel from the sidebar to view details</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Channel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}