'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getPublicEnv } from './config'

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getPublicEnv()
  return createBrowserClient(url, anonKey)
}
