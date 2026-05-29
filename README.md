# playZ - Simplified Broadcast Playout Automation

An intuitive web-based playout automation system for TV and streaming channels. Simple, professional, and easy to use.

## 🚀 Features

### Main Dashboard
- **Live Video Preview**: Real-time monitoring of on-air content
- **Transport Controls**: Play, pause, next, previous, stop with professional layout
- **Progress Tracking**: Real-time progress bar with timecode display (HH:MM:SS)
- **Volume Control**: Mute toggle and volume slider
- **Next Up Preview**: See what's coming next in the playlist

### Assets Library
- **Folder Navigation**: Organize media in folders (News, Sports, Music, etc.)
- **File Browser**: Grid or list view with thumbnails
- **Multi-Select**: Add multiple files to playlist at once
- **Search**: Quick file search
- **Metadata Display**: Duration, file size, type information

### Playlist Management
- **Drag & Drop**: Reorder playlist items by dragging
- **Status Tracking**: NOW PLAYING, NEXT UP, COMPLETED indicators
- **Quick Actions**: Play, remove, expand details
- **Playlist Stats**: Total items and duration
- **Save/Load**: Save playlists for reuse

### Quick Graphics
- **One-Click Toggles**: Show/hide graphics overlays instantly
- **Layer Management**: See which layer each graphic is on
- **On Air Indicators**: Visual badges for visible graphics
- **Template Types**: Lower thirds, tickers, bugs, fullscreen overlays

### Multi-Channel Support
- **Channel Selector**: Switch between multiple channels
- **Per-Channel Playlists**: Independent playlists per channel
- **Status Monitoring**: Track all channels at once

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 16, React, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite
- **Real-time**: Socket.io WebSocket service

### Project Structure
```
playZ/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main dashboard (3-column layout)
│   │   └── api/                  # API routes
│   ├── components/
│   │   └── playout/              # Playout components
│   │       ├── PlayoutDashboard.tsx    # Video preview & controls
│   │       ├── AssetsLibrary.tsx       # File browser & folders
│   │       ├── SimplePlaylist.tsx      # Playlist management
│   │       ├── GraphicsQuickAccess.tsx # CG toggles
│   │       ├── CGEditor.tsx            # Full CG editor
│   │       ├── PlayoutTimeline.tsx     # Timeline view
│   │       ├── SCTE35Config.tsx        # Ad markers
│   │       └── ChannelManager.tsx      # Channel settings
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
- **PlayoutWorkflow**: Step-based workflow definitions
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

### Quick Start - Play Content

1. **Select Channel** - Choose your channel from the dropdown in the header
2. **Add Media to Playlist**
   - Click on files in the Assets Library (left panel)
   - Multi-select multiple files
   - Click "Add to Playlist" button
3. **Reorder Playlist** - Drag items to change playback order
4. **Start Playback**
   - Click the Play button in the dashboard
   - Or click the play icon on a playlist item
5. **Control Playback** - Use transport controls (previous, pause/play, next, stop)

### Using Graphics

1. Open Quick Graphics panel (bottom-left)
2. Toggle overlays on/off with the eye icon
3. Click "Open Graphics Editor" for advanced CG creation

### Managing Channels

1. Go to Channels tab
2. Click "Add Channel" to create new channels
3. Configure settings (name, call sign, resolution, codec)
4. Add stream outputs (RTMP, SRT, etc.)

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