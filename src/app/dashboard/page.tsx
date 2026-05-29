'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BroadcastDashboard from '@/components/broadcast/BroadcastDashboard'
import MultiViewMonitor from '@/components/broadcast/MultiViewMonitor'
import PlaylistManager from '@/components/broadcast/PlaylistManager'
import { Radio, MonitorPlay, List, Layers, Tv } from 'lucide-react'

export default function BroadcastDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Radio className="h-8 w-8 text-red-500" />
                <div>
                  <h1 className="text-xl font-bold text-white">Enterprise Broadcast Control</h1>
                  <p className="text-xs text-slate-400">Professional Playout Automation v3.0</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 text-sm font-semibold">System Normal</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-red-600">
              <Radio className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="multiview" className="data-[state=active]:bg-red-600">
              <MonitorPlay className="h-4 w-4 mr-2" />
              Multi-View
            </TabsTrigger>
            <TabsTrigger value="playlist" className="data-[state=active]:bg-red-600">
              <List className="h-4 w-4 mr-2" />
              Playlist
            </TabsTrigger>
            <TabsTrigger value="channels" className="data-[state=active]:bg-red-600">
              <Tv className="h-4 w-4 mr-2" />
              Channels
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <BroadcastDashboard />
          </TabsContent>

          <TabsContent value="multiview" className="space-y-4">
            <div className="bg-slate-900 border-slate-700 rounded-lg p-6">
              <MultiViewMonitor />
            </div>
          </TabsContent>

          <TabsContent value="playlist" className="space-y-4">
            <div className="bg-slate-900 border-slate-700 rounded-lg p-6">
              <PlaylistManager />
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-4">
            <div className="bg-slate-900 border-slate-700 rounded-lg p-6">
              <div className="text-center py-12">
                <Tv className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">Channel Management</h3>
                <p className="text-slate-400 mb-6">Use the main application for detailed channel management</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-slate-700 bg-slate-900/95 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>Enterprise Broadcast Control v3.0</span>
              <span>•</span>
              <span>Channels: 4 Active</span>
              <span>•</span>
              <span>Streams: 8 Online</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Uptime: 14d 7h 32m</span>
              <span>•</span>
              <span>CPU: 45% • RAM: 62%</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}