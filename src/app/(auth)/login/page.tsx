import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 h-96 animate-pulse" />}>
      <LoginForm />
    </Suspense>
  )
}
