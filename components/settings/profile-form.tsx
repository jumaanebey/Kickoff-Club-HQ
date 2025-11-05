'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ProfileFormProps {
  profile: {
    id: string
    name: string | null
    email: string
    bio: string | null
    avatar_url: string | null
  }
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [name, setName] = useState(profile.name || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('bio', bio)

    try {
      const { updateProfile } = await import('@/app/actions/profile')
      const result = await updateProfile(formData)

      if (!result.success) {
        setError(result.error || 'Failed to update profile')
        return
      }

      setSuccess(true)
      router.refresh()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-600">Profile updated successfully!</p>
        </div>
      )}

      {/* Avatar */}
      <div>
        <Label className="mb-3 block">Profile Picture</Label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl text-primary-700 font-bold">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span>{name?.[0]?.toUpperCase() || '?'}</span>
            )}
          </div>
          <div>
            <Button type="button" variant="outline" size="sm" disabled>
              Upload New Photo
            </Button>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          disabled={loading}
        />
      </div>

      {/* Bio */}
      <div className="grid gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a bit about yourself"
          rows={4}
          disabled={loading}
        />
        <p className="text-xs text-gray-500">
          Brief description for your profile. URLs are hyperlinked.
        </p>
      </div>

      {/* Email (read-only) */}
      <div className="grid gap-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={profile.email}
          disabled
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500">
          Email cannot be changed. Contact support if you need to update it.
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setName(profile.name || '')
            setBio(profile.bio || '')
            setError(null)
            setSuccess(false)
          }}
          disabled={loading}
        >
          Reset
        </Button>
      </div>
    </form>
  )
}
