// app/api/agendas/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Agenda } from '@/app/portal/page'

// GET
export async function GET() {
  const agendas = await prisma.agenda.findMany({
    orderBy: {
      meeting: { date: 'asc' },
    },
    include: {
      speaker: true,
      meeting: {
        include: {
          chair: true,
        },
      },
    },
  })

  // 整形
  const result = agendas.reduce<Record<string, Agenda>>((acc, agenda) => {
    const dateKey = agenda.meeting.date.toISOString().split('T')[0]

    if (!acc[dateKey]) {
      acc[dateKey] = {
        id: agenda.meeting.id.toString(),
        date: dateKey,
        titles: [],
        speakers: [],
        chair: agenda.meeting.chair?.name || '',
      }
    }

    acc[dateKey].titles.push(agenda.title)
    acc[dateKey].speakers.push(agenda.speaker?.name || '')

    return acc
  }, {})

  // オブジェクト → 配列
  const agendasFormatted = Object.values(result)

  return NextResponse.json(agendasFormatted)
}

// POST
export async function POST(req: Request) {
  const body = await req.json()
  const date = new Date(body.date)
  console.log(body)

  let chairMember = null
  if (body.chair && body.chair !== 'TBD') {
    chairMember = await prisma.member.findFirst({
      where: { name: body.chair },
    })
    if (!chairMember) {
      return NextResponse.json({ error: `Member not found: ${body.chair}` }, { status: 400 });
    }
  }

  // Meeting の取得 or 作成
  let meeting = await prisma.meeting.findFirst({
    where: { date },
  })

  if (!meeting) {
    meeting = await prisma.meeting.create({
      data: {
        date,
        ...(chairMember
          ? { chair: { connect: { id: chairMember.id } } }
          : { chairId: null }),
      },
    })
  }

  // Agenda 複数作成
  const createdAgendas = []

  for (let i = 0; i < body.titles.length; i++) {
    const title = body.titles[i]
    const speakerName = body.speakers[i]

    const speakerMember = await prisma.member.findFirst({
      where: { name: speakerName },
    })

    if (!speakerMember) {
      return NextResponse.json({ error: `Speaker '${speakerName}' not found` }, { status: 400 })
    }

    const newAgenda = await prisma.agenda.create({
      data: {
        title,
        meeting: {
          connect: { id: meeting.id },
        },
        speaker: {
          connect: { id: speakerMember.id },
        },
      },
    })

    createdAgendas.push(newAgenda)
  }

  return NextResponse.json(createdAgendas)
}
