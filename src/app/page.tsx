'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, Square, Settings, Layers, Radio, Clock, FileVideo, Tv } from 'lucide-react'
import NodeEditor from '@/components/playout/NodeEditor'
import PlayoutTimeline from '@/components/playout/PlayoutTimeline'
import CGEditor from '@/components/playout/CGEditor'
import SCTE35Config from '@/components/playout/SCTE35Config'
import ChannelManager from '@/components/playout/ChannelManager'

export default function PlayoutAutomation() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState('channels')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Radio className="h-8 w-8 text-purple-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Multi-Channel Playout Automation</h1>
                  <p className="text-sm text-slate-400">Node-based broadcast automation with multi-stream support</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
                <div className="text-sm text-slate-400">
                  <span>Status:</span>
                  <span className={`ml-2 font-semibold ${isPlaying ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isPlaying ? 'ON AIR' : 'STANDBY'}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant={isPlaying ? "destructive" : "default"}
                onClick={() => setIsPlaying(!isPlaying)}
                className="gap-2"
              >
                {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Stop All' : 'Start All'}
              </Button>

              <Button size="sm" variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="bg-slate-800 border border-slate-700">
                <TabsTrigger value="channels" className="data-[state=active]:bg-purple-600">
                  <Tv className="h-4 w-4 mr-2" />
                  Channels
                </TabsTrigger>
                <TabsTrigger value="nodes" className="data-[state=active]:bg-purple-600">
                  <Layers className="h-4 w-4 mr-2" />
                  Node Editor
                </TabsTrigger>
                <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="cg" className="data-[state=active]:bg-purple-600">
                  <FileVideo className="h-4 w-4 mr-2" />
                  HTML CG
                </TabsTrigger>
                <TabsTrigger value="scte" className="data-[state=active]:bg-purple-600">
                  <Radio className="h-4 w-4 mr-2" />
                  SCTE-35
                </TabsTrigger>
              </TabsList>

              <TabsContent value="channels" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Multi-Channel Management</CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage multiple TV channels with individual workflows, schedules, and stream outputs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChannelManager />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nodes" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Node-based Playout Designer</CardTitle>
                    <CardDescription className="text-slate-400">
                      Create complex playout workflows by connecting nodes for video, audio, CG overlays, and ad insertion
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NodeEditor />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Playout Timeline</CardTitle>
                    <CardDescription className="text-slate-400">
                      Schedule and manage your broadcast content with drag-and-drop timeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PlayoutTimeline />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cg" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">HTML CG Editor</CardTitle>
                    <CardDescription className="text-slate-400">
                      Design and preview character generator overlays, lower thirds, tickers, and more
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CGEditor />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scte" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">SCTE-35 Preroll Configuration</CardTitle>
                    <CardDescription className="text-slate-400">
                      Configure ad insertion markers, preroll timing, and signal splicing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SCTE35Config />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Start Playout
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Schedule
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Square className="h-4 w-4 mr-2" />
                  Emergency Cut
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Layers className="h-4 w-4 mr-2" />
                  Load Preset
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Engine</span>
                  <span className="text-green-400 text-sm font-semibold">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">CG Renderer</span>
                  <span className="text-green-400 text-sm font-semibold">Ready</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">SCTE-35</span>
                  <span className="text-green-400 text-sm font-semibold">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Output</span>
                  <span className="text-yellow-400 text-sm font-semibold">Standby</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Active Channels</span>
                  <span className="text-green-400 text-sm font-semibold">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total Streams</span>
                  <span className="text-white text-sm font-semibold">8</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Active Channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-medium text-sm">Main Channel</div>
                    <span className="text-green-400 text-xs font-semibold">LIVE</span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1">CH01 • 2 streams</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-medium text-sm">News 24/7</div>
                    <span className="text-green-400 text-xs font-semibold">LIVE</span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1">CH02 • 3 streams</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-medium text-sm">Documentary</div>
                    <span className="text-yellow-400 text-xs font-semibold">PAUSED</span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1">DOC • 2 streams</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-medium text-sm">Sports</div>
                    <span className="text-slate-400 text-xs font-semibold">IDLE</span>
                  </div>
                  <div className="text-slate-400 text-xs mt-1">SPRT • 1 stream</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700 bg-slate-900/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div>Multi-Channel Playout Automation System v2.0</div>
            <div className="flex items-center gap-4">
              <span>Channels: 4 Active</span>
              <span>Streams: 8 Total</span>
              <span>Node Engine: Active</span>
              <span>CG Renderer: Ready</span>
              <span>SCTE-35: Enabled</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}