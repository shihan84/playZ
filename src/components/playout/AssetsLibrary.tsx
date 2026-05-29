'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Folder, FileVideo, Search, Plus, Grid, List, Play, Clock } from 'lucide-react'

interface Folder {
  id: string
  name: string
  icon: string
  count: number
}

interface MediaFile {
  id: string
  name: string
  type: 'video' | 'audio' | 'image'
  duration: number
  size: string
  thumbnail?: string
}

export default function AssetsLibrary({ onFileAdd }: { onFileAdd: (file: MediaFile) => void }) {
  const [currentPath, setCurrentPath] = useState<string[]>(['Root'])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  const folders: Folder[] = [
    { id: '1', name: 'News', icon: '📰', count: 24 },
    { id: '2', name: 'Sports', icon: '⚽', count: 18 },
    { id: '3', name: 'Music Videos', icon: '🎵', count: 32 },
    { id: '4', name: 'Documentaries', icon: '🎬', count: 15 },
    { id: '5', name: 'Commercials', icon: '📺', count: 45 },
    { id: '6', name: 'Graphics', icon: '🖼️', count: 28 },
    { id: '7', name: 'Audio', icon: '🔊', count: 12 },
  ]

  const mediaFiles: MediaFile[] = [
    { id: '1', name: 'News Bulletin 2024-01-15.mp4', type: 'video', duration: 1800, size: '245 MB' },
    { id: '2', name: 'Morning Show Intro.mp4', type: 'video', duration: 30, size: '15 MB' },
    { id: '3', name: 'Weather Report.mp4', type: 'video', duration: 300, size: '42 MB' },
    { id: '4', name: 'Sports Highlights.mp4', type: 'video', duration: 600, size: '85 MB' },
    { id: '5', name: 'Commercial 30s - Brand A.mp4', type: 'video', duration: 30, size: '8 MB' },
    { id: '6', name: 'Music Video - Summer Vibes.mp4', type: 'video', duration: 240, size: '65 MB' },
    { id: '7', name: 'Documentary - Wildlife.mp4', type: 'video', duration: 3600, size: '520 MB' },
    { id: '8', name: 'Break Bumper.mp4', type: 'video', duration: 5, size: '3 MB' },
  ]

  const filteredFiles = mediaFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles)
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId)
    } else {
      newSelection.add(fileId)
    }
    setSelectedFiles(newSelection)
  }

  const addSelectedToPlaylist = () => {
    selectedFiles.forEach(fileId => {
      const file = mediaFiles.find(f => f.id === fileId)
      if (file) {
        onFileAdd(file)
      }
    })
    setSelectedFiles(new Set())
  }

  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
  }

  return (
    <Card className="bg-slate-800 border-slate-700 h-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-white">Assets Library</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm mb-3 overflow-x-auto">
          {currentPath.map((path, index) => (
            <div key={index} className="flex items-center">
              <span
                className={`cursor-pointer hover:text-purple-400 transition-colors ${
                  index === currentPath.length - 1 ? 'text-purple-400 font-medium' : 'text-slate-400'
                }`}
                onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
              >
                {path}
              </span>
              {index < currentPath.length - 1 && <ChevronRight className="h-4 w-4 text-slate-600" />}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white pl-9"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Folders */}
        <div className="mb-4">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Folders</h3>
          <div className="grid grid-cols-2 gap-2">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => navigateToFolder(folder.name)}
                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{folder.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{folder.name}</p>
                    <p className="text-slate-400 text-xs">{folder.count} items</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Files */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Media Files ({filteredFiles.length})</h3>
            {selectedFiles.size > 0 && (
              <Button size="sm" onClick={addSelectedToPlaylist} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add {selectedFiles.size} to Playlist
              </Button>
            )}
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    selectedFiles.has(file.id)
                      ? 'bg-purple-900/30 border-purple-500'
                      : 'bg-slate-700 border-transparent hover:border-slate-600'
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <div className="aspect-video bg-slate-800 rounded-md mb-2 flex items-center justify-center">
                    <FileVideo className="h-8 w-8 text-slate-500" />
                  </div>
                  <p className="text-white text-xs font-medium truncate mb-1">{file.name}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(file.duration)}</span>
                    </div>
                    <span className="text-slate-500 text-xs">{file.size}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border-2 ${
                    selectedFiles.has(file.id)
                      ? 'bg-purple-900/30 border-purple-500'
                      : 'bg-slate-700 border-transparent hover:border-slate-600'
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <div className="h-10 w-10 bg-slate-800 rounded flex items-center justify-center flex-shrink-0">
                    <FileVideo className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                      <span>{formatDuration(file.duration)}</span>
                      <span>{file.size}</span>
                    </div>
                  </div>
                  {selectedFiles.has(file.id) && (
                    <Badge className="bg-purple-600">Selected</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}