'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Film, Play, Pause, Radio, Type, Image, FileText, Mic, Plus, ChevronRight, ChevronDown, Save, Trash2, Copy, MoveUp, MoveDown } from 'lucide-react'

interface WorkflowStep {
  id: string
  type: 'video' | 'audio' | 'cg' | 'image' | 'text' | 'live' | 'scte' | 'output'
  name: string
  config: Record<string, any>
  enabled: boolean
}

const STEP_TYPES = {
  video: { icon: Film, color: 'bg-blue-500', label: 'Video Source', description: 'Add video content to playout' },
  audio: { icon: Mic, color: 'bg-green-500', label: 'Audio Mixer', description: 'Configure audio settings' },
  cg: { icon: Type, color: 'bg-purple-500', label: 'CG Overlay', description: 'Add graphics overlays' },
  image: { icon: Image, color: 'bg-pink-500', label: 'Image Sequence', description: 'Display image slideshows' },
  text: { icon: FileText, color: 'bg-orange-500', label: 'Text Ticker', description: 'Show scrolling text' },
  live: { icon: Radio, color: 'bg-red-500', label: 'Live Input', description: 'Broadcast live content' },
  scte: { icon: Radio, color: 'bg-cyan-500', label: 'SCTE-35 Marker', description: 'Insert ad markers' },
  output: { icon: Play, color: 'bg-slate-500', label: 'Program Output', description: 'Configure output settings' },
}

