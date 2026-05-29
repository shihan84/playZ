'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Eye, EyeOff, Plus, Save, Trash2, Copy, Play, Settings, Type, MessageSquare, Tv as TvIcon, Layers } from 'lucide-react'

interface CGTemplate {
  id: string
  name: string
  type: 'lower-third' | 'ticker' | 'bug' | 'fullscreen' | 'overlay'
  html: string
  css: string
  layer: number
  isVisible: boolean
  createdAt: Date
}

export default function GraphicsPage() {
  const [templates, setTemplates] = useState<CGTemplate[]>([
    {
      id: '1',
      name: 'News Lower Third',
      type: 'lower-third',
      html: `<div class="lower-third">
  <div class="name">John Smith</div>
  <div class="title">Senior Reporter</div>
</div>`,
      css: `.lower-third {
  position: absolute;
  bottom: 50px;
  left: 50px;
  padding: 15px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}
.name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}
.title {
  font-size: 14px;
  opacity: 0.9;
}`,
      layer: 1,
      isVisible: false,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Breaking News Ticker',
      type: 'ticker',
      html: `<div class="ticker">
  <div class="ticker-content">
    ⚡ BREAKING NEWS: Important story developing...
  </div>
</div>`,
      css: `.ticker {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  background: #ef4444;
  padding: 10px 0;
  overflow: hidden;
}
.ticker-content {
  white-space: nowrap;
  animation: scroll 20s linear infinite;
  color: white;
  font-weight: bold;
  font-size: 18px;
  padding-left: 100%;
}
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}`,
      layer: 2,
      isVisible: true,
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Channel Logo Bug',
      type: 'bug',
      html: `<div class="channel-bug">
  <div class="logo">CH01</div>
</div>`,
      css: `.channel-bug {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color: white;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  color: #a855f7;
}`,
      layer: 3,
      isVisible: true,
      createdAt: new Date()
    },
    {
      id: '4',
      name: 'Full Screen Warning',
      type: 'fullscreen',
      html: `<div class="fullscreen">
  <div class="icon">⚠️</div>
  <div class="title">EMERGENCY ALERT</div>
  <div class="message">Important message for all viewers</div>
</div>`,
      css: `.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(239, 68, 68, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 9999;
}
.icon {
  font-size: 80px;
  margin-bottom: 20px;
}
.title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
}
.message {
  font-size: 24px;
  text-align: center;
  max-width: 800px;
}`,
      layer: 10,
      isVisible: false,
      createdAt: new Date()
    },
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<CGTemplate | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<CGTemplate | null>(null)

  const toggleVisibility = (templateId: string) => {
    setTemplates(templates.map(t =>
      t.id === templateId ? { ...t, isVisible: !t.isVisible } : t
    ))
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId))
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null)
    }
  }

  const duplicateTemplate = (template: CGTemplate) => {
    const newTemplate: CGTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date()
    }
    setTemplates([...templates, newTemplate])
  }

  const openEditor = (template: CGTemplate) => {
    setEditingTemplate(template)
    setIsEditorOpen(true)
  }

  const saveTemplate = () => {
    if (editingTemplate) {
      setTemplates(templates.map(t =>
        t.id === editingTemplate.id ? editingTemplate : t
      ))
      setIsEditorOpen(false)
      setEditingTemplate(null)
    }
  }

  const getTypeIcon = (type: CGTemplate['type']) => {
    switch (type) {
      case 'lower-third':
        return Type
      case 'ticker':
        return MessageSquare
      case 'bug':
        return TvIcon
      case 'fullscreen':
        return Layers
      default:
        return Settings
    }
  }

  const getTypeBadgeColor = (type: CGTemplate['type']) => {
    switch (type) {
      case 'lower-third':
        return 'bg-blue-600'
      case 'ticker':
        return 'bg-orange-600'
      case 'bug':
        return 'bg-purple-600'
      case 'fullscreen':
        return 'bg-red-600'
      default:
        return 'bg-slate-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Graphics & Overlays</h1>
          <p className="text-slate-400 mt-1">Create and manage CG templates</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* On Air Graphics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-400" />
            On Air ({templates.filter(t => t.isVisible).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.filter(t => t.isVisible).map((template) => {
              const Icon = getTypeIcon(template.type)
              return (
                <div key={template.id} className="p-4 bg-slate-700 rounded-lg border-2 border-green-500">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{template.name}</h4>
                      <p className="text-slate-400 text-xs">Layer {template.layer}</p>
                    </div>
                  </div>
                  <Toggle
                    pressed={true}
                    onPressedChange={() => toggleVisibility(template.id)}
                    className="w-full bg-green-600 data-[state=on]:bg-green-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visible
                  </Toggle>
                </div>
              )
            })}
            {templates.filter(t => t.isVisible).length === 0 && (
              <div className="col-span-full text-center py-8 text-slate-500">
                <EyeOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No graphics on air</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Templates */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Templates ({templates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => {
              const Icon = getTypeIcon(template.type)
              return (
                <div key={template.id} className="bg-slate-700 rounded-lg overflow-hidden">
                  {/* Preview */}
                  <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                    <div
                      className="absolute inset-4 overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: template.html }}
                      style={{ display: 'none' }}
                    />
                    <div className="text-center">
                      <Icon className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">{template.type}</p>
                    </div>
                    {template.isVisible && (
                      <Badge className="absolute top-2 right-2 bg-green-600">ON AIR</Badge>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h4 className="text-white font-medium mb-1">{template.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                      <Badge className={getTypeBadgeColor(template.type)}>
                        {template.type}
                      </Badge>
                      <span>Layer {template.layer}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditor(template)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Toggle
                        pressed={template.isVisible}
                        onPressedChange={() => toggleVisibility(template.id)}
                        className={template.isVisible ? 'bg-green-600' : ''}
                      >
                        {template.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Toggle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateTemplate(template)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Template Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Template</DialogTitle>
          </DialogHeader>

          {editingTemplate && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-name" className="text-slate-300">Name</Label>
                  <Input
                    id="template-name"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="template-layer" className="text-slate-300">Layer</Label>
                  <Input
                    id="template-layer"
                    type="number"
                    value={editingTemplate.layer}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, layer: Number(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="template-type" className="text-slate-300">Type</Label>
                <Select
                  value={editingTemplate.type}
                  onValueChange={(value: any) => setEditingTemplate({ ...editingTemplate, type: value })}
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

              {/* HTML Editor */}
              <div>
                <Label htmlFor="template-html" className="text-slate-300">HTML</Label>
                <Textarea
                  id="template-html"
                  value={editingTemplate.html}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, html: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                  rows={8}
                  placeholder="Enter HTML code..."
                />
              </div>

              {/* CSS Editor */}
              <div>
                <Label htmlFor="template-css" className="text-slate-300">CSS</Label>
                <Textarea
                  id="template-css"
                  value={editingTemplate.css}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, css: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                  rows={8}
                  placeholder="Enter CSS styles..."
                />
              </div>

              {/* Preview */}
              <div>
                <Label className="text-slate-300 mb-2 block">Preview</Label>
                <div className="aspect-video bg-slate-900 rounded-lg border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                  <div dangerouslySetInnerHTML={{ __html: editingTemplate.html }} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={saveTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
                <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}