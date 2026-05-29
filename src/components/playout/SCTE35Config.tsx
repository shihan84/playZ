'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Play, Save, Radio, Clock, FileCode, Download, AlertTriangle } from 'lucide-react'

interface SCTE35Marker {
  id: string
  name: string
  signalType: 'splice_insert' | 'time_signal' | 'private'
  prerollFrames: number
  duration: number
  autoReturn: boolean
  description: string
  tier: 'unknown' | 'national' | 'regional' | 'provider'
  position: number
}

export default function SCTE35Config() {
  const [markers, setMarkers] = useState<SCTE35Marker[]>([
    {
      id: '1',
      name: 'Commercial Break 1',
      signalType: 'splice_insert',
      prerollFrames: 30,
      duration: 120,
      autoReturn: true,
      description: 'First ad break in the program',
      tier: 'national',
      position: 1200
    },
    {
      id: '2',
      name: 'Commercial Break 2',
      signalType: 'splice_insert',
      prerollFrames: 30,
      duration: 180,
      autoReturn: true,
      description: 'Second ad break',
      tier: 'national',
      position: 2400
    }
  ])

  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const handleAddMarker = () => {
    const newMarker: SCTE35Marker = {
      id: Date.now().toString(),
      name: 'New Marker',
      signalType: 'splice_insert',
      prerollFrames: 30,
      duration: 60,
      autoReturn: true,
      description: '',
      tier: 'national',
      position: 0
    }
    setMarkers([...markers, newMarker])
    setSelectedMarker(newMarker.id)
  }

  const handleDeleteMarker = (id: string) => {
    setMarkers(markers.filter(m => m.id !== id))
    if (selectedMarker === id) setSelectedMarker(null)
  }

  const handleUpdateMarker = (id: string, updates: Partial<SCTE35Marker>) => {
    setMarkers(markers.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const generateSCTE35Base64 = (marker: SCTE35Marker) => {
    const command = {
      splice_insert: 0x05,
      time_signal: 0x06,
      private: 0xFF
    }[marker.signalType]

    const tier = {
      unknown: 0x0F,
      national: 0x00,
      regional: 0x0F,
      provider: 0x0F
    }[marker.tier]

    const splice = {
      command: command,
      tier: tier,
      preroll: marker.prerollFrames,
      duration: marker.duration,
      autoReturn: marker.autoReturn ? 1 : 0
    }

    return btoa(JSON.stringify(splice))
  }

  const formatTime = (frames: number) => {
    const seconds = frames / 30
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const currentMarker = markers.find(m => m.id === selectedMarker)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">SCTE-35 Markers</h3>
              <Button size="sm" onClick={handleAddMarker}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
            {markers.map((marker, index) => (
              <div
                key={marker.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedMarker === marker.id
                    ? 'bg-purple-600 border-2 border-purple-400'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                onClick={() => setSelectedMarker(marker.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-purple-400" />
                    <span className="text-white font-medium text-sm">{marker.name}</span>
                  </div>
                  <Badge variant="outline" className="border-slate-500 text-slate-300 text-xs">
                    #{index + 1}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{formatTime(marker.position)}</span>
                  <span>•</span>
                  <span>{marker.signalType}</span>
                  <span>•</span>
                  <span>{marker.prerollFrames} frames</span>
                </div>
              </div>
            ))}

            {markers.length === 0 && (
              <div className="text-center py-8">
                <div className="p-4 bg-slate-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Radio className="h-8 w-8 text-slate-500" />
                </div>
                <p className="text-slate-500 text-sm">No markers configured</p>
                <p className="text-slate-600 text-xs mt-1">Add your first SCTE-35 marker</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {currentMarker ? (
          <>
            <Card className="bg-slate-800 border-slate-600">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Marker Configuration</h3>
                    <p className="text-slate-400 text-sm mt-1">Configure SCTE-35 splice and ad insertion settings</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <FileCode className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs">Marker Name</Label>
                    <Input
                      value={currentMarker.name}
                      onChange={(e) => handleUpdateMarker(currentMarker.id, { name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter marker name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs">Signal Type</Label>
                    <Select
                      value={currentMarker.signalType}
                      onValueChange={(value: SCTE35Marker['signalType']) =>
                        handleUpdateMarker(currentMarker.id, { signalType: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="splice_insert">Splice Insert</SelectItem>
                        <SelectItem value="time_signal">Time Signal</SelectItem>
                        <SelectItem value="private">Private Command</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs">Description</Label>
                  <Textarea
                    value={currentMarker.description}
                    onChange={(e) => handleUpdateMarker(currentMarker.id, { description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                    placeholder="Describe this marker..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs">Preroll (frames)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[currentMarker.prerollFrames]}
                        onValueChange={([value]) => handleUpdateMarker(currentMarker.id, { prerollFrames: value })}
                        max={120}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={currentMarker.prerollFrames}
                        onChange={(e) => handleUpdateMarker(currentMarker.id, { prerollFrames: Number(e.target.value) })}
                        className="w-20 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <p className="text-slate-500 text-xs">
                      {formatTime(currentMarker.prerollFrames)} before splice point
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs">Duration (seconds)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[currentMarker.duration]}
                        onValueChange={([value]) => handleUpdateMarker(currentMarker.id, { duration: value })}
                        max={600}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={currentMarker.duration}
                        onChange={(e) => handleUpdateMarker(currentMarker.id, { duration: Number(e.target.value) })}
                        className="w-20 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs">Position (frames)</Label>
                    <Input
                      type="number"
                      value={currentMarker.position}
                      onChange={(e) => handleUpdateMarker(currentMarker.id, { position: Number(e.target.value) })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <p className="text-slate-500 text-xs">{formatTime(currentMarker.position)} into program</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300 text-xs">Content Tier</Label>
                    <Select
                      value={currentMarker.tier}
                      onValueChange={(value: SCTE35Marker['tier']) =>
                        handleUpdateMarker(currentMarker.id, { tier: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unknown">Unknown</SelectItem>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                        <SelectItem value="provider">Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Auto Return</div>
                    <div className="text-slate-400 text-xs">Automatically return to program after ad</div>
                  </div>
                  <Switch
                    checked={currentMarker.autoReturn}
                    onCheckedChange={(checked) => handleUpdateMarker(currentMarker.id, { autoReturn: checked })}
                  />
                </div>

                <div className="pt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteMarker(currentMarker.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Marker
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Test Signal
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-white font-semibold">SCTE-35 Output Preview</h3>
              </div>
              <Tabs defaultValue="base64" className="p-4">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                  <TabsTrigger value="base64" className="data-[state=active]:bg-purple-600">Base64</TabsTrigger>
                  <TabsTrigger value="hex" className="data-[state=active]:bg-purple-600">Hex</TabsTrigger>
                  <TabsTrigger value="json" className="data-[state=active]:bg-purple-600">JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="base64" className="mt-4 space-y-2">
                  <Label className="text-slate-300 text-xs">Base64 Encoded Signal</Label>
                  <Textarea
                    value={generateSCTE35Base64(currentMarker)}
                    readOnly
                    className="bg-slate-900 border-slate-600 text-white font-mono text-xs min-h-[100px]"
                  />
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </TabsContent>
                <TabsContent value="hex" className="mt-4 space-y-2">
                  <Label className="text-slate-300 text-xs">Hex Representation</Label>
                  <Textarea
                    value={`/DAvAAAAAAAA///wBQb+AAAAAAAADAAAMyAA7+f/cgAAkxAAIpgXyAAAEAAqD+CDwY`}
                    readOnly
                    className="bg-slate-900 border-slate-600 text-white font-mono text-xs min-h-[100px]"
                  />
                </TabsContent>
                <TabsContent value="json" className="mt-4 space-y-2">
                  <Label className="text-slate-300 text-xs">JSON Structure</Label>
                  <Textarea
                    value={JSON.stringify({
                      splice_command: currentMarker.signalType,
                      splice_immediate_flag: false,
                      splice_time: {
                        time_specified_flag: true,
                        pts_time: Math.floor(currentMarker.position * 90000 / 30)
                      },
                      duration: currentMarker.duration * 90000,
                      splice_event_id: parseInt(currentMarker.id),
                      unique_program_id: 1,
                      avail_num: 1,
                        avails_expected: 1,
                      auto_return: currentMarker.autoReturn
                    }, null, 2)}
                    readOnly
                    className="bg-slate-900 border-slate-600 text-white font-mono text-xs min-h-[200px]"
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </>
        ) : (
          <Card className="bg-slate-800 border-slate-600">
            <div className="p-12 text-center">
              <div className="p-4 bg-slate-700/50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Radio className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">No Marker Selected</h3>
              <p className="text-slate-400 mb-6">Select a marker from the list or create a new one</p>
              <Button onClick={handleAddMarker}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Marker
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}