# playZ - Enterprise-Grade Playout Automation System

A professional multi-channel playout automation system with HTML CG overlays, SCTE-35 marker generation, and enterprise broadcast features.

## 🚀 Features

### Core Playout
- **Node-based Workflow Editor**: Visual design interface for playout workflows
- **Frame-accurate Timeline**: Precise scheduling with HH:MM:SS.FF timecode
- **Playlist Management**: Drag-and-drop playlist with group support
- **Transport Controls**: Professional play/pause/stop/seek controls

### Multi-Channel Support
- **Multiple TV Channels**: Run and manage multiple channels simultaneously
- **Per-channel Isolation**: Independent playout state per channel
- **Priority-based Scheduling**: Resource allocation based on channel priority
- **Multi-stream Output**: RTMP, SRT, HLS, DASH, WebRTC support per channel

### Graphics & Overlays
- **HTML CG Overlays**: Dynamic HTML/CSS character generator
- **Template Library**: Lower thirds, tickers, bugs, fullscreen overlays
- **Real-time Preview**: Live iframe preview of CG templates
- **Multi-layer Support**: Layer ordering and visibility control

### Ad Insertion
- **SCTE-35 Markers**: Full SCTE-35 signal generation
- **Multiple Signal Types**: splice_insert, time_signal, private
- **Base64/Hex/JSON Output**: Multiple output formats
- **Preroll Configuration**: Frame-based ad timing

### Enterprise Features
- **Broadcast Dashboard**: Professional control center interface
- **Multi-view Monitoring**: Quad/Hex/Nine view modes
- **Signal Monitoring**: Bitrate, FPS, dropped frames tracking
- **Audio Level Meters**: Stereo L/R with peak hold
- **Emergency Controls**: Cut to Black, Break Away, Manual Override
- **Real-time Updates**: WebSocket-based state synchronization

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 16, React, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite
- **Real-time**: Socket.io WebSocket service
- **Drag & Drop**: React DnD

### Project Structure
```
playZ/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main dashboard
│   │   └── api/                  # API routes
│   │       ├── playout/
│   │       ├── cg-templates/
│   │       ├── scte35/
│   │       └── channels/
│   ├── components/
│   │   ├── plout/               # Playout components
│   │   │   ├── NodeEditor.tsx
│   │   │   ├── CGEditor.tsx
│   │   │   ├── PlayoutTimeline.tsx
│   │   │   ├── SCTE35Config.tsx
│   │   │   └── ChannelManager.tsx
│   │   └── broadcast/            # Enterprise components
│   │       ├── BroadcastDashboard.tsx
│   │       ├── MultiViewMonitor.tsx
│   │       ├── PlaylistManager.tsx
│   │       └── TransportControls.tsx
│   └── lib/
│       └── db.ts                 # Prisma client
├── prisma/
│   └── schema.prisma            # Database schema
├── mini-services/
│   └── playout-ws/              # WebSocket service
└── worklog.md                   # AI agent work log
```

## 📋 Database Schema

### Models
- **Channel**: TV channel configuration and status
- **StreamOutput**: Multi-destination streaming
- **ChannelSchedule**: Automated scheduling
- **PlayoutWorkflow**: Node-based workflow definitions
- **PlayoutSchedule**: Timeline scheduling data
- **CGTemplate**: HTML/CSS overlay templates
- **SCTE35Marker**: Ad insertion markers
- **PlayoutLog**: System event logging

## 🛠️ Installation

### Prerequisites
- Node.js 18+ (Bun recommended)
- Git

### Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/shihan84/playZ.git
   cd playZ
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Setup database**
   ```bash
   bun run db:push
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

5. **Start WebSocket service**
   ```bash
   cd mini-services/playout-ws
   bun run dev
   ```

## 🚢 Deployment

### VPS Requirements
- **Minimum**: 2 vCPU, 4GB RAM
- **Recommended**: 4 vCPU, 8GB RAM
- **OS**: Ubuntu 20.04+ or CentOS 7+

### Deployment Steps

1. **Install dependencies on VPS**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm nginx
   npm install -g bun pm2
   ```

