'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Play, Pause, Square, SkipForward, SkipBack, GripVertical, Clock, FileVideo, Radio, AlertCircle, CheckCircle2, MoreVertical, ChevronRight, ChevronDown } from 'lucide-react'

interface PlaylistItem {
  id: string
  title: string
  type: 'video' | 'live' | 'cg' | 'ad'
  duration: number
  startTime: number
  endTime: number
  status: 'pending' | 'current' | 'completed' | 'error'
  source?: string
}

export default function PlaylistManager() {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['main']))
  const [selectedItem, setSelectedItem] = useState<string | null>('2')
  const [currentTime, setCurrentTime] = useState(3625)

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const playlistGroups: { [key: string]: { name: string, items: PlaylistItem[] } } = {
    main: {
      name: 'Main Playlist',
      items: [
        { id: '1', title: 'Station ID - Intro', type: 'video', duration: 30, startTime: 0, endTime: 30, status: 'completed' },
        { id: '2', title: 'Morning News - Headlines', type: 'live', duration: 600, startTime: 30, endTime: 630, status: 'current', source: 'live://studio-a' },
        { id: '3', title: 'Commercial Break 1', type: 'ad', duration: 120, startTime: 630, endTime: 750, status: 'pending' },
        { id: '4', title: 'Weather Report', type: 'video', duration: 300, startTime: 750, endTime: 1050, status: 'pending' },
        { id: '5', title: 'Sports Update', type: 'video', duration: 180, startTime: 1050, endTime: 1230, status: 'pending' },
        { id: '6', title: 'Commercial Break 2', type: 'ad', duration: 120, startTime: 1230, endTime: 1350, status: 'pending' },
        { id: '7', title: 'Featured Story', type: 'video', duration: 900, startTime: 1350, endTime: 2250, status: 'pending' },
        { id: '8', title: 'Station ID - Outro', type: 'video', duration: 30, startTime: 2250, endTime: 2280, status: 'pending' },
      ]
    },
    backup: {
      name: 'Emergency Playlist',
      items: [
        { id: '9', title: 'Emergency Card', type: 'cg', duration: 60, startTime: 0, endTime: 60, status: 'pending' },
        { id: '10', title: 'Static Backup', type: 'video', duration: 3600, startTime: 60, endTime: 3660, status: 'pending' },
      ]
    },
    special: {
      name: 'Special Events',
      items: [
        { id: '11', title: 'Live Election Coverage', type: 'live', duration: 7200, startTime: 0, endTime: 7200, status: 'pending' },
      ]
    }
  }

  const toggleGroup = (groupId: string) => {
    const newGroups = new Set(expandedGroups)
    if (newGroups.has(groupId)) {
      newGroups.delete(groupId)
    } else {
      newGroups.add(groupId)
    }
    setExpandedGroups(newGroups)
  }

  const getItemIcon = (type: PlaylistItem['type']) => {
    switch (type) {
      case 'video': return FileVideo
      case 'live': return Radio
      case 'cg': return <div className="h-4 w-4" />
      case 'ad': return <div className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: PlaylistItem['status']) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-red-600 animate-pulse">ON AIR</Badge>
      case 'pending':
        return <Badge variant="outline" className="border-slate-500">PENDING</Badge>
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-400">COMPLETED</Badge>
      case 'error':
        return <Badge variant="outline" className="border-red-500 text-red-400">ERROR</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Playlist Manager</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-white font-mono">{formatTime(currentTime)}</span>
          </div>
          <Button size="sm" variant="outline">
            <SkipBack className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button size="sm" variant="outline">
            <SkipForward className="h-4 w-4 mr-2" />
            Next
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Active Playlist</h3>
            <p className="text-slate-400 text-sm mt-1">Main - 8 items • Total: 38 minutes</p>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="p-2">
              {Object.entries(playlistGroups).map(([groupId, group]) => (
                <div key={groupId} className="mb-2">
                  <div
                    className="flex items-center justify-between p-2 bg-slate-800 rounded cursor-pointer hover:bg-slate-700"
                    onClick={() => toggleGroup(groupId)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedGroups.has(groupId) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span className="text-white font-medium text-sm">{group.name}</span>
                      <Badge variant="outline" className="border-slate-500">{group.items.length}</Badge>
                    </div>
                  </div>

                  {expandedGroups.has(groupId) && (
                    <div className="ml-4 mt-2 space-y-1">
                      {group.items.map((item, index) => {
                        const isSelected = selectedItem === item.id
                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                              isSelected ? 'bg-purple-600/30 border border-purple-500' : 'bg-slate-800/50 hover:bg-slate-700/50'
                            }`}
                            onClick={() => setSelectedItem(item.id)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-xs w-6">{index + 1}.</span>
                                <div className={`h-4 w-4 ${item.status === 'current' ? 'text-red-500' : 'text-slate-400'}`}>
                                  <Radio className={`h-4 w-4 ${item.status === 'current' ? 'animate-pulse' : ''}`} />
                                </div>
                                <span className="text-white text-sm font-medium">{item.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(item.status)}
                                <GripVertical className="h-4 w-4 text-slate-500" />
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span>Start: {formatTime(item.startTime)}</span>
                              <span>•</span>
                              <span>End: {formatTime(item.endTime)}</span>
                              <span>•</span>
                              <span>Duration: {formatDuration(item.duration)}</span>
                              {item.source && (
                                <>
                                  <span>•</span>
                                  <span className="text-purple-400">{item.source}</span>
                                </>
                              )}
                            </div>

                            {item.status === 'current' && (
                              <div className="mt-2">
                                <div className="h-1 bg-slate-700 rounded overflow-hidden">
                                  <div className="h-full bg-red-500" style={{ width: '35%' }} />
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                  <span>{formatTime(currentTime)}</span>
                                  <span>-{formatTime(item.endTime - currentTime)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <div className="space-y-4">
          <Card className="bg-slate-900 border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">Item Details</h3>
            </div>
            <div className="p-4">
              {selectedItem ? (() => {
                const allItems = Object.values(playlistGroups).flatMap(g => g.items)
                const item = allItems.find(i => i.id === selectedItem)
                if (!item) return null

                return (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-400 text-xs">Title</Label>
                      <div className="text-white font-semibold mt-1">{item.title}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-400 text-xs">Type</Label>
                        <div className="text-white font-semibold mt-1 uppercase">{item.type}</div>
                      </div>
                      <div>
                        <Label className="text-slate-400 text-xs">Status</Label>
                        <div className="mt-1">{getStatusBadge(item.status)}</div>
                      </div>
                      <div>
                        <Label className="text-slate-400 text-xs">Start Time</Label>
                        <div className="text-white font-mono font-semibold mt-1">{formatTime(item.startTime)}</div>
                      </div>
                      <div>
                        <Label className="text-slate-400 text-xs">End Time</Label>
                        <div className="text-white font-mono font-semibold mt-1">{formatTime(item.endTime)}</div>
                      </div>
                      <div>
                        <Label className="text-slate-400 text-xs">Duration</Label>
                        <div className="text-white font-mono font-semibold mt-1">{formatDuration(item.duration)}</div>
                      </div>
                      {item.source && (
                        <div>
                          <Label className="text-slate-400 text-xs">Source</Label>
                          <div className="text-purple-400 font-mono text-sm mt-1">{item.source}</div>
                        </div>
                      )}
                    </div>

                    {item.status === 'current' && (
                      <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Radio className="h-4 w-4 text-red-500 animate-pulse" />
                          <span className="text-red-400 font-semibold text-sm">Currently On Air</span>
                        </div>
                        <div className="text-slate-400 text-xs">
                          Time remaining: {formatTime(item.endTime - currentTime)}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 space-y-2">
                      <Button className="w-full justify-start" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Take Now
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <SkipForward className="h-4 w-4 mr-2" />
                        Take Next
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Skip Item
                      </Button>
                    </div>
                  </div>
                )
              })() : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Select an item to view details
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Start Playlist
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause Playlist
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Square className="h-4 w-4 mr-2" />
                Stop Playlist
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark All Complete
              </Button>
            </div>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">Playlist Statistics</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Items</span>
                <span className="text-white font-semibold">11</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Completed</span>
                <span className="text-green-400 font-semibold">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Pending</span>
                <span className="text-yellow-400 font-semibold">9</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Duration</span>
                <span className="text-white font-semibold">1h 15m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Remaining</span>
                <span className="text-white font-semibold">45m 15s</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}