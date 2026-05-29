import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const channels = await db.channel.findMany({
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ],
      include: {
        _count: {
          select: {
            streamOutputs: true
          }
        }
      }
    })

    return NextResponse.json({ channels })
  } catch (error) {
    console.error('Error fetching channels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      callSign,
      frameRate,
      resolution,
      aspectRatio,
      audioChannels,
      audioSampleRate,
      videoCodec,
      audioCodec,
      bitrate,
      priority
    } = body

    const channel = await db.channel.create({
      data: {
        name,
        description,
        callSign,
        frameRate: frameRate || 30,
        resolution: resolution || '1920x1080',
        aspectRatio: aspectRatio || '16:9',
        audioChannels: audioChannels || 2,
        audioSampleRate: audioSampleRate || 48000,
        videoCodec: videoCodec || 'h264',
        audioCodec: audioCodec || 'aac',
        bitrate: bitrate || 5000000,
        priority: priority || 0,
        status: 'idle',
        currentTime: 0
      }
    })

    return NextResponse.json({ channel }, { status: 201 })
  } catch (error) {
    console.error('Error creating channel:', error)
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    )
  }
}