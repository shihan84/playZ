'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { GripVertical, Play, Pause, Trash2, Clock, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { MediaFile } from './AssetsLibrary'

interface PlaylistItem extends MediaFile {
  status: 'pending' | 'current' | 'completed' | 'error'
  addedAt: Date
}

export default function SimplePlaylist({ initialItems }: { initialItems?: PlaylistItem[] }) {
  const [items, setItems] = useState<PlaylistItem[]>(
    initialItems || [
      {
        id: '1',
        name: 'News Bulletin 2024-01-15.mp4',
        type: 'video',
        duration: 1800,
        size: '245 MB',
        status: 'current',
        addedAt: new Date()
      },
      {
        id: '2',
        name: 'Weather Report.mp4',
        type: 'video',
        duration: 300,
        size: '42 MB',
        status: 'pending',
        addedAt: new Date()
      },
      {
        id: '3',
        name: 'Sports Highlights.mp4',
        type: 'video',
        duration: 600,
        size: '85 MB',
        status: 'pending',
        addedAt: new Date()
      },
      {
        id: '4',
        name: 'Commercial Break 1.mp4',
        type: 'video',
        duration: 120,
        size: '18 MB',
        status: 'pending',
        addedAt: new Date()
      },
      {
        id: '5',
        name: 'Documentary - Wildlife.mp4',
        type: 'video',
        duration: 3600,
        size: '520 MB',
        status: 'pending',
        addedAt: new Date()
      },
      {
        id: '6',
        name: 'Commercial Break 2.mp4',
        type: 'video',
        duration: 120,
        size: '18 MB',
        status: 'pending',
        addedAt: new Date()
      },
      {
        id: '7',
        name: 'Music Video - Summer Vibes.mp4',
        type: 'video',
        duration: 240,
        size: '65 MB',
        status: 'pending',
        addedAt: new Date()
      },
    ]
  )

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins >= 60) {
      const hours = Math.floor(mins / 60)
      const remainingMins = mins % 60
      return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusBadge = (status: PlaylistItem['status']) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-red-600 animate-pulse">NOW PLAYING</Badge>
      case 'pending':
        return <Badge className="bg-blue-600">NEXT UP</Badge>
      case 'completed':
        return <Badge className="bg-green-600">COMPLETED</Badge>
      case 'error':
        return <Badge className="bg-red-500">ERROR</Badge>
    }
  }

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items]
    const [removed] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, removed)
    setItems(newItems)
  }

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  const playItem = (itemId: string) => {
    setItems(items.map(item => ({
      ...item,
      status: item.id === itemId ? 'current' : item.status === 'current' ? 'completed' : item.status
    })))
  }

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const totalDuration = items.reduce((acc, item) => acc + item.duration, 0)

  return (
    <Card className="bg-slate-800 border-slate-700 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Playlist</CardTitle>
          <Badge variant="outline" className="border-purple-500 text-purple-400">
            {items.length} items • {formatDuration(totalDuration)}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search playlist..."
            className="bg-slate-700 border-slate-600 text-white text-sm"
          />
          <Button size="sm" variant="outline">
            Clear
          </Button>
          <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
            Save Playlist
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {items.map((item, index) => {
            const isExpanded = expandedItems.has(item.id)
            const isCurrent = item.status === 'current'

            return (
              <div
                key={item.id}
                className={`group p-3 rounded-lg border-2 transition-all ${
                  isCurrent ? 'bg-red-900/20 border-red-600' : 'bg-slate-700 border-transparent hover:border-slate-600'
                }`}
                draggable
                onDragStart={(e) => {
                  setDraggedIndex(index)
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (draggedIndex !== null && draggedIndex !== index) {
                    moveItem(draggedIndex, index)
                  }
                  setDraggedIndex(null)
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Drag handle */}
                  <div className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Status indicator */}
                  <div className={`h-3 w-3 rounded-full ${
                    isCurrent ? 'bg-red-500 animate-pulse' :
                    item.status === 'pending' ? 'bg-blue-500' :
                    item.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                  }`} />

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-500 text-xs font-mono">#{index + 1}</span>
                      <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(item.duration)}
                      </span>
                      <span>{item.size}</span>
                      <span className="text-slate-500">{item.type.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Status badge */}
                  {getStatusBadge(item.status)}

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.status !== 'current' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                        onClick={() => playItem(item.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-600"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-600 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-slate-400">
                        <span className="block">File Size</span>
                        <span className="text-white">{item.size}</span>
                      </div>
                      <div className="text-slate-400">
                        <span className="block">Duration</span>
                        <span className="text-white">{formatDuration(item.duration)}</span>
                      </div>
                      <div className="text-slate-400">
                        <span className="block">Type</span>
                        <span className="text-white uppercase">{item.type}</span>
                      </div>
                      <div className="text-slate-400">
                        <span className="block">Added</span>
                        <span className="text-white">{item.addedAt.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit Metadata
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {items.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Playlist is empty</p>
              <p className="text-sm mt-1">Add files from the Assets Library</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}