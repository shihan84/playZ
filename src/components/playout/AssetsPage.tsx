'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Upload, Folder, FileVideo, Search, Filter, Download, Trash2, Edit, Plus } from 'lucide-react'

interface Asset {
  id: string
  name: string
  type: 'video' | 'audio' | 'image'
  duration: number
  size: string
  format: string
  resolution: string
  folder: string
  uploadedAt: Date
  thumbnail?: string
  tags: string[]
}

export default function AssetsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'video' | 'audio' | 'image'>('all')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadData, setUploadData] = useState({ name: '', tags: '' })

  const folders = [
    { id: 'all', name: 'All Assets', icon: Folder, count: 0 },
    { id: 'news', name: 'News', icon: FileVideo, count: 24 },
    { id: 'sports', name: 'Sports', icon: FileVideo, count: 18 },
    { id: 'music', name: 'Music Videos', icon: FileVideo, count: 32 },
    { id: 'documentaries', name: 'Documentaries', icon: FileVideo, count: 15 },
    { id: 'commercials', name: 'Commercials', icon: FileVideo, count: 45 },
    { id: 'graphics', name: 'Graphics', icon: Folder, count: 28 },
    { id: 'audio', name: 'Audio', icon: Folder, count: 12 },
  ]

  const assets: Asset[] = [
    {
      id: '1',
      name: 'News Bulletin 2024-01-15.mp4',
      type: 'video',
      duration: 1800,
      size: '245 MB',
      format: 'MP4',
      resolution: '1920x1080',
      folder: 'news',
      uploadedAt: new Date('2024-01-15'),
      tags: ['news', 'bulletin', 'daily']
    },
    {
      id: '2',
      name: 'Morning Show Intro.mp4',
      type: 'video',
      duration: 30,
      size: '15 MB',
      format: 'MP4',
      resolution: '1920x1080',
      folder: 'news',
      uploadedAt: new Date('2024-01-14'),
      tags: ['intro', 'morning-show']
    },
    {
      id: '3',
      name: 'Weather Report.mp4',
      type: 'video',
      duration: 300,
      size: '42 MB',
      format: 'MP4',
      resolution: '1920x1080',
      folder: 'news',
      uploadedAt: new Date('2024-01-15'),
      tags: ['weather', 'daily']
    },
    {
      id: '4',
      name: 'Sports Highlights.mp4',
      type: 'video',
      duration: 600,
      size: '85 MB',
      format: 'MP4',
      resolution: '1920x1080',
      folder: 'sports',
      uploadedAt: new Date('2024-01-15'),
      tags: ['sports', 'highlights']
    },
    {
      id: '5',
      name: 'Commercial 30s - Brand A.mp4',
      type: 'video',
      duration: 30,
      size: '8 MB',
      format: 'MP4',
      resolution: '1920x1080',
      folder: 'commercials',
      uploadedAt: new Date('2024-01-10'),
      tags: ['commercial', 'ad', 'brand-a']
    },
  ]

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === 'all' || asset.type === filterType
    const matchesFolder = selectedFolder === 'all' || asset.folder === selectedFolder
    return matchesSearch && matchesType && matchesFolder
  })

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

  const totalSize = filteredAssets.reduce((acc, asset) => {
    const sizeMB = parseFloat(asset.size)
    return acc + sizeMB
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Assets Library</h1>
          <p className="text-slate-400 mt-1">Manage all your media files</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Upload New Asset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file" className="text-slate-300">File</Label>
                <div className="mt-2 border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Drag and drop files here</p>
                  <p className="text-slate-500 text-sm mt-1">or click to browse</p>
                  <Input type="file" id="file" className="hidden" accept="video/*,audio/*,image/*" />
                </div>
              </div>
              <div>
                <Label htmlFor="name" className="text-slate-300">Name</Label>
                <Input
                  id="name"
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Asset name"
                />
              </div>
              <div>
                <Label htmlFor="tags" className="text-slate-300">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={uploadData.tags}
                  onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Upload
                </Button>
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Folders */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Folders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {folders.map((folder) => {
              const Icon = folder.icon
              const isActive = selectedFolder === folder.id
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{folder.name}</span>
                  <span className={`text-sm ${isActive ? 'text-white/70' : 'text-slate-500'}`}>
                    {folder.count}
                  </span>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters and Search */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white pl-9"
                  />
                </div>

                {/* Type Filter */}
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex gap-1 bg-slate-700 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white">{filteredAssets.length}</div>
                <div className="text-slate-400 text-sm">Total Assets</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white">{totalSize.toFixed(1)} GB</div>
                <div className="text-slate-400 text-sm">Total Size</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white">{filteredAssets.filter(a => a.type === 'video').length}</div>
                <div className="text-slate-400 text-sm">Videos</div>
              </CardContent>
            </Card>
          </div>

          {/* Assets Grid/List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="group bg-slate-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
                    >
                      <div className="aspect-video bg-slate-800 flex items-center justify-center">
                        <FileVideo className="h-12 w-12 text-slate-500" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-white text-sm font-medium truncate">{asset.name}</h4>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                          <span>{formatDuration(asset.duration)}</span>
                          <span>•</span>
                          <span>{asset.size}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {asset.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-slate-600">
                              {tag}
                            </Badge>
                          ))}
                          {asset.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs border-slate-600">
                              +{asset.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex border-t border-slate-600">
                        <Button variant="ghost" size="sm" className="flex-1 h-8 rounded-none">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 h-8 rounded-none">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 h-8 rounded-none text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <div className="h-16 w-16 bg-slate-800 rounded flex items-center justify-center flex-shrink-0">
                        <FileVideo className="h-8 w-8 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{asset.name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                          <span>{formatDuration(asset.duration)}</span>
                          <span>{asset.size}</span>
                          <span>{asset.resolution}</span>
                          <span className="uppercase">{asset.format}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {asset.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-slate-600">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-slate-500 flex-shrink-0">
                        {asset.uploadedAt.toLocaleDateString()}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredAssets.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No assets found</p>
                  <p className="text-sm mt-1">Try adjusting your filters or upload new assets</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}