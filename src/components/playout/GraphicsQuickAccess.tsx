'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { Eye, EyeOff, Type, MessageSquare, Sparkles, Tv as TvIcon } from 'lucide-react'

interface CGTemplate {
  id: string
  name: string
  type: 'lower-third' | 'ticker' | 'bug' | 'fullscreen'
  icon: React.ElementType
  isVisible: boolean
  layer: number
}

export default function GraphicsQuickAccess() {
  const [templates, setTemplates] = useState<CGTemplate[]>([
    { id: '1', name: 'Lower Third', type: 'lower-third', icon: Type, isVisible: false, layer: 1 },
    { id: '2', name: 'News Ticker', type: 'ticker', icon: MessageSquare, isVisible: false, layer: 2 },
    { id: '3', name: 'Channel Bug', type: 'bug', icon: TvIcon, isVisible: true, layer: 3 },
    { id: '4', name: 'Lower Third (Alt)', type: 'lower-third', icon: Type, isVisible: false, layer: 4 },
  ])

  const toggleVisibility = (templateId: string) => {
    setTemplates(templates.map(t =>
      t.id === templateId ? { ...t, isVisible: !t.isVisible } : t
    ))
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Quick Graphics</CardTitle>
          <Sparkles className="h-5 w-5 text-purple-400" />
        </div>
        <p className="text-slate-400 text-sm">Show/hide overlays on air</p>
      </CardHeader>

      <CardContent className="space-y-2">
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <div
              key={template.id}
              className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg"
            >
              <div className={`p-2 rounded-lg ${
                template.isVisible ? 'bg-purple-600' : 'bg-slate-600'
              }`}>
                <Icon className="h-5 w-5 text-white" />
              </div>

              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{template.name}</h4>
                <p className="text-slate-400 text-xs">Layer {template.layer}</p>
              </div>

              {template.isVisible && (
                <Badge className="bg-green-600">ON AIR</Badge>
              )}

              <Toggle
                pressed={template.isVisible}
                onPressedChange={() => toggleVisibility(template.id)}
                className="data-[state=on]:bg-green-600"
              >
                {template.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Toggle>
            </div>
          )
        })}

        <Button variant="outline" className="w-full mt-4">
          <Sparkles className="h-4 w-4 mr-2" />
          Open Graphics Editor
        </Button>
      </CardContent>
    </Card>
  )
}