export default function WorkflowBuilder() {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 'step-1',
      type: 'video',
      name: 'Main Program',
      enabled: true,
      config: {
        source: '/content/main-program.mp4',
        duration: 3600,
        loop: true,
        startAt: 0
      }
    },
    {
      id: 'step-2',
      type: 'cg',
      name: 'Lower Third',
      enabled: true,
      config: {
        template: 'lower-third',
        layer: 1,
        duration: 10,
        autoHide: true
      }
    },
    {
      id: 'step-3',
      type: 'audio',
      name: 'Audio Mix',
      enabled: true,
      config: {
        source: 'default',
        volume: 100,
        fadeIn: 0,
        fadeOut: 0
      }
    },
    {
      id: 'step-4',
      type: 'output',
      name: 'Stream Output',
      enabled: true,
      config: {
        format: 'hls',
        bitrate: 5000,
        codec: 'h264'
      }
    }
  ])

  const [selectedStep, setSelectedStep] = useState<string | null>('step-1')
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['step-1', 'step-2', 'step-3', 'step-4']))
  const [showAddPanel, setShowAddPanel] = useState(false)

  const addStep = (type: keyof typeof STEP_TYPES) => {
    const stepType = STEP_TYPES[type]
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      name: stepType.label,
      enabled: true,
      config: getDefaultConfig(type)
    }
    setSteps([...steps, newStep])
    setSelectedStep(newStep.id)
    setExpandedSteps(new Set([...expandedSteps, newStep.id]))
    setShowAddPanel(false)
  }

  const getDefaultConfig = (type: string): Record<string, any> => {
    switch (type) {
      case 'video':
        return { source: '', duration: 60, loop: false, startAt: 0 }
      case 'audio':
        return { source: 'default', volume: 100, fadeIn: 0, fadeOut: 0 }
      case 'cg':
        return { template: 'lower-third', layer: 1, duration: 10, autoHide: true }
      case 'image':
        return { folder: '', interval: 5, transition: 'fade' }
      case 'text':
        return { text: '', speed: 5, position: 'bottom' }
      case 'live':
        return { source: '', latency: 0 }
      case 'scte':
        return { signalType: 'splice_insert', preroll: 30, duration: 0 }
      case 'output':
        return { format: 'hls', bitrate: 5000, codec: 'h264' }
      default:
        return {}
    }
  }

  const deleteStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id))
    if (selectedStep === id) {
      setSelectedStep(null)
    }
  }

  const duplicateStep = (step: WorkflowStep) => {
    const newStep: WorkflowStep = {
      ...step,
      id: `step-${Date.now()}`,
      name: `${step.name} (Copy)`
    }
    const index = steps.findIndex(s => s.id === step.id)
    const newSteps = [...steps]
    newSteps.splice(index + 1, 0, newStep)
    setSteps(newSteps)
  }

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(s => s.id === id)
    if (direction === 'up' && index > 0) {
      const newSteps = [...steps]
      ;[newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]]
      setSteps(newSteps)
    } else if (direction === 'down' && index < steps.length - 1) {
      const newSteps = [...steps]
      ;[newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]]
      setSteps(newSteps)
    }
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSteps(newExpanded)
  }

  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setSteps(steps.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const updateConfig = (id: string, configUpdates: Record<string, any>) => {
    setSteps(steps.map(s => s.id === id ? { ...s, config: { ...s.config, ...configUpdates } } : s))
  }

  const selectedStepData = steps.find(s => s.id === selectedStep)
  const stepTypeConfig = selectedStepData ? STEP_TYPES[selectedStepData.type] : null

  return (
    <div className="flex gap-6 h-[calc(100vh-250px)]">
      {/* Left Panel - Workflow Steps */}
      <div className="w-96 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Workflow Steps</h3>
          <Button size="sm" onClick={() => setShowAddPanel(!showAddPanel)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        {/* Add Step Panel */}
        {showAddPanel && (
          <Card className="mb-4 bg-slate-800 border-slate-700">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STEP_TYPES).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      className="h-auto flex-col gap-2 p-3 hover:bg-slate-700"
                      onClick={() => addStep(type as keyof typeof STEP_TYPES)}
                    >
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs">{config.label}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {steps.map((step, index) => {
            const typeConfig = STEP_TYPES[step.type]
            const Icon = typeConfig.icon
            const isExpanded = expandedSteps.has(step.id)
            const isSelected = selectedStep === step.id

            return (
              <Card
                key={step.id}
                className={`cursor-pointer transition-all ${
                  isSelected ? 'bg-purple-900/30 border-purple-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedStep(step.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${typeConfig.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">{step.name}</span>
                        {!step.enabled && (
                          <Badge variant="outline" className="text-xs">Disabled</Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{typeConfig.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Checkbox
                        checked={step.enabled}
                        onCheckedChange={(checked) => {
                          updateStep(step.id, { enabled: checked as boolean })
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpand(step.id)
                        }}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveStep(step.id, 'up')
                          }}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveStep(step.id, 'down')
                          }}
                          disabled={index === steps.length - 1}
                        >
                          <MoveDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateStep(step)
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-red-400 hover:text-red-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteStep(step.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Right Panel - Configuration */}
      <div className="flex-1 overflow-y-auto pr-2">
        {selectedStepData ? (
          <div className="space-y-4">
            {/* Header */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {stepTypeConfig && (
                      <div className={`p-3 rounded-lg ${stepTypeConfig.color}`}>
                        <stepTypeConfig.icon className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-white">{selectedStepData.name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {stepTypeConfig?.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save Workflow
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Configuration Form */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="step-name">Step Name</Label>
                  <Input
                    id="step-name"
                    value={selectedStepData.name}
                    onChange={(e) => updateStep(selectedStepData.id, { name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                {selectedStepData.type === 'video' && (
                  <>
                    <div>
                      <Label htmlFor="video-source">Video Source</Label>
                      <Input
                        id="video-source"
                        placeholder="/path/to/video.mp4"
                        value={selectedStepData.config.source || ''}
                        onChange={(e) => updateConfig(selectedStepData.id, { source: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="video-duration">Duration (seconds)</Label>
                        <Input
                          id="video-duration"
                          type="number"
                          placeholder="60"
                          value={selectedStepData.config.duration || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { duration: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="video-start">Start At (seconds)</Label>
                        <Input
                          id="video-start"
                          type="number"
                          placeholder="0"
                          value={selectedStepData.config.startAt || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { startAt: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="video-loop"
                        checked={selectedStepData.config.loop || false}
                        onCheckedChange={(checked) => updateConfig(selectedStepData.id, { loop: checked })}
                      />
                      <Label htmlFor="video-loop" className="text-slate-300">Loop video</Label>
                    </div>
                  </>
                )}

                {selectedStepData.type === 'audio' && (
                  <>
                    <div>
                      <Label htmlFor="audio-source">Audio Source</Label>
                      <Select
                        value={selectedStepData.config.source || 'default'}
                        onValueChange={(value) => updateConfig(selectedStepData.id, { source: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default Audio</SelectItem>
                          <SelectItem value="voiceover">Voiceover Track</SelectItem>
                          <SelectItem value="music">Background Music</SelectItem>
                          <SelectItem value="custom">Custom Input</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="audio-volume">Volume (%)</Label>
                      <Input
                        id="audio-volume"
                        type="range"
                        min="0"
                        max="100"
                        value={selectedStepData.config.volume || 100}
                        onChange={(e) => updateConfig(selectedStepData.id, { volume: Number(e.target.value) })}
                      />
                      <div className="text-slate-400 text-sm mt-1">{selectedStepData.config.volume || 100}%</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="audio-fadein">Fade In (seconds)</Label>
                        <Input
                          id="audio-fadein"
                          type="number"
                          placeholder="0"
                          value={selectedStepData.config.fadeIn || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { fadeIn: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="audio-fadeout">Fade Out (seconds)</Label>
                        <Input
                          id="audio-fadeout"
                          type="number"
                          placeholder="0"
                          value={selectedStepData.config.fadeOut || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { fadeOut: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedStepData.type === 'cg' && (
                  <>
                    <div>
                      <Label htmlFor="cg-template">CG Template</Label>
                      <Select
                        value={selectedStepData.config.template || 'lower-third'}
                        onValueChange={(value) => updateConfig(selectedStepData.id, { template: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lower-third">Lower Third</SelectItem>
                          <SelectItem value="ticker">News Ticker</SelectItem>
                          <SelectItem value="bug">Channel Bug</SelectItem>
                          <SelectItem value="fullscreen">Fullscreen</SelectItem>
                          <SelectItem value="custom">Custom Template</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cg-layer">Layer</Label>
                        <Input
                          id="cg-layer"
                          type="number"
                          placeholder="1"
                          value={selectedStepData.config.layer || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { layer: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cg-duration">Duration (seconds)</Label>
                        <Input
                          id="cg-duration"
                          type="number"
                          placeholder="10"
                          value={selectedStepData.config.duration || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { duration: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="cg-autohide"
                        checked={selectedStepData.config.autoHide || false}
                        onCheckedChange={(checked) => updateConfig(selectedStepData.id, { autoHide: checked })}
                      />
                      <Label htmlFor="cg-autohide" className="text-slate-300">Auto-hide after duration</Label>
                    </div>
                  </>
                )}

                {selectedStepData.type === 'text' && (
                  <>
                    <div>
                      <Label htmlFor="ticker-text">Ticker Text</Label>
                      <Textarea
                        id="ticker-text"
                        placeholder="Breaking news..."
                        value={selectedStepData.config.text || ''}
                        onChange={(e) => updateConfig(selectedStepData.id, { text: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ticker-speed">Scroll Speed (1-10)</Label>
                        <Input
                          id="ticker-speed"
                          type="number"
                          min="1"
                          max="10"
                          placeholder="5"
                          value={selectedStepData.config.speed || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { speed: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ticker-position">Position</Label>
                        <Select
                          value={selectedStepData.config.position || 'bottom'}
                          onValueChange={(value) => updateConfig(selectedStepData.id, { position: value })}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                            <SelectItem value="middle">Middle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {selectedStepData.type === 'live' && (
                  <>
                    <div>
                      <Label htmlFor="live-source">Live Input Source</Label>
                      <Input
                        id="live-source"
                        placeholder="rtmp://source/live/stream"
                        value={selectedStepData.config.source || ''}
                        onChange={(e) => updateConfig(selectedStepData.id, { source: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="live-latency">Latency (ms)</Label>
                      <Input
                        id="live-latency"
                        type="number"
                        placeholder="0"
                        value={selectedStepData.config.latency || ''}
                        onChange={(e) => updateConfig(selectedStepData.id, { latency: Number(e.target.value) })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-red-900/20 rounded-lg border border-red-900/50">
                      <Radio className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 text-sm font-medium">Live signal will be broadcasted in real-time</span>
                    </div>
                  </>
                )}

                {selectedStepData.type === 'image' && (
                  <>
                    <div>
                      <Label htmlFor="image-folder">Image Folder</Label>
                      <Input
                        id="image-folder"
                        placeholder="/path/to/images/"
                        value={selectedStepData.config.folder || ''}
                        onChange={(e) => updateConfig(selectedStepData.id, { folder: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="image-interval">Display Interval (seconds)</Label>
                        <Input
                          id="image-interval"
                          type="number"
                          placeholder="5"
                          value={selectedStepData.config.interval || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { interval: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image-transition">Transition Effect</Label>
                        <Select
                          value={selectedStepData.config.transition || 'fade'}
                          onValueChange={(value) => updateConfig(selectedStepData.id, { transition: value })}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fade">Fade</SelectItem>
                            <SelectItem value="slide">Slide</SelectItem>
                            <SelectItem value="zoom">Zoom</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {selectedStepData.type === 'scte' && (
                  <>
                    <div>
                      <Label htmlFor="scte-signal">Signal Type</Label>
                      <Select
                        value={selectedStepData.config.signalType || 'splice_insert'}
                        onValueChange={(value) => updateConfig(selectedStepData.id, { signalType: value })}
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="scte-preroll">Preroll (frames)</Label>
                        <Input
                          id="scte-preroll"
                          type="number"
                          placeholder="30"
                          value={selectedStepData.config.preroll || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { preroll: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="scte-duration">Duration (seconds, 0 = auto)</Label>
                        <Input
                          id="scte-duration"
                          type="number"
                          placeholder="0"
                          value={selectedStepData.config.duration || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { duration: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedStepData.type === 'output' && (
                  <>
                    <div>
                      <Label htmlFor="output-format">Output Format</Label>
                      <Select
                        value={selectedStepData.config.format || 'hls'}
                        onValueChange={(value) => updateConfig(selectedStepData.id, { format: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hls">HLS</SelectItem>
                          <SelectItem value="rtmp">RTMP</SelectItem>
                          <SelectItem value="srt">SRT</SelectItem>
                          <SelectItem value="dash">DASH</SelectItem>
                          <SelectItem value="webrtc">WebRTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="output-bitrate">Bitrate (kbps)</Label>
                        <Input
                          id="output-bitrate"
                          type="number"
                          placeholder="5000"
                          value={selectedStepData.config.bitrate || ''}
                          onChange={(e) => updateConfig(selectedStepData.id, { bitrate: Number(e.target.value) })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="output-codec">Video Codec</Label>
                        <Select
                          value={selectedStepData.config.codec || 'h264'}
                          onValueChange={(value) => updateConfig(selectedStepData.id, { codec: value })}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="h264">H.264</SelectItem>
                            <SelectItem value="h265">H.265</SelectItem>
                            <SelectItem value="vp9">VP9</SelectItem>
                            <SelectItem value="av1">AV1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Step Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-start gap-3">
                    {stepTypeConfig && (
                      <div className={`p-2 rounded-md ${stepTypeConfig.color}`}>
                        <stepTypeConfig.icon className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1">{selectedStepData.name}</div>
                      <div className="text-slate-400 text-sm mb-2">{stepTypeConfig?.label}</div>
                      <Badge className={selectedStepData.enabled ? 'bg-green-500' : 'bg-slate-600'}>
                        {selectedStepData.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700 h-full flex items-center justify-center">
            <CardContent>
              <div className="text-center">
                <div className="p-4 bg-slate-700 rounded-full inline-block mb-4">
                  <Plus className="h-8 w-8 text-slate-500" />
                </div>
                <p className="text-slate-400 text-lg">Select a step to configure</p>
                <p className="text-slate-500 text-sm mt-2">Or add a new step to get started</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}