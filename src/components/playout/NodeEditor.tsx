'use client'

import { useState, useCallback, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Play, Pause, Film, Radio, Type, Image, FileText, Mic, Speaker, Clock, Settings } from 'lucide-react'

const NODE_TYPES = {
  video: { icon: Film, color: 'bg-blue-500', label: 'Video Source' },
  audio: { icon: Speaker, color: 'bg-green-500', label: 'Audio Mixer' },
  cg: { icon: Type, color: 'bg-purple-500', label: 'CG Overlay' },
  image: { icon: Image, color: 'bg-pink-500', label: 'Image Sequence' },
  text: { icon: FileText, color: 'bg-orange-500', label: 'Text Ticker' },
  live: { icon: Radio, color: 'bg-red-500', label: 'Live Input' },
  scte: { icon: Clock, color: 'bg-cyan-500', label: 'SCTE-35 Marker' },
  output: { icon: Play, color: 'bg-slate-500', label: 'Program Output' },
}

interface Node {
  id: string
  type: keyof typeof NODE_TYPES
  x: number
  y: number
  label: string
  config?: Record<string, any>
}

interface Connection {
  id: string
  from: string
  to: string
}

function DraggableNode({ type, onAdd }: { type: keyof typeof NODE_TYPES; onAdd: (type: keyof typeof NODE_TYPES) => void }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'node-type',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const nodeConfig = NODE_TYPES[type]
  const Icon = nodeConfig.icon

  return (
    <div
      ref={drag}
      className={`flex items-center gap-3 p-3 bg-slate-700 rounded-lg cursor-grab hover:bg-slate-600 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onAdd(type)}
    >
      <div className={`p-2 rounded-md ${nodeConfig.color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <span className="text-white text-sm font-medium">{nodeConfig.label}</span>
    </div>
  )
}

function CanvasNode({ node, onUpdate, onDelete, onConnect }: {
  node: Node
  onUpdate: (node: Node) => void
  onDelete: (id: string) => void
  onConnect: (from: string, to: string) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const nodeConfig = NODE_TYPES[node.type]
  const Icon = nodeConfig.icon

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
    setIsDragging(true)
    setOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    onUpdate({
      ...node,
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={nodeRef}
      className="absolute"
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Card className="w-64 bg-slate-800 border-slate-600 shadow-xl">
        <div className={`flex items-center gap-3 p-4 border-b border-slate-600 ${nodeConfig.color}/20`}>
          <div className={`p-2 rounded-md ${nodeConfig.color}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <Input
              value={node.label}
              onChange={(e) => onUpdate({ ...node, label: e.target.value })}
              className="bg-transparent border-none text-white font-medium h-6 px-0"
            />
          </div>
          <Badge variant="outline" className="border-slate-500 text-slate-300">
            {node.type}
          </Badge>
        </div>

        <div className="p-4 space-y-3">
          {node.type === 'video' && (
            <>
              <div>
                <Label className="text-slate-300 text-xs">Source File</Label>
                <Input
                  placeholder="/path/to/video.mp4"
                  value={node.config?.source || ''}
                  onChange={(e) => onUpdate({ ...node, config: { ...node.config, source: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-xs">Duration (s)</Label>
                <Input
                  type="number"
                  placeholder="60"
                  value={node.config?.duration || ''}
                  onChange={(e) => onUpdate({ ...node, config: { ...node.config, duration: Number(e.target.value) } })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </>
          )}

          {node.type === 'audio' && (
            <>
              <div>
                <Label className="text-slate-300 text-xs">Audio Source</Label>
                <Select
                  value={node.config?.source || 'default'}
                  onValueChange={(value) => onUpdate({ ...node, config: { ...node.config, source: value } })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
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
                <Label className="text-slate-300 text-xs">Volume</Label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={node.config?.volume || 100}
                  onChange={(e) => onUpdate({ ...node, config: { ...node.config, volume: Number(e.target.value) } })}
                  className="mt-1"
                />
              </div>
            </>
          )}

          {node.type === 'cg' && (
            <>
              <div>
                <Label className="text-slate-300 text-xs">CG Template</Label>
                <Select
                  value={node.config?.template || 'lower-third'}
                  onValueChange={(value) => onUpdate({ ...node, config: { ...node.config, template: value } })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
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
              <div>
                <Label className="text-slate-300 text-xs">Layer</Label>
                <Input
                  type="number"
                  placeholder="1"
                  value={node.config?.layer || 1}
                  onChange={(e) => onUpdate({ ...node, config: { ...node.config, layer: Number(e.target.value) } })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </>
          )}

          {node.type === 'scte' && (
            <>
              <div>
                <Label className="text-slate-300 text-xs">Signal Type</Label>
                <Select
                  value={node.config?.signalType || 'splice_insert'}
                  onValueChange={(value) => onUpdate({ ...node, config: { ...node.config, signalType: value } })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="splice_insert">Splice Insert</SelectItem>
                    <SelectItem value="time_signal">Time Signal</SelectItem>
                    <SelectItem value="private">Private Command</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300 text-xs">Preroll (frames)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={node.config?.preroll || 30}
                  onChange={(e) => onUpdate({ ...node, config: { ...node.config, preroll: Number(e.target.value) } })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </>
          )}

          {node.type === 'text' && (
            <>
              <div>
                <Label className="text-slate-300 text-xs">Ticker Text</Label>
                <Input
                  placeholder="Breaking news..."
                  value={node.config?.text || ''}
                  onChange={(e) => onUpdate({ ...node, config: { ...node.config, text: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-xs">Speed</Label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={node.config?.speed || 5}
                  onChange={(e) => onUpdate({ ...node, config: { ...node.config, speed: Number(e.target.value) } })}
                  className="mt-1"
                />
              </div>
            </>
          )}

          {node.type === 'live' && (
            <>
              <div>
                <Label className="text-slate-300 text-xs">Input Source</Label>
                <Input
                  placeholder="rtmp://source/live/stream"
                  value={node.config?.source || ''}
                  onChange={(e) => onUpdate({ ...node, config: { ...node.config, source: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">LIVE</Badge>
                <span className="text-green-400 text-xs font-semibold">Signal Active</span>
              </div>
            </>
          )}

          {node.type === 'image' && (
            <>
              <div>
                <Label className="text-slate-300 text-xs">Image Folder</Label>
                <Input
                  placeholder="/path/to/images/"
                  value={node.config?.folder || ''}
                  onChange={(e) => onUpdate({ ...node, config: { ...node.config, folder: e.target.value } })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-xs">Interval (s)</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={node.config?.interval || 5}
                  onChange={(e) => onUpdate({ ...node, config: { ...node.config, interval: Number(e.target.value) } })}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
            </>
          )}
        </div>

        <div className="p-4 pt-0 flex gap-2">
          <Button size="sm" variant="destructive" className="flex-1" onClick={() => onDelete(node.id)}>
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>

        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-600 rounded-full border-2 border-slate-800 hover:bg-purple-500 cursor-crosshair" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-600 rounded-full border-2 border-slate-800 hover:bg-purple-500 cursor-crosshair" />
      </Card>
    </div>
  )
}

function NodeCanvas({ nodes, connections, onUpdateNode, onDeleteNode, onConnect, onDisconnect }: {
  nodes: Node[]
  connections: Connection[]
  onUpdateNode: (node: Node) => void
  onDeleteNode: (id: string) => void
  onConnect: (from: string, to: string) => void
  onDisconnect: (connectionId: string) => void
}) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectFrom, setConnectFrom] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsConnecting(false)
      setConnectFrom(null)
    }
  }

  return (
    <div
      ref={canvasRef}
      className="relative h-[600px] bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-700 overflow-hidden"
      onClick={handleCanvasClick}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((conn) => {
          const fromNode = nodes.find(n => n.id === conn.from)
          const toNode = nodes.find(n => n.id === conn.to)
          if (!fromNode || !toNode) return null

          const fromX = fromNode.x + 256
          const fromY = fromNode.y + 100
          const toX = toNode.x
          const toY = toNode.y + 100

          return (
            <g key={conn.id}>
              <path
                d={`M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`}
                stroke="#a855f7"
                strokeWidth="2"
                fill="none"
                className="drop-shadow-lg"
              />
              <circle cx={fromX} cy={fromY} r="4" fill="#a855f7" />
              <circle cx={toX} cy={toY} r="4" fill="#a855f7" />
            </g>
          )
        })}
      </svg>

      {nodes.map((node) => (
        <CanvasNode
          key={node.id}
          node={node}
          onUpdate={onUpdateNode}
          onDelete={onDeleteNode}
          onConnect={onConnect}
        />
      ))}

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-slate-800 rounded-full">
                <Plus className="h-8 w-8 text-slate-500" />
              </div>
            </div>
            <p className="text-slate-500 text-lg">Drag nodes from the sidebar to get started</p>
            <p className="text-slate-600 text-sm mt-2">Create your playout workflow by connecting different nodes</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function NodeEditor() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'video-1',
      type: 'video',
      x: 100,
      y: 100,
      label: 'Main Video',
      config: { source: '/content/main-program.mp4', duration: 3600 }
    },
    {
      id: 'cg-1',
      type: 'cg',
      x: 450,
      y: 50,
      label: 'Lower Third',
      config: { template: 'lower-third', layer: 1 }
    },
    {
      id: 'audio-1',
      type: 'audio',
      x: 450,
      y: 200,
      label: 'Audio Mixer',
      config: { source: 'default', volume: 100 }
    },
    {
      id: 'output-1',
      type: 'output',
      x: 800,
      y: 125,
      label: 'Program Output',
    }
  ])
  const [connections, setConnections] = useState<Connection[]>([
    { id: 'conn-1', from: 'video-1', to: 'cg-1' },
    { id: 'conn-2', from: 'video-1', to: 'audio-1' },
    { id: 'conn-3', from: 'cg-1', to: 'output-1' },
    { id: 'conn-4', from: 'audio-1', to: 'output-1' }
  ])

  const handleAddNode = useCallback((type: keyof typeof NODE_TYPES) => {
    const nodeConfig = NODE_TYPES[type]
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      label: nodeConfig.label,
      config: {}
    }
    setNodes([...nodes, newNode])
  }, [nodes])

  const handleUpdateNode = useCallback((updatedNode: Node) => {
    setNodes(nodes.map(n => n.id === updatedNode.id ? updatedNode : n))
  }, [nodes])

  const handleDeleteNode = useCallback((id: string) => {
    setNodes(nodes.filter(n => n.id !== id))
    setConnections(connections.filter(c => c.from !== id && c.to !== id))
  }, [nodes, connections])

  const handleConnect = useCallback((from: string, to: string) => {
    const existing = connections.find(c => c.from === from && c.to === to)
    if (!existing && from !== to) {
      setConnections([...connections, {
        id: `conn-${Date.now()}`,
        from,
        to
      }])
    }
  }, [connections])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4">
        <div className="w-64 space-y-3">
          <h3 className="text-white font-semibold mb-3">Node Palette</h3>
          {Object.entries(NODE_TYPES).map(([type]) => (
            <DraggableNode
              key={type}
              type={type as keyof typeof NODE_TYPES}
              onAdd={handleAddNode}
            />
          ))}
        </div>

        <div className="flex-1">
          <NodeCanvas
            nodes={nodes}
            connections={connections}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onConnect={handleConnect}
            onDisconnect={() => {}}
          />
        </div>
      </div>
    </DndProvider>
  )
}