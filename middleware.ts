// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const passcode = req.cookies.get('passcode')?.value

  if (passcode !== process.env.NEXT_PUBLIC_PASSCODE) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Success case
  return NextResponse.next()
}

// auth required page
export const config = {
  matcher: ['/portal', '/admin'], 
}
