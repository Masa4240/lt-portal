import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'



 export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const meetingId = Number((await params).id)
  
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        agendas: {
          include: {
            speaker: true,
          },
          orderBy: { id: 'asc' },
        },
        chair: true,
      },
    })
  
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }
  
    const result = {
      id: meeting.id.toString(),
      date: meeting.date.toISOString(),
      titles: meeting.agendas.map((a) => a.title),
      speakers: meeting.agendas.map((a) => a.speaker.name),
      chair: meeting.chair.name,
    }
  
    return NextResponse.json(result)
  }
  
  export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const meetingId = Number((await params).id)
    const body = await req.json()
  
    // chair の Member を取得（name指定）
    const chairMember = await prisma.member.findFirst({
      where: { name: body.chair },
    })
  
    if (!chairMember) {
      return NextResponse.json({ error: 'Chair not found' }, { status: 400 })
    }
  
    // Agenda 全削除（meetingIdに紐づくもの）
    await prisma.agenda.deleteMany({
      where: { meetingId },
    })
  
    // 新しい Agenda を挿入（title + speaker）
    for (let i = 0; i < body.titles.length; i++) {
      const title = body.titles[i]
      const speakerName = body.speakers[i]
  
      const speaker = await prisma.member.findFirst({
        where: { name: speakerName },
      })
  
      if (!speaker) {
        return NextResponse.json({ error: `Speaker "${speakerName}" not found` }, { status: 400 })
      }
  
      await prisma.agenda.create({
        data: {
          title,
          speaker: { connect: { id: speaker.id } },
          meeting: { connect: { id: meetingId } },
        },
      })
    }
  
    // Meeting の chair を更新
    await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        chair: { connect: { id: chairMember.id } },
      },
    })
  
    return NextResponse.json({ success: true })
  }
  