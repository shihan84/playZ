import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await db.cGTemplate.findUnique({
      where: { id: params.id }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'CG template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error fetching CG template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CG template' },
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
    const { name, type, html, css, layer, isVisible } = body

    const template = await db.cGTemplate.update({
      where: { id: params.id },
      data: {
        name,
        type,
        html,
        css,
        layer,
        isVisible
      }
    })

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error updating CG template:', error)
    return NextResponse.json(
      { error: 'Failed to update CG template' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.cGTemplate.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'CG template deleted successfully' })
  } catch (error) {
    console.error('Error deleting CG template:', error)
    return NextResponse.json(
      { error: 'Failed to delete CG template' },
      { status: 500 }
    )
  }
}