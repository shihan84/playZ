'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Radio, Grid3X3, Maximize2, MonitorPlay, AlertTriangle } from 'lucide-react'

interface Channel {
  id: string
  name: string
  status: 'live' | 'standby' | 'offline'
  resolution: string
  fps: number
  bitrate: number
}

interface MultiViewMonitorProps {
  layout?: 'single' | 'quad' | 'hex' | 'nine'
  onLayoutChange?: (layout: 'single' | 'quad' | 'hex' | 'nine') => void
}

export default function MultiViewMonitor({ layout = 'quad', onLayoutChange }: MultiViewMonitorProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [layoutMode, setLayoutMode] = useState<'single' | 'quad' | 'hex' | 'nine'>(layout)

  const channels: Channel[] = [
    { id: '1', name: 'CH01 - Main', status: 'live', resolution: '1080p', fps: 50, bitrate: 5000000 },
    { id: '2', name: 'CH02 - News', status: 'live', resolution: '720p', fps: 30, bitrate: 3000000 },
    { id: '3', name: 'CH03 - Sports', status: 'standby', resolution: '1080p', fps: 60, bitrate: 6000000 },
    { id: '4', name: 'CH04 - Documentary', status: 'live', resolution: '1080p', fps: 30, bitrate: 4000000 },
    { id: '5', name: 'CH05 - Music', status: 'standby', resolution: '720p', fps: 30, bitrate: 2500000 },
    { id: '6', name: 'CH06 - Kids', status: 'live', resolution: '720p', fps: 30, bitrate: 3000000 },
    { id: '7', name: 'CH07 - Movies', status: 'offline', resolution: '1080p', fps: 24, bitrate: 5000000 },
    { id: '8', name: 'CH08 - Events', status: 'standby', resolution: '1080p', fps: 50, bitrate: 6000000 },
    { id: '9', name: 'CH09 - Archive', status: 'offline', resolution: '720p', fps: 30, bitrate: 2000000 },
  ]

  const visibleChannels = layoutMode === 'single' ? channels.slice(0, 1) :
                        layoutMode === 'quad' ? channels.slice(0, 4) :
                        layoutMode === 'hex' ? channels.slice(0, 6) : channels.slice(0, 9)

  const getStatusColor = (status: Channel['status']) => {
    switch (status) {
      case 'live': return 'bg-red-600'
      case 'standby': return 'bg-yellow-600'
      case 'offline': return 'bg-slate-600'
    }
  }

  const getStatusText = (status: Channel['status']) => {
    switch (status) {
      case 'live': return 'LIVE'
      case 'standby': return 'STANDBY'
      case 'offline': return 'OFFLINE'
    }
  }

  const ChannelMonitor = ({ channel }: { channel: Channel }) => (
    <Card className={`bg-slate-900 border-slate-700 cursor-pointer transition-all hover:border-slate-500 ${selectedChannel === channel.id ? 'border-purple-500' : ''}`}
           onClick={() => setSelectedChannel(channel.id)}>
      <div className="aspect-video bg-black relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Radio className={`h-8 w-8 mx-auto mb-2 ${channel.status === 'live' ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
            <p className="text-white text-sm font-semibold">{channel.name}</p>
          </div>
        </div>

        <div className="absolute top-2 left-2 flex items-center gap-2">
          <Badge className={`${getStatusColor(channel.status)} text-xs`}>
            {getStatusText(channel.status)}
          </Badge>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-xs">
          <span className="text-slate-300">{channel.resolution}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">{channel.fps}fps</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">{(channel.bitrate / 1000000).toFixed(1)}Mbps</span>
        </div>

        <div className="absolute bottom-2 left-2 right-2">
          <div className="h-1 bg-slate-800 rounded overflow-hidden">
            <div className={`h-full ${channel.status === 'live' ? 'bg-red-500' : channel.status === 'standby' ? 'bg-yellow-500' : 'bg-slate-500'}`}
                 style={{ width: channel.status === 'live' ? '65%' : '0%' }} />
          </div>
        </div>

        {channel.status === 'live' && (
          <div className="absolute bottom-2 right-2">
            <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-xs">
              <Radio className="h-3 w-3 text-red-500 animate-pulse" />
              <span className="text-white">ON AIR</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )

  const gridCols = layoutMode === 'single' ? 'grid-cols-1' :
                  layoutMode === 'quad' ? 'grid-cols-2' :
                  layoutMode === 'hex' ? 'grid-cols-3' : 'grid-cols-3'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            <MonitorPlay className="h-5 w-5" />
            Multi-View Monitor
          </h2>
          <Badge variant="outline" className="border-purple-500 text-purple-400">
            {visibleChannels.length} Channels
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <Button
              size="sm"
              variant={layoutMode === 'single' ? 'default' : 'ghost'}
              onClick={() => setLayoutMode('single')}
              className="px-3"
            >
              1
            </Button>
            <Button
              size="sm"
              variant={layoutMode === 'quad' ? 'default' : 'ghost'}
              onClick={() => setLayoutMode('quad')}
              className="px-3"
            >
              4
            </Button>
            <Button
              size="sm"
              variant={layoutMode === 'hex' ? 'default' : 'ghost'}
              onClick={() => setLayoutMode('hex')}
              className="px-3"
            >
              6
            </Button>
            <Button
              size="sm"
              variant={layoutMode === 'nine' ? 'default' : 'ghost'}
              onClick={() => setLayoutMode('nine')}
              className="px-3"
            >
              9
            </Button>
          </div>

          {selectedChannel && (
            <Button size="sm" variant="outline" onClick={() => setSelectedChannel(null)}>
              <Maximize2 className="h-4 w-4 mr-2" />
              Expand
            </Button>
          )}
        </div>
      </div>

      <div className={`grid ${gridCols} gap-4`}>
        {visibleChannels.map((channel) => (
          <ChannelMonitor key={channel.id} channel={channel} />
        ))}
      </div>

      <Card className="bg-slate-900 border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Channel Overview
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-5 gap-4 text-center">
            <div className="p-3 bg-green-900/20 rounded-lg">
              <div className="text-green-400 text-2xl font-bold">{channels.filter(c => c.status === 'live').length}</div>
              <div className="text-slate-400 text-xs mt-1">On Air</div>
            </div>
            <div className="p-3 bg-yellow-900/20 rounded-lg">
              <div className="text-yellow-400 text-2xl font-bold">{channels.filter(c => c.status === 'standby').length}</div>
              <div className="text-slate-400 text-xs mt-1">Standby</div>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg">
              <div className="text-slate-400 text-2xl font-bold">{channels.filter(c => c.status === 'offline').length}</div>
              <div className="text-slate-400 text-xs mt-1">Offline</div>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg">
              <div className="text-white text-2xl font-bold">
                {channels.filter(c => c.status === 'live').reduce((sum, c) => sum + c.bitrate, 0) / 1000000}
              </div>
              <div className="text-slate-400 text-xs mt-1">Total Mbps</div>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg">
              <div className="text-white text-2xl font-bold">
                {channels.reduce((sum, c) => sum + c.resolution === '1080p' ? 1 : 0, 0)}
              </div>
              <div className="text-slate-400 text-xs mt-1">HD Channels</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}