import { type NextRequest, NextResponse } from 'next/server'

// Placeholder proxy — authentication logic will be added in task_03.
// When task_03 is implemented, replace this with updateSession from lib/supabase/middleware.
export function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
