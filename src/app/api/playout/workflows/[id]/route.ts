import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = await db.playoutWorkflow.findUnique({
      where: { id: params.id }
    })

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      workflow: {
        ...workflow,
        nodes: JSON.parse(workflow.nodes),
        connections: JSON.parse(workflow.connections)
      }
    })
  } catch (error) {
    console.error('Error fetching workflow:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
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
    const { name, description, nodes, connections, isActive } = body

    const workflow = await db.playoutWorkflow.update({
      where: { id: params.id },
      data: {
        name,
        description,
        nodes: JSON.stringify(nodes),
        connections: JSON.stringify(connections),
        isActive
      }
    })

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error('Error updating workflow:', error)
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.playoutWorkflow.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Workflow deleted successfully' })
  } catch (error) {
    console.error('Error deleting workflow:', error)
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    )
  }
}