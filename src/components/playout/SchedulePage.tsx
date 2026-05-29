'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar as CalendarIcon, FileVideo, Edit, Trash2, Play } from 'lucide-react'

interface ScheduleItem {
  id: string
  title: string
  assetId: string
  channel: string
  startTime: string
  duration: number
  type: 'video' | 'live' | 'cg' | 'ad'
  repeat: 'none' | 'daily' | 'weekly' | 'monthly'
  status: 'scheduled' | 'playing' | 'completed' | 'skipped'
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week')
  const [selectedChannel, setSelectedChannel] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: '1',
      title: 'Morning News Bulletin',
      assetId: '1',
      channel: 'ch01',
      startTime: '06:00',
      duration: 1800,
      type: 'video',
      repeat: 'daily',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Weather Update',
      assetId: '2',
      channel: 'ch01',
      startTime: '06:30',
      duration: 300,
      type: 'video',
      repeat: 'daily',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Sports Highlights',
      assetId: '3',
      channel: 'ch01',
      startTime: '07:00',
      duration: 600,
      type: 'video',
      repeat: 'daily',
      status: 'completed'
    },
    {
      id: '4',
      title: 'Commercial Break',
      assetId: '4',
      channel: 'ch01',
      startTime: '08:00',
      duration: 180,
      type: 'ad',
      repeat: 'daily',
      status: 'playing'
    },
    {
      id: '5',
      title: 'Morning Show - Live',
      assetId: '',
      channel: 'ch01',
      startTime: '09:00',
      duration: 3600,
      type: 'live',
      repeat: 'daily',
      status: 'scheduled'
    },
    {
      id: '6',
      title: 'Documentary Hour',
      assetId: '5',
      channel: 'ch01',
      startTime: '10:00',
      duration: 3600,
      type: 'video',
      repeat: 'weekly',
      status: 'scheduled'
    },
  ])

  const [newItem, setNewItem] = useState({
    title: '',
    channel: 'ch01',
    startTime: '00:00',
    duration: 300,
    type: 'video' as const,
    repeat: 'none' as const
  })

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins >= 60) {
      const hours = Math.floor(mins / 60)
      const remainingMins = mins % 60
      return `${hours}h ${remainingMins}m`
    }
    return `${mins}m ${secs}s`
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }

  const getDaysOfWeek = () => {
    const days = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }

    return days
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const getStatusBadge = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'playing':
        return <Badge className="bg-red-600 animate-pulse">NOW PLAYING</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-600">SCHEDULED</Badge>
      case 'completed':
        return <Badge className="bg-green-600">COMPLETED</Badge>
      case 'skipped':
        return <Badge className="bg-slate-600">SKIPPED</Badge>
    }
  }

  const getTypeBadge = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'video':
        return <Badge variant="outline" className="border-blue-500 text-blue-400">VIDEO</Badge>
      case 'live':
        return <Badge variant="outline" className="border-red-500 text-red-400">LIVE</Badge>
      case 'cg':
        return <Badge variant="outline" className="border-purple-500 text-purple-400">CG</Badge>
      case 'ad':
        return <Badge variant="outline" className="border-orange-500 text-orange-400">AD</Badge>
    }
  }

  const addScheduleItem = () => {
    const item: ScheduleItem = {
      id: `schedule-${Date.now()}`,
      ...newItem,
      status: 'scheduled',
      assetId: ''
    }
    setScheduleItems([...scheduleItems, item])
    setIsAddOpen(false)
    setNewItem({
      title: '',
      channel: 'ch01',
      startTime: '00:00',
      duration: 300,
      type: 'video',
      repeat: 'none'
    })
  }

  const deleteItem = (itemId: string) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== itemId))
  }

  const days = getDaysOfWeek()
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Schedule</h1>
          <p className="text-slate-400 mt-1">Manage broadcast schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="ch01">CH01 - Main</SelectItem>
              <SelectItem value="ch02">CH02 - News 24/7</SelectItem>
              <SelectItem value="ch03">CH03 - Sports</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add to Schedule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-slate-300">Title</Label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Program title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-time" className="text-slate-300">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={newItem.startTime}
                      onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-slate-300">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newItem.duration}
                      onChange={(e) => setNewItem({ ...newItem, duration: Number(e.target.value) })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type" className="text-slate-300">Type</Label>
                    <Select value={newItem.type} onValueChange={(value: any) => setNewItem({ ...newItem, type: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="cg">CG Overlay</SelectItem>
                        <SelectItem value="ad">Advertisement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="repeat" className="text-slate-300">Repeat</Label>
                    <Select value={newItem.repeat} onValueChange={(value: any) => setNewItem({ ...newItem, repeat: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={addScheduleItem}>
                    Add to Schedule
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Week
            </Button>
            <div className="text-center">
              <h2 className="text-white text-xl font-semibold">
                {days[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
            <Button variant="outline" onClick={() => navigateDate('next')}>
              Next Week
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, index) => {
          const dayItems = scheduleItems.filter(item => {
            const matchesChannel = selectedChannel === 'all' || item.channel === selectedChannel
            return matchesChannel
          })

          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <Card key={index} className={`bg-slate-800 border-slate-700 ${isToday ? 'ring-2 ring-purple-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-sm ${isToday ? 'text-purple-400' : 'text-white'}`}>
                    {dayNames[index]}
                  </CardTitle>
                  {isToday && (
                    <Badge className="bg-purple-600 text-xs">Today</Badge>
                  )}
                </div>
                <div className={`text-2xl font-bold ${isToday ? 'text-purple-400' : 'text-white'}`}>
                  {day.getDate()}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border-2 ${
                      item.status === 'playing' ? 'bg-red-900/20 border-red-600' :
                      item.status === 'completed' ? 'bg-green-900/20 border-green-600' :
                      'bg-slate-700 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-xs font-mono">{formatTime(item.startTime)}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <h4 className="text-white text-sm font-medium mb-2">{item.title}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="h-3 w-3" />
                        {formatDuration(item.duration)}
                      </div>
                      {getTypeBadge(item.type)}
                    </div>
                    {item.status !== 'playing' && (
                      <div className="flex gap-1 mt-2">
                        {item.status === 'scheduled' && (
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-green-400">
                            <Play className="h-3 w-3 mr-1" />
                            Play Now
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-red-400"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {dayItems.length === 0 && (
                  <div className="text-center py-8 text-slate-600">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No scheduled items</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}