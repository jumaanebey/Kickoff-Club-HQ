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
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              name="search"
              type="text"
              placeholder="Search courses..."
              defaultValue={searchParams.get('search') || ''}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={searchParams.get('category') || 'all'}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={searchParams.get('difficulty') || 'all'}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Tier Filter */}
        <div className="space-y-2">
          <Label htmlFor="tier">Access</Label>
          <select
            id="tier"
            name="tier"
            defaultValue={searchParams.get('tier') || 'all'}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <option value="all">All Access Levels</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <Label>Filter by tags:</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.slug)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  selectedTags.includes(tag.slug)
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white hover:border-primary-500 border-gray-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit">Apply Filters</Button>
        {hasActiveFilters && (
          <Button type="button" variant="outline" onClick={handleReset}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>
    </form>
  )
}
