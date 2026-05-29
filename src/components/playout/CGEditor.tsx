'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff, Save, Play, RefreshCw, Download, Upload, Layers, Type, Image, Zap } from 'lucide-react'

interface CGTemplate {
  id: string
  name: string
  type: 'lower-third' | 'ticker' | 'bug' | 'fullscreen' | 'overlay'
  html: string
  css: string
  isVisible: boolean
}

export default function CGEditor() {
  const [templates, setTemplates] = useState<CGTemplate[]>([
    {
      id: '1',
      name: 'News Lower Third',
      type: 'lower-third',
      html: `<div class="lower-third">
  <div class="title">Breaking News</div>
  <div class="subtitle">Latest updates from around the world</div>
</div>`,
      css: `.lower-third {
  position: absolute;
  bottom: 100px;
  left: 50px;
  background: linear-gradient(90deg, #6b21a8 0%, #9333ea 100%);
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  font-family: Arial, sans-serif;
}

.title {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.subtitle {
  color: rgba(255,255,255,0.8);
  font-size: 16px;
}`,
      isVisible: true
    },
    {
      id: '2',
      name: 'News Ticker',
      type: 'ticker',
      html: `<div class="ticker-container">
  <div class="ticker-content">
    <span class="ticker-item">🔴 BREAKING: Major announcement expected today</span>
    <span class="ticker-item">🌍 Weather: Clear skies across the region</span>
    <span class="ticker-item">📈 Markets: Stocks up 2.5% this morning</span>
  </div>
</div>`,
      css: `.ticker-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1e1e1e;
  height: 50px;
  overflow: hidden;
  border-top: 3px solid #9333ea;
}

.ticker-content {
  display: flex;
  animation: ticker 30s linear infinite;
  height: 100%;
  align-items: center;
}

.ticker-item {
  color: white;
  font-size: 18px;
  white-space: nowrap;
  padding: 0 50px;
  font-family: Arial, sans-serif;
}

@keyframes ticker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}`,
      isVisible: true
    },
    {
      id: '3',
      name: 'Channel Bug',
      type: 'bug',
      html: `<div class="channel-bug">
  <div class="bug-icon">📺</div>
  <div class="bug-text">LIVE</div>
</div>`,
      css: `.channel-bug {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,0,0,0.7);
  padding: 8px 16px;
  border-radius: 20px;
}

.bug-icon {
  font-size: 24px;
}

.bug-text {
  color: white;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2px;
}`,
      isVisible: true
    }
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<string>('1')
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit')
  const previewRef = useRef<HTMLIFrameElement>(null)

  const currentTemplate = templates.find(t => t.id === selectedTemplate)

  useEffect(() => {
    if (previewRef.current && currentTemplate) {
      const doc = previewRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                width: 1920px;
                height: 1080px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                overflow: hidden;
              }
              ${currentTemplate.css}
            </style>
          </head>
          <body>
            ${currentTemplate.html}
          </body>
          </html>
        `)
        doc.close()
      }
    }
  }, [currentTemplate])

  const handleUpdateTemplate = (updates: Partial<CGTemplate>) => {
    setTemplates(templates.map(t =>
      t.id === selectedTemplate ? { ...t, ...updates } : t
    ))
  }

  const handleToggleVisibility = (id: string) => {
    setTemplates(templates.map(t =>
      t.id === id ? { ...t, isVisible: !t.isVisible } : t
    ))
  }

  const handleSave = () => {
    console.log('Saving template:', currentTemplate)
  }

  const getTypeColor = (type: CGTemplate['type']) => {
    switch (type) {
      case 'lower-third': return 'bg-purple-500'
      case 'ticker': return 'bg-blue-500'
      case 'bug': return 'bg-green-500'
      case 'fullscreen': return 'bg-orange-500'
      case 'overlay': return 'bg-pink-500'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">CG Templates</h3>
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'bg-purple-600 border-2 border-purple-400'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getTypeColor(template.type)} shrink-0`}>
                      {template.type}
                    </Badge>
                    <div>
                      <div className="text-white font-medium">{template.name}</div>
                      <div className="text-slate-400 text-xs">Last modified: Today</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleVisibility(template.id)
                    }}
                  >
                    {template.isVisible ? (
                      <Eye className="h-4 w-4 text-green-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {currentTemplate && (
          <Card className="bg-slate-800 border-slate-600">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">Template Properties</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs">Template Name</Label>
                <Input
                  value={currentTemplate.name}
                  onChange={(e) => handleUpdateTemplate({ name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-xs">Template Type</Label>
                <Select
                  value={currentTemplate.type}
                  onValueChange={(value: CGTemplate['type']) => handleUpdateTemplate({ type: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lower-third">Lower Third</SelectItem>
                    <SelectItem value="ticker">News Ticker</SelectItem>
                    <SelectItem value="bug">Channel Bug</SelectItem>
                    <SelectItem value="fullscreen">Fullscreen</SelectItem>
                    <SelectItem value="overlay">Custom Overlay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                  <TabsTrigger value="html" className="data-[state=active]:bg-purple-600">HTML</TabsTrigger>
                  <TabsTrigger value="css" className="data-[state=active]:bg-purple-600">CSS</TabsTrigger>
                </TabsList>
                <TabsContent value="html" className="space-y-2">
                  <Label className="text-slate-300 text-xs">HTML Content</Label>
                  <Textarea
                    value={currentTemplate.html}
                    onChange={(e) => handleUpdateTemplate({ html: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-white font-mono text-xs min-h-[200px]"
                    placeholder="Enter HTML code..."
                  />
                </TabsContent>
                <TabsContent value="css" className="space-y-2">
                  <Label className="text-slate-300 text-xs">CSS Styles</Label>
                  <Textarea
                    value={currentTemplate.css}
                    onChange={(e) => handleUpdateTemplate({ css: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-white font-mono text-xs min-h-[200px]"
                    placeholder="Enter CSS styles..."
                  />
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4">
                <Button size="sm" onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Live Preview</h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">1920x1080</Badge>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <iframe
                ref={previewRef}
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
                title="CG Preview"
              />
              <div className="absolute top-2 left-2 bg-black/60 px-3 py-1 rounded text-white text-xs">
                Preview Mode
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Quick Actions</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="justify-start">
              <Type className="h-4 w-4 mr-2" />
              Add Text
            </Button>
            <Button size="sm" variant="outline" className="justify-start">
              <Image className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            <Button size="sm" variant="outline" className="justify-start">
              <Layers className="h-4 w-4 mr-2" />
              New Layer
            </Button>
            <Button size="sm" variant="outline" className="justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Animation
            </Button>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Active Overlays</h3>
          </div>
          <div className="p-4 space-y-2">
            {templates.filter(t => t.isVisible).map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={`${getTypeColor(template.type)}`}>{template.type}</Badge>
                  <span className="text-white text-sm">{template.name}</span>
                </div>
                <Badge className="bg-green-500">Active</Badge>
              </div>
            ))}
            {templates.filter(t => t.isVisible).length === 0 && (
              <div className="text-center py-4 text-slate-500 text-sm">
                No active overlays
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}