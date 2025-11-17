import { redirect } from "next/navigation"
import { getUser } from "@/app/actions/auth"
import { createServerClient } from "@/database/supabase/server"
import { SettingsContent } from "@/components/dashboard/settings-content"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const supabase = await createServerClient()

  // Get user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="p-8">
        <p>Error loading profile</p>
      </div>
    )
  }

  return <SettingsContent profile={profile} />
}
