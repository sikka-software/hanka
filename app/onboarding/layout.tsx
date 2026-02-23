import { redirect } from 'next/navigation'
import { getUserFromCookies } from '@/lib/auth'

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserFromCookies()

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <>
      {children}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.HANKA_USERNAME = ${JSON.stringify(user.login)}`,
        }}
      />
    </>
  )
}
