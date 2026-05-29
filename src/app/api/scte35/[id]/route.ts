import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function generateSCTE35Base64(marker: any) {
  const commandMap: Record<string, number> = {
    splice_insert: 0x05,
    time_signal: 0x06,
    private: 0xFF
  }

  const tierMap: Record<string, number> = {
    unknown: 0x0F,
    national: 0x00,
    regional: 0x0F,
    provider: 0x0F
  }

  const command = commandMap[marker.signalType] || 0x05
  const tier = tierMap[marker.tier] || 0x00

  const spliceData = {
    command: command,
    tier: tier,
    preroll: marker.prerollFrames,
    duration: marker.duration,
    autoReturn: marker.autoReturn ? 1 : 0
  }

  return Buffer.from(JSON.stringify(spliceData)).toString('base64')
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const marker = await db.sCTE35Marker.findUnique({
      where: { id: params.id }
    })

    if (!marker) {
      return NextResponse.json(
        { error: 'SCTE-35 marker not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ marker })
  } catch (error) {
    console.error('Error fetching SCTE-35 marker:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SCTE-35 marker' },
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
    const { name, signalType, prerollFrames, duration, autoReturn, description, tier, position } = body

    const base64Output = generateSCTE35Base64({
      signalType,
      prerollFrames,
      duration,
      autoReturn,
      tier
    })

    const marker = await db.sCTE35Marker.update({
      where: { id: params.id },
      data: {
        name,
        signalType,
        prerollFrames,
        duration,
        autoReturn,
        description,
        tier,
        position,
        base64Output
      }
    })

    return NextResponse.json({ marker })
  } catch (error) {
    console.error('Error updating SCTE-35 marker:', error)
    return NextResponse.json(
      { error: 'Failed to update SCTE-35 marker' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.sCTE35Marker.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'SCTE-35 marker deleted successfully' })
  } catch (error) {
    console.error('Error deleting SCTE-35 marker:', error)
    return NextResponse.json(
      { error: 'Failed to delete SCTE-35 marker' },
      { status: 500 }
    )
  }
}