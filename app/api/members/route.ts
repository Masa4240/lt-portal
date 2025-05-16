// app/api/members/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subMonths } from 'date-fns'

// GET
export async function GET() {
  const sixMonthsAgo = subMonths(new Date(), 6)

  const members = await prisma.member.findMany({
    where: { isValid: true },
    orderBy: { name: 'asc' },
    include: {
      chairedMeetings: {
        where: { date: { gte: sixMonthsAgo } },
        select: { id: true },
      },
      agendas: {
        where: {
          meeting: {
            date: { gte: sixMonthsAgo },
          },
        },
        select: { id: true },
      },
    },
  })

  const formatted = members.map(member => ({
    id: member.id,
    name: member.name,
    email: member.email,
    chairCount: member.chairedMeetings.length,
    speakerCount: member.agendas.length,
  }))

  return NextResponse.json(formatted)
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
