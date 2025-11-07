'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface CourseFiltersProps {
  categories: Category[]
  tags: Tag[]
}

export function CourseFilters({ categories, tags }: CourseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) || []
  )

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams()

    const search = formData.get('search') as string
    const category = formData.get('category') as string
    const difficulty = formData.get('difficulty') as string
    const tier = formData.get('tier') as string

    if (search) params.set('search', search)
    if (category && category !== 'all') params.set('category', category)
    if (difficulty && difficulty !== 'all') params.set('difficulty', difficulty)
    if (tier && tier !== 'all') params.set('tier', tier)
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))

    router.push(`/courses?${params.toString()}`)
  }

  const handleReset = () => {
    setSelectedTags([])
    router.push('/courses')
  }

  const toggleTag = (tagSlug: string) => {
    setSelectedTags(prev =>
      prev.includes(tagSlug)
        ? prev.filter(t => t !== tagSlug)
        : [...prev, tagSlug]
    )
  }

  const hasActiveFilters = searchParams.toString().length > 0 || selectedTags.length > 0

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-white">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              id="search"
              name="search"
              type="text"
              placeholder="Search courses..."
              defaultValue={searchParams.get('search') || ''}
              className="pl-10 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-white">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={searchParams.get('category') || 'all'}
            className="flex h-10 w-full rounded-md border border-white/20 bg-white/10 backdrop-blur-xl px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <option value="all" className="bg-[#0A0A0A]">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug} className="bg-[#0A0A0A]">
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="space-y-2">
          <Label htmlFor="difficulty" className="text-white">Difficulty</Label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={searchParams.get('difficulty') || 'all'}
            className="flex h-10 w-full rounded-md border border-white/20 bg-white/10 backdrop-blur-xl px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <option value="all" className="bg-[#0A0A0A]">All Levels</option>
            <option value="beginner" className="bg-[#0A0A0A]">Beginner</option>
            <option value="intermediate" className="bg-[#0A0A0A]">Intermediate</option>
            <option value="advanced" className="bg-[#0A0A0A]">Advanced</option>
          </select>
        </div>

        {/* Tier Filter */}
        <div className="space-y-2">
          <Label htmlFor="tier" className="text-white">Access</Label>
          <select
            id="tier"
            name="tier"
            defaultValue={searchParams.get('tier') || 'all'}
            className="flex h-10 w-full rounded-md border border-white/20 bg-white/10 backdrop-blur-xl px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <option value="all" className="bg-[#0A0A0A]">All Access Levels</option>
            <option value="free" className="bg-[#0A0A0A]">Free</option>
            <option value="basic" className="bg-[#0A0A0A]">Basic</option>
            <option value="premium" className="bg-[#0A0A0A]">Premium</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-white">Filter by tags:</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.slug)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag.slug)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">Apply Filters</Button>
        {hasActiveFilters && (
          <Button type="button" variant="outline" onClick={handleReset} className="border-white/20 text-white hover:bg-white/10">
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>
    </form>
  )
}
