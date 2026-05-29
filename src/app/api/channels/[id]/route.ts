import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const channel = await db.channel.findUnique({
      where: { id: params.id },
      include: {
        streamOutputs: {
          orderBy: { isPrimary: 'desc' }
        }
      }
    })

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ channel })
  } catch (error) {
    console.error('Error fetching channel:', error)
    return NextResponse.json(
      { error: 'Failed to fetch channel' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      callSign,
      isActive,
      status,
      currentProgram,
      currentEvent,
      currentTime,
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

    const channel = await db.channel.update({
      where: { id: params.id },
      data: {
        name,
        description,
        callSign,
        isActive,
        status,
        currentProgram,
        currentEvent,
        currentTime,
        frameRate,
        resolution,
        aspectRatio,
        audioChannels,
        audioSampleRate,
        videoCodec,
        audioCodec,
        bitrate,
        priority
      }
    })

    return NextResponse.json({ channel })
  } catch (error) {
    console.error('Error updating channel:', error)
    return NextResponse.json(
      { error: 'Failed to update channel' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.channel.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Channel deleted successfully' })
  } catch (error) {
    console.error('Error deleting channel:', error)
    return NextResponse.json(
      { error: 'Failed to delete channel' },
      { status: 500 }
    )
  }
}