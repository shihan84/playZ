import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action, bitrate, fps, resolution, codec } = body

    let status = 'idle'
    let lastStreamTime = null

    switch (action) {
      case 'start':
        status = 'streaming'
        lastStreamTime = new Date()
        break
      case 'stop':
        status = 'stopped'
        break
      case 'restart':
        status = 'streaming'
        lastStreamTime = new Date()
        break
      case 'failover':
        status = 'failover'
        break
      default:
        break
    }

    const stream = await db.streamOutput.update({
      where: { id: params.id },
      data: {
        status,
        lastStreamTime,
        bitrate: bitrate || undefined,
        fps: fps || undefined,
        resolution: resolution || undefined,
        codec: codec || undefined
      }
    })

    return NextResponse.json({ stream, action, timestamp: Date.now() })
  } catch (error) {
    console.error('Error controlling stream:', error)
    return NextResponse.json(
      { error: 'Failed to control stream' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.streamOutput.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Stream deleted successfully' })
  } catch (error) {
    console.error('Error deleting stream:', error)
    return NextResponse.json(
      { error: 'Failed to delete stream' },
      { status: 500 }
    )
  }
}