import { redirect } from 'next/navigation'

/** Mantido por compatibilidade; a entrada da app é `/`. */
export default function LoginPage() {
  redirect('/')
}
