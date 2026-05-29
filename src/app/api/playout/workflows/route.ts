import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const workflows = await db.playoutWorkflow.findMany({
      orderBy: { updatedAt: 'desc' }
    })
    return NextResponse.json({ workflows })
  } catch (error) {
    console.error('Error fetching playout workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch playout workflows' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, nodes, connections } = body

    const workflow = await db.playoutWorkflow.create({
      data: {
        name,
        description,
        nodes: JSON.stringify(nodes),
        connections: JSON.stringify(connections),
        isActive: false
      }
    })

    return NextResponse.json({ workflow }, { status: 201 })
  } catch (error) {
    console.error('Error creating playout workflow:', error)
    return NextResponse.json(
      { error: 'Failed to create playout workflow' },
      { status: 500 }
    )
  }
}