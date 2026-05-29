'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Play, Pause, SkipBack, SkipForward, Plus, Trash2, Clock, Film, Type, Radio, Copy, Edit } from 'lucide-react'

interface TimelineItem {
  id: string
  type: 'video' | 'cg' | 'ad' | 'live'
  title: string
  startTime: string
  duration: number
  color: string
}

const TIMELINE_SCALE = 10

export default function PlayoutTimeline() {
  const [items, setItems] = useState<TimelineItem[]>([
    { id: '1', type: 'video', title: 'Morning News Intro', startTime: '00:00:00', duration: 300, color: 'bg-blue-500' },
    { id: '2', type: 'video', title: 'Main News Segment', startTime: '00:05:00', duration: 900, color: 'bg-blue-500' },
    { id: '3', type: 'cg', title: 'Weather Lower Third', startTime: '00:10:00', duration: 30, color: 'bg-purple-500' },
    { id: '4', type: 'ad', title: 'Commercial Break 1', startTime: '00:20:00', duration: 120, color: 'bg-orange-500' },
    { id: '5', type: 'video', title: 'Sports Update', startTime: '00:22:00', duration: 600, color: 'bg-blue-500' },
    { id: '6', type: 'live', title: 'Live Interview', startTime: '00:35:00', duration: 900, color: 'bg-red-500' },
    { id: '7', type: 'ad', title: 'Commercial Break 2', startTime: '00:50:00', duration: 120, color: 'bg-orange-500' },
    { id: '8', type: 'cg', title: 'Closing Credits', startTime: '01:00:00', duration: 60, color: 'bg-purple-500' },
  ])

  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const totalDuration = items.reduce((sum, item) => Math.max(sum, item.startTimeSec || 0) + item.duration, 0)

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const parseTime = (timeStr: string) => {
    const [h, m, s] = timeStr.split(':').map(Number)
    return h * 3600 + m * 60 + s
  }

  const timeToPixels = (seconds: number) => seconds * TIMELINE_SCALE

  const pixelsToTime = (pixels: number) => pixels / TIMELINE_SCALE

  const generateTimeMarkers = () => {
    const markers = []
    for (let i = 0; i <= totalDuration; i += 60) {
      markers.push(
        <div
          key={i}
          className="absolute border-t border-slate-600 text-xs text-slate-400"
          style={{ left: `${timeToPixels(i)}px` }}
        >
          <div className="h-4 -mt-2">{formatTime(i)}</div>
        </div>
      )
    }
    return markers
  }

  const getTypeIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'video': return Film
      case 'cg': return Type
      case 'ad': return Clock
      case 'live': return Radio
    }
  }

  const handleAddItem = () => {
    const newItem: TimelineItem = {
      id: Date.now().toString(),
      type: 'video',
      title: 'New Item',
      startTime: formatTime(totalDuration),
      duration: 60,
      color: 'bg-blue-500'
    }
    setItems([...items, newItem])
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
    if (selectedItem === id) setSelectedItem(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant={isPlaying ? "destructive" : "default"}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setCurrentTime(0)}>
            <SkipBack className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-white font-mono">{formatTime(currentTime)}</span>
          </div>
        </div>

        <Button size="sm" onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Card className="bg-slate-800 border-slate-600">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Playout Timeline</h3>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Copy className="h-3 w-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit Mode
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="relative p-4" style={{ minWidth: `${timeToPixels(totalDuration + 300)}px` }}>
                <div className="relative h-8 border-b border-slate-700 mb-2">
                  {generateTimeMarkers()}
                </div>

                <div className="relative h-24 space-y-2">
                  {items.map((item) => {
                    const Icon = getTypeIcon(item.type)
                    const startSec = parseTime(item.startTime)
                    const left = timeToPixels(startSec)
                    const width = timeToPixels(item.duration)

                    return (
                      <div
                        key={item.id}
                        className={`absolute h-10 ${item.color} rounded-md cursor-pointer flex items-center px-3 gap-2 transition-all hover:brightness-110 ${
                          selectedItem === item.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' : ''
                        }`}
                        style={{ left: `${left}px`, width: `${Math.max(width, 100)}px` }}
                        onClick={() => setSelectedItem(item.id)}
                        onDoubleClick={() => setCurrentTime(startSec)}
                      >
                        <Icon className="h-4 w-4 text-white" />
                        <span className="text-white text-sm font-medium truncate">{item.title}</span>
                        <span className="text-white/70 text-xs ml-auto">
                          {formatTime(item.duration)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 transition-all"
                  style={{ left: `${timeToPixels(currentTime)}px` }}
                >
                  <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>

        <div className="w-80 space-y-4">
          <Card className="bg-slate-800 border-slate-600">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">Schedule Details</h3>
            </div>
            <ScrollArea className="h-[450px] p-4">
              {selectedItem ? (() => {
                const item = items.find(i => i.id === selectedItem)
                if (!item) return null
                const Icon = getTypeIcon(item.type)

                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-purple-400" />
                      <span className="text-white font-medium">{item.title}</span>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300 text-xs">Type</Label>
                      <Badge className={`${item.color}`}>{item.type.toUpperCase()}</Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300 text-xs">Start Time</Label>
                      <Input
                        value={item.startTime}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300 text-xs">Duration (seconds)</Label>
                      <Input
                        type="number"
                        value={item.duration}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Properties
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full justify-start"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Item
                      </Button>
                    </div>
                  </div>
                )
              })() : (
                <div className="text-center py-8">
                  <div className="p-4 bg-slate-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-slate-500" />
                  </div>
                  <p className="text-slate-500">Select an item to view details</p>
                </div>
              )}
            </ScrollArea>
          </Card>

          <Card className="bg-slate-800 border-slate-600">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">Timeline Stats</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Items</span>
                <span className="text-white font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Duration</span>
                <span className="text-white font-semibold">{formatTime(totalDuration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Video Segments</span>
                <span className="text-blue-400 font-semibold">{items.filter(i => i.type === 'video').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">CG Overlays</span>
                <span className="text-purple-400 font-semibold">{items.filter(i => i.type === 'cg').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Ad Breaks</span>
                <span className="text-orange-400 font-semibold">{items.filter(i => i.type === 'ad').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Live Segments</span>
                <span className="text-red-400 font-semibold">{items.filter(i => i.type === 'live').length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}