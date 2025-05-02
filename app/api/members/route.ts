// app/api/members/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET
export async function GET() {
  const members = await prisma.member.findMany({
    where: { isValid: true }, // 有効なメンバーだけ
    orderBy: { name: 'asc' }, // 名前順にソート
  })
  return NextResponse.json(members)
}

// POST
export async function POST(req: Request) {
  const body = await req.json()

  const newMember = await prisma.member.create({
    data: {
      name: body.name,
      isValid: body.isValid ?? true, // デフォルトtrue
    },
  })

  return NextResponse.json(newMember)
}
