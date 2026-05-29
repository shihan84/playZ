'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Radio, Layers, Tv, Settings, MessageSquare, Image as ImageIcon, Clock, Calendar, Layout } from 'lucide-react'
import PlayoutDashboard from '@/components/playout/PlayoutDashboard'
import AssetsLibrary from '@/components/playout/AssetsLibrary'
import SimplePlaylist from '@/components/playout/SimplePlaylist'
import GraphicsQuickAccess from '@/components/playout/GraphicsQuickAccess'
import AssetsPage from '@/components/playout/AssetsPage'
import GraphicsPage from '@/components/playout/GraphicsPage'
import SchedulePage from '@/components/playout/SchedulePage'
import ChannelsPage from '@/components/playout/ChannelsPage'

export default function PlayoutAutomation() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedChannel, setSelectedChannel] = useState('ch01')

  const handleFileAdd = (file: any) => {
    console.log('File added to playlist:', file.name)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Radio className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">playZ</h1>
                  <p className="text-xs text-slate-400">Broadcast Playout Automation</p>
                </div>
              </div>

              {/* Channel Selector */}
              <div className="ml-6 flex items-center gap-2">
                <span className="text-slate-400 text-sm">Channel:</span>
                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ch01">CH01 - Main</SelectItem>
                    <SelectItem value="ch02">CH02 - News 24/7</SelectItem>
                    <SelectItem value="ch03">CH03 - Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600">ON AIR</Badge>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex gap-1 mt-3">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('dashboard')}
              className={activeTab === 'dashboard' ? 'bg-purple-600' : 'text-slate-400 hover:text-white'}
            >
              <Layout className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'assets' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('assets')}
              className={activeTab === 'assets' ? 'bg-purple-600' : 'text-slate-400 hover:text-white'}
            >
              <Layers className="h-4 w-4 mr-2" />
              Assets
            </Button>
            <Button
              variant={activeTab === 'graphics' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('graphics')}
              className={activeTab === 'graphics' ? 'bg-purple-600' : 'text-slate-400 hover:text-white'}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Graphics
            </Button>
            <Button
              variant={activeTab === 'schedule' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('schedule')}
              className={activeTab === 'schedule' ? 'bg-purple-600' : 'text-slate-400 hover:text-white'}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button
              variant={activeTab === 'channels' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('channels')}
              className={activeTab === 'channels' ? 'bg-purple-600' : 'text-slate-400 hover:text-white'}
            >
              <Tv className="h-4 w-4 mr-2" />
              Channels
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 flex-1">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left - Assets Library */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                <AssetsLibrary onFileAdd={handleFileAdd} />
                <GraphicsQuickAccess />
              </div>
            </div>

            {/* Center - Playout Dashboard */}
            <div className="lg:col-span-6">
              <PlayoutDashboard />
            </div>

            {/* Right - Playlist */}
            <div className="lg:col-span-3">
              <SimplePlaylist />
            </div>
          </div>
        )}

        {activeTab === 'assets' && <AssetsPage />}

        {activeTab === 'graphics' && <GraphicsPage />}

        {activeTab === 'schedule' && <SchedulePage />}

        {activeTab === 'channels' && <ChannelsPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div>playZ v3.0 - Simplified Playout Automation</div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                CH01: On Air
              </span>
              <span>CH02: Standby</span>
              <span>CH03: Standby</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}