2. **Deploy application**
   ```bash
   git clone https://github.com/shihan84/playZ.git
   cd playZ
   bun install
   bun run db:push
   bun run build
   ```

3. **Configure PM2**
   ```bash
   # Main application
   pm2 start bun --name "playZ-app" -- run start

   # WebSocket service
   cd mini-services/playout-ws
   pm2 start bun --name "playZ-ws" -- --hot index.ts
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Usage

### Creating a Channel
1. Go to Channels tab
2. Click "Add Channel"
3. Configure channel settings (name, call sign, resolution, codec)
4. Add stream outputs (RTMP, SRT, etc.)

### Building a Workflow
1. Go to Node Editor tab
2. Drag nodes from the palette to the canvas
3. Connect nodes by dragging from output to input
4. Configure each node's properties
5. Save the workflow

### Scheduling Content
1. Go to Timeline tab
2. Add items to the timeline
3. Set start times and durations
4. Drag to reorder items
5. Save schedule

### Creating CG Overlays
1. Go to HTML CG tab
2. Select template type or create custom
3. Write HTML and CSS
4. Preview in real-time
5. Set layer and visibility

### Configuring SCTE-35
1. Go to SCTE-35 tab
2. Add marker
3. Select signal type
4. Configure preroll and duration
5. Generate Base64 signal

### Monitoring
1. Go to Dashboard tab for real-time monitoring
2. Check Multi-View for channel overview
3. Monitor audio levels, signal quality
4. Use emergency controls if needed

## 📊 API Endpoints

### Playout Workflows
- `GET /api/playout/workflows` - List all workflows
- `POST /api/playout/workflows` - Create workflow
- `GET /api/playout/workflows/[id]` - Get workflow
- `PUT /api/playout/workflows/[id]` - Update workflow
- `DELETE /api/playout/workflows/[id]` - Delete workflow

### Schedules
- `GET /api/playout/schedules` - List all schedules
- `POST /api/playout/schedules` - Create schedule

### CG Templates
- `GET /api/cg-templates` - List all templates
- `POST /api/cg-templates` - Create template
- `GET /api/cg-templates/[id]` - Get template
- `PUT /api/cg-templates/[id]` - Update template
- `DELETE /api/cg-templates/[id]` - Delete template

### SCTE-35 Markers
- `GET /api/scte35` - List all markers
- `POST /api/scte35` - Create marker
- `GET /api/scte35/[id]` - Get marker
- `PUT /api/scte35/[id]` - Update marker
- `DELETE /api/scte35/[id]` - Delete marker

### Channels
- `GET /api/channels` - List all channels
- `POST /api/channels` - Create channel
- `GET /api/channels/[id]` - Get channel
- `PUT /api/channels/[id]` - Update channel
- `DELETE /api/channels/[id]` - Delete channel
- `GET /api/channels/[id]/streams` - Get channel streams
- `POST /api/channels/[id]/streams` - Add stream

## 🔌 WebSocket Service

### Connection
```javascript
const io = require('socket.io-client');
const socket = io('/?XTransformPort=3002');
```

### Events
- `join-playout`: Subscribe to playout updates
- `playout-state`: Receive playout state changes
- `play-pause`: Toggle playback
- `seek`: Seek to time
- `node-activate`: Activate node
- `cg-show`: Show CG overlay
- `scte35-trigger`: Trigger SCTE-35 marker

## 📝 Development

### Available Scripts
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run db:push` - Push schema changes to database

### AI Agent Work Log

The `worklog.md` file tracks all development work across AI agent sessions. Each task is logged with:
- Task ID
- Agent name
- Work steps
- Stage summary

#### For AI Agents:

**Before Starting:**
1. Read `/home/z/my-project/worklog.md`
2. Understand previous work
3. Plan your approach

**During Work:**
1. Track concrete steps
2. Document decisions
3. Note blockers

**After Completing:**
```markdown
---
Task ID: <task-id>
Agent: <agent-name>
Task: <description>

Work Log:
- <step-1>
- <step-2>

Stage Summary:
- <results>
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn/ui for the beautiful components
- Prisma for the excellent ORM
- Socket.io for real-time communication

## 📞 Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/shihan84/playZ/issues
- Repository: https://github.com/shihan84/playZ.git