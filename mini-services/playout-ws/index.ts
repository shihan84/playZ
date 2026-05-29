import { Server } from 'socket.io'

const io = new Server({
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

interface PlayoutState {
  isPlaying: boolean
  currentTime: number
  activeNodes: string[]
  activeCG: string[]
  currentMarker: string | null
}

const playoutState: PlayoutState = {
  isPlaying: false,
  currentTime: 0,
  activeNodes: [],
  activeCG: [],
  currentMarker: null
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.emit('playout-state', playoutState)

  socket.on('subscribe-playout', () => {
    socket.join('playout-updates')
    console.log('Client subscribed to playout updates:', socket.id)
  })

  socket.on('update-playout-state', (state: Partial<PlayoutState>) => {
    Object.assign(playoutState, state)
    io.to('playout-updates').emit('playout-state', playoutState)
  })

  socket.on('start-playout', () => {
    playoutState.isPlaying = true
    io.to('playout-updates').emit('playout-state', playoutState)
    io.to('playout-updates').emit('playout-started', { timestamp: Date.now() })
  })

  socket.on('stop-playout', () => {
    playoutState.isPlaying = false
    io.to('playout-updates').emit('playout-state', playoutState)
    io.to('playout-updates').emit('playout-stopped', { timestamp: Date.now() })
  })

  socket.on('seek-playout', (time: number) => {
    playoutState.currentTime = time
    io.to('playout-updates').emit('playout-state', playoutState)
    io.to('playout-updates').emit('playout-seeked', { time, timestamp: Date.now() })
  })

  socket.on('activate-node', (nodeId: string) => {
    if (!playoutState.activeNodes.includes(nodeId)) {
      playoutState.activeNodes.push(nodeId)
    }
    io.to('playout-updates').emit('playout-state', playoutState)
    io.to('playout-updates').emit('node-activated', { nodeId, timestamp: Date.now() })
  })

  socket.on('deactivate-node', (nodeId: string) => {
    playoutState.activeNodes = playoutState.activeNodes.filter(id => id !== nodeId)
    io.to('playout-updates').emit('playout-state', playoutState)
    io.to('playout-updates').emit('node-deactivated', { nodeId, timestamp: Date.now() })
  })

  socket.on('show-cg', (templateId: string) => {
    if (!playoutState.activeCG.includes(templateId)) {
      playoutState.activeCG.push(templateId)
    }
    io.to('playout-updates').emit('playout-state', playoutState)
    io.to('playout-updates').emit('cg-shown', { templateId, timestamp: Date.now() })
  })

  socket.on('hide-cg', (templateId: string) => {
    playoutState.activeCG = playoutState.activeCG.filter(id => id !== templateId)
    io.to('playout-updates').emit('playout-state', playoutState)
    io.to('playout-updates').emit('cg-hidden', { templateId, timestamp: Date.now() })
  })

  socket.on('trigger-scte35', (markerId: string) => {
    playoutState.currentMarker = markerId
    io.to('playout-updates').emit('playout-state', playoutState)
    io.to('playout-updates').emit('scte35-triggered', { markerId, timestamp: Date.now() })
  })

  socket.on('clear-scte35', () => {
    playoutState.currentMarker = null
    io.to('playout-updates').emit('playout-state', playoutState)
    io.to('playout-updates').emit('scte35-cleared', { timestamp: Date.now() })
  })

  socket.on('log-event', (event: { type: string; details: string; metadata?: any }) => {
    io.to('playout-updates').emit('playout-log', {
      ...event,
      timestamp: Date.now()
    })
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = 3002
io.listen(PORT)

console.log(`Playout WebSocket server running on port ${PORT}`)

setInterval(() => {
  if (playoutState.isPlaying) {
    playoutState.currentTime += 1
    io.to('playout-updates').emit('playout-state', playoutState)
  }
}, 1000)