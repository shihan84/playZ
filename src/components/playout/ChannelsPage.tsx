'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Toggle } from '@/components/ui/toggle'
import { Plus, Play, Pause, Square, Settings, Copy, Trash2, Tv, Radio, Signal, Globe, Zap } from 'lucide-react'

interface StreamOutput {
  id: string
  name: string
  protocol: 'rtmp' | 'srt' | 'hls' | 'dash' | 'webrtc'
  url: string
  streamKey: string
  status: 'streaming' | 'standby' | 'error'
  bitrate: number
  fps: number
  resolution: string
  isPrimary: boolean
}

interface Channel {
  id: string
  name: string
  callSign: string
  description: string
  status: 'idle' | 'live' | 'streaming' | 'paused' | 'emergency'
  resolution: string
  frameRate: number
  aspectRatio: string
  videoCodec: string
  audioCodec: string
  bitrate: number
  streams: StreamOutput[]
  createdAt: Date
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'ch01',
      name: 'Main Channel',
      callSign: 'MAIN',
      description: 'Primary broadcast channel',
      status: 'streaming',
      resolution: '1920x1080',
      frameRate: 30,
      aspectRatio: '16:9',
      videoCodec: 'H.264',
      audioCodec: 'AAC',
      bitrate: 5000,
      streams: [
        {
          id: 's1',
          name: 'YouTube Primary',
          protocol: 'rtmp',
          url: 'rtmp://a.rtmp.youtube.com/live2',
          streamKey: 'xxxx-xxxx-xxxx-xxxx',
          status: 'streaming',
          bitrate: 5000,
          fps: 30,
          resolution: '1920x1080',
          isPrimary: true
        },
        {
          id: 's2',
          name: 'Facebook Backup',
          protocol: 'rtmp',
          url: 'rtmps://live-api-s.facebook.com:443/rtmp',
          streamKey: 'FB-xxxx-xxxx',
          status: 'standby',
          bitrate: 5000,
          fps: 30,
          resolution: '1920x1080',
          isPrimary: false
        }
      ],
      createdAt: new Date()
    },
    {
      id: 'ch02',
      name: 'News 24/7',
      callSign: 'NEWS',
      description: '24-hour news channel',
      status: 'live',
      resolution: '1280x720',
      frameRate: 30,
      aspectRatio: '16:9',
      videoCodec: 'H.264',
      audioCodec: 'AAC',
      bitrate: 3000,
      streams: [
        {
          id: 's3',
          name: 'Twitch Primary',
          protocol: 'rtmp',
          url: 'rtmp://live.twitch.tv/app',
          streamKey: 'live_xxxxxxxx',
          status: 'streaming',
          bitrate: 3000,
          fps: 30,
          resolution: '1280x720',
          isPrimary: true
        }
      ],
      createdAt: new Date()
    },
    {
      id: 'ch03',
      name: 'Sports Channel',
      callSign: 'SPORT',
      description: 'Sports and live events',
      status: 'idle',
      resolution: '1920x1080',
      frameRate: 60,
      aspectRatio: '16:9',
      videoCodec: 'H.264',
      audioCodec: 'AAC',
      bitrate: 8000,
      streams: [],
      createdAt: new Date()
    },
  ])

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false)
  const [isAddStreamOpen, setIsAddStreamOpen] = useState(false)
  const [newChannel, setNewChannel] = useState({
    name: '',
    callSign: '',
    description: '',
    resolution: '1920x1080',
    frameRate: 30,
    bitrate: 5000
  })
  const [newStream, setNewStream] = useState({
    name: '',
    protocol: 'rtmp' as const,
    url: '',
    streamKey: ''
  })

  const getStatusBadge = (status: Channel['status'] | StreamOutput['status']) => {
    switch (status) {
      case 'streaming':
        return <Badge className="bg-red-600 animate-pulse">STREAMING</Badge>
      case 'live':
        return <Badge className="bg-red-600">LIVE</Badge>
      case 'idle':
        return <Badge className="bg-slate-600">IDLE</Badge>
      case 'paused':
        return <Badge className="bg-yellow-600">PAUSED</Badge>
      case 'emergency':
        return <Badge className="bg-orange-600">EMERGENCY</Badge>
      case 'standby':
        return <Badge className="bg-blue-600">STANDBY</Badge>
      case 'error':
        return <Badge className="bg-red-500">ERROR</Badge>
    }
  }

  const getProtocolIcon = (protocol: StreamOutput['protocol']) => {
    switch (protocol) {
      case 'rtmp':
        return Radio
      case 'srt':
        return Signal
      case 'hls':
      case 'dash':
        return Globe
      case 'webrtc':
        return Zap
    }
  }

  const addChannel = () => {
    const channel: Channel = {
      id: `ch${Date.now()}`,
      name: newChannel.name,
      callSign: newChannel.callSign,
      description: newChannel.description,
      status: 'idle',
      resolution: newChannel.resolution,
      frameRate: newChannel.frameRate,
      aspectRatio: '16:9',
      videoCodec: 'H.264',
      audioCodec: 'AAC',
      bitrate: newChannel.bitrate,
      streams: [],
      createdAt: new Date()
    }
    setChannels([...channels, channel])
    setIsAddChannelOpen(false)
    setNewChannel({
      name: '',
      callSign: '',
      description: '',
      resolution: '1920x1080',
      frameRate: 30,
      bitrate: 5000
    })
  }

  const addStream = () => {
    if (selectedChannel) {
      const stream: StreamOutput = {
        id: `stream-${Date.now()}`,
        name: newStream.name,
        protocol: newStream.protocol,
        url: newStream.url,
        streamKey: newStream.streamKey,
        status: 'standby',
        bitrate: selectedChannel.bitrate,
        fps: selectedChannel.frameRate,
        resolution: selectedChannel.resolution,
        isPrimary: selectedChannel.streams.length === 0
      }
      setChannels(channels.map(ch =>
        ch.id === selectedChannel.id
          ? { ...ch, streams: [...ch.streams, stream] }
          : ch
      ))
      setSelectedChannel({
        ...selectedChannel,
        streams: [...selectedChannel.streams, stream]
      })
      setIsAddStreamOpen(false)
      setNewStream({ name: '', protocol: 'rtmp', url: '', streamKey: '' })
    }
  }

  const deleteChannel = (channelId: string) => {
    setChannels(channels.filter(ch => ch.id !== channelId))
    if (selectedChannel?.id === channelId) {
      setSelectedChannel(null)
    }
  }

  const deleteStream = (streamId: string) => {
    if (selectedChannel) {
      const updatedStreams = selectedChannel.streams.filter(s => s.id !== streamId)
      setChannels(channels.map(ch =>
        ch.id === selectedChannel.id
          ? { ...ch, streams: updatedStreams }
          : ch
      ))
      setSelectedChannel({ ...selectedChannel, streams: updatedStreams })
    }
  }

  const toggleChannelStatus = (channelId: string, status: Channel['status']) => {
    setChannels(channels.map(ch =>
      ch.id === channelId ? { ...ch, status } : ch
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Channel Management</h1>
          <p className="text-slate-400 mt-1">Configure and manage broadcast channels</p>
        </div>
        <Dialog open={isAddChannelOpen} onOpenChange={setIsAddChannelOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Channel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ch-name" className="text-slate-300">Channel Name</Label>
                <Input
                  id="ch-name"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="My Channel"
                />
              </div>
              <div>
                <Label htmlFor="ch-callsign" className="text-slate-300">Call Sign</Label>
                <Input
                  id="ch-callsign"
                  value={newChannel.callSign}
                  onChange={(e) => setNewChannel({ ...newChannel, callSign: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="CH01"
                  maxLength={4}
                />
              </div>
              <div>
                <Label htmlFor="ch-description" className="text-slate-300">Description</Label>
                <Input
                  id="ch-description"
                  value={newChannel.description}
                  onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Channel description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ch-resolution" className="text-slate-300">Resolution</Label>
                  <Select
                    value={newChannel.resolution}
                    onValueChange={(value) => setNewChannel({ ...newChannel, resolution: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1920x1080">1920x1080 (FHD)</SelectItem>
                      <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                      <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                      <SelectItem value="854x480">854x480 (SD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ch-framerate" className="text-slate-300">Frame Rate</Label>
                  <Select
                    value={newChannel.frameRate.toString()}
                    onValueChange={(value) => setNewChannel({ ...newChannel, frameRate: Number(value) })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 fps</SelectItem>
                      <SelectItem value="30">30 fps</SelectItem>
                      <SelectItem value="60">60 fps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="ch-bitrate" className="text-slate-300">Bitrate (kbps)</Label>
                <Input
                  id="ch-bitrate"
                  type="number"
                  value={newChannel.bitrate}
                  onChange={(e) => setNewChannel({ ...newChannel, bitrate: Number(e.target.value) })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="5000"
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={addChannel}>
                  Create Channel
                </Button>
                <Button variant="outline" onClick={() => setIsAddChannelOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{channels.length}</div>
            <div className="text-slate-400 text-sm">Total Channels</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">
              {channels.filter(ch => ch.status === 'streaming' || ch.status === 'live').length}
            </div>
            <div className="text-slate-400 text-sm">On Air</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">
              {channels.reduce((acc, ch) => acc + ch.streams.length, 0)}
            </div>
            <div className="text-slate-400 text-sm">Active Streams</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">
              {(channels.reduce((acc, ch) => acc + ch.bitrate, 0) / 1000).toFixed(1)}
            </div>
            <div className="text-slate-400 text-sm">Total Bandwidth (Mbps)</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-white text-lg font-semibold">Channels ({channels.length})</h2>
          {channels.map((channel) => (
            <Card
              key={channel.id}
              className={`bg-slate-800 border-slate-700 cursor-pointer transition-all ${
                selectedChannel?.id === channel.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedChannel(channel)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Tv className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">{channel.name}</h4>
                      {getStatusBadge(channel.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="font-mono">{channel.callSign}</span>
                      <span>•</span>
                      <span>{channel.resolution}</span>
                      <span>•</span>
                      <span>{channel.streams.length} streams</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {channel.status === 'idle' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 text-green-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleChannelStatus(channel.id, 'streaming')
                      }}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                  {(channel.status === 'streaming' || channel.status === 'live') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 text-yellow-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleChannelStatus(channel.id, 'paused')
                      }}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-red-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleChannelStatus(channel.id, 'idle')
                    }}
                  >
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Channel Details */}
        <div className="lg:col-span-2">
          {selectedChannel ? (
            <div className="space-y-6">
              {/* Channel Info */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Tv className="h-5 w-5 text-purple-400" />
                        {selectedChannel.name}
                        <span className="text-slate-400 font-mono">({selectedChannel.callSign})</span>
                      </CardTitle>
                      <p className="text-slate-400 text-sm mt-1">{selectedChannel.description}</p>
                    </div>
                    {getStatusBadge(selectedChannel.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label className="text-slate-400 text-xs">Resolution</Label>
                      <div className="text-white font-medium">{selectedChannel.resolution}</div>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-xs">Frame Rate</Label>
                      <div className="text-white font-medium">{selectedChannel.frameRate} fps</div>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-xs">Video Codec</Label>
                      <div className="text-white font-medium">{selectedChannel.videoCodec}</div>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-xs">Audio Codec</Label>
                      <div className="text-white font-medium">{selectedChannel.audioCodec}</div>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-xs">Bitrate</Label>
                      <div className="text-white font-medium">{selectedChannel.bitrate} kbps</div>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-xs">Aspect Ratio</Label>
                      <div className="text-white font-medium">{selectedChannel.aspectRatio}</div>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-xs">Streams</Label>
                      <div className="text-white font-medium">{selectedChannel.streams.length}</div>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-xs">Created</Label>
                      <div className="text-white font-medium">
                        {selectedChannel.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stream Outputs */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Stream Outputs ({selectedChannel.streams.length})</CardTitle>
                    <Dialog open={isAddStreamOpen} onOpenChange={setIsAddStreamOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Stream
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Add Stream Output</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="stream-name" className="text-slate-300">Stream Name</Label>
                            <Input
                              id="stream-name"
                              value={newStream.name}
                              onChange={(e) => setNewStream({ ...newStream, name: e.target.value })}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="My Stream"
                            />
                          </div>
                          <div>
                            <Label htmlFor="stream-protocol" className="text-slate-300">Protocol</Label>
                            <Select
                              value={newStream.protocol}
                              onValueChange={(value: any) => setNewStream({ ...newStream, protocol: value })}
                            >
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rtmp">RTMP</SelectItem>
                                <SelectItem value="srt">SRT</SelectItem>
                                <SelectItem value="hls">HLS</SelectItem>
                                <SelectItem value="dash">DASH</SelectItem>
                                <SelectItem value="webrtc">WebRTC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="stream-url" className="text-slate-300">URL</Label>
                            <Input
                              id="stream-url"
                              value={newStream.url}
                              onChange={(e) => setNewStream({ ...newStream, url: e.target.value })}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="rtmp://example.com/live"
                            />
                          </div>
                          <div>
                            <Label htmlFor="stream-key" className="text-slate-300">Stream Key</Label>
                            <Input
                              id="stream-key"
                              value={newStream.streamKey}
                              onChange={(e) => setNewStream({ ...newStream, streamKey: e.target.value })}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Your stream key"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={addStream}>
                              Add Stream
                            </Button>
                            <Button variant="outline" onClick={() => setIsAddStreamOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedChannel.streams.map((stream) => {
                    const Icon = getProtocolIcon(stream.protocol)
                    return (
                      <div key={stream.id} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-medium">{stream.name}</h4>
                              {stream.isPrimary && (
                                <Badge className="bg-purple-600 text-xs">PRIMARY</Badge>
                              )}
                              {getStatusBadge(stream.status)}
                            </div>
                            <div className="text-sm text-slate-400 mb-2">
                              {stream.protocol.toUpperCase()} • {stream.url}
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-slate-500">Bitrate</span>
                                <div className="text-white">{stream.bitrate} kbps</div>
                              </div>
                              <div>
                                <span className="text-slate-500">FPS</span>
                                <div className="text-white">{stream.fps}</div>
                              </div>
                              <div>
                                <span className="text-slate-500">Resolution</span>
                                <div className="text-white">{stream.resolution}</div>
                              </div>
                              <div>
                                <span className="text-slate-500">Key</span>
                                <div className="text-white font-mono text-xs">{stream.streamKey.substring(0, 8)}...</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400"
                              onClick={() => deleteStream(stream.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {selectedChannel.streams.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Radio className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No stream outputs configured</p>
                      <p className="text-sm mt-1">Add a stream to start broadcasting</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-4 gap-2">
                  <Button variant="outline" className="h-16 flex-col">
                    <Copy className="h-5 w-5 mb-1" />
                    Duplicate
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Settings className="h-5 w-5 mb-1" />
                    Configure
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Play className="h-5 w-5 mb-1" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col text-red-400 hover:text-red-300"
                    onClick={() => deleteChannel(selectedChannel.id)}
                  >
                    <Trash2 className="h-5 w-5 mb-1" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-12 text-center">
                <Tv className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Select a Channel</h3>
                <p className="text-slate-400">Choose a channel from the list to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}