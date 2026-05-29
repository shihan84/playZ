import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const streams = await db.streamOutput.findMany({
      where: { channelId: params.id },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({ streams })
  } catch (error) {
    console.error('Error fetching streams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch streams' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      protocol,
      url,
      streamKey,
      backupUrl,
      isPrimary,
      isBackup
    } = body

    if (isPrimary) {
      await db.streamOutput.updateMany({
        where: { channelId: params.id },
        data: { isPrimary: false }
      })
    }

    const stream = await db.streamOutput.create({
      data: {
        channelId: params.id,
        name,
        protocol,
        url,
        streamKey,
        backupUrl,
        isPrimary: isPrimary || false,
        isBackup: isBackup || false,
        status: 'idle'
      }
    })

    return NextResponse.json({ stream }, { status: 201 })
  } catch (error) {
    console.error('Error creating stream:', error)
    return NextResponse.json(
      { error: 'Failed to create stream' },
      { status: 500 }
    )
  }
}