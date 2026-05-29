import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const templates = await db.cGTemplate.findMany({
      orderBy: { updatedAt: 'desc' }
    })
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching CG templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CG templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, html, css, layer, isVisible } = body

    const template = await db.cGTemplate.create({
      data: {
        name,
        type,
        html,
        css,
        layer: layer || 1,
        isVisible: isVisible ?? true
      }
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Error creating CG template:', error)
    return NextResponse.json(
      { error: 'Failed to create CG template' },
      { status: 500 }
    )
  }
}