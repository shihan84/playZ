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

export async function GET() {
  try {
    const markers = await db.sCTE35Marker.findMany({
      orderBy: { position: 'asc' }
    })
    return NextResponse.json({ markers })
  } catch (error) {
    console.error('Error fetching SCTE-35 markers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SCTE-35 markers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const marker = await db.sCTE35Marker.create({
      data: {
        name,
        signalType,
        prerollFrames: prerollFrames || 30,
        duration: duration || 60,
        autoReturn: autoReturn ?? true,
        description,
        tier: tier || 'national',
        position: position || 0,
        base64Output
      }
    })

    return NextResponse.json({ marker }, { status: 201 })
  } catch (error) {
    console.error('Error creating SCTE-35 marker:', error)
    return NextResponse.json(
      { error: 'Failed to create SCTE-35 marker' },
      { status: 500 }
    )
  }
}