import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const schedules = await db.playoutSchedule.findMany({
      orderBy: { createdAt: 'desc' }
    })

    const schedulesWithItems = schedules.map(schedule => ({
      ...schedule,
      items: JSON.parse(schedule.items)
    }))

    return NextResponse.json({ schedules: schedulesWithItems })
  } catch (error) {
    console.error('Error fetching playout schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch playout schedules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, items, scheduledAt } = body

    const totalDuration = items.reduce((sum: number, item: any) => {
      const [h, m, s] = item.startTime.split(':').map(Number)
      const startSec = h * 3600 + m * 60 + s
      return Math.max(sum, startSec + item.duration)
    }, 0)

    const schedule = await db.playoutSchedule.create({
      data: {
        name,
        description,
        items: JSON.stringify(items),
        totalDuration,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        isActive: false
      }
    })

    return NextResponse.json({ schedule }, { status: 201 })
  } catch (error) {
    console.error('Error creating playout schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create playout schedule' },
      { status: 500 }
    )
  }
}