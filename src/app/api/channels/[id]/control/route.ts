import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action, program, event } = body

    let status = 'idle'
    let currentProgram = null
    let currentEvent = null

    switch (action) {
      case 'start':
        status = 'live'
        currentProgram = program || 'Live Program'
        break
      case 'stop':
        status = 'stopped'
        currentProgram = null
        currentEvent = null
        break
      case 'pause':
        status = 'paused'
        break
      case 'resume':
        status = 'live'
        break
      case 'emergency':
        status = 'emergency'
        currentEvent = event || 'Emergency Cut'
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const channel = await db.channel.update({
      where: { id: params.id },
      data: {
        status,
        currentProgram,
        currentEvent
      }
    })

    return NextResponse.json({ channel, action, timestamp: Date.now() })
  } catch (error) {
    console.error('Error controlling channel:', error)
    return NextResponse.json(
      { error: 'Failed to control channel' },
      { status: 500 }
    )
  }
}