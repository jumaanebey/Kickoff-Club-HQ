'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { cn } from '@/shared/utils'

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
  const { colors } = useTheme()

  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) || []
  )

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams()

    const search = formData.get('search') as string
    const category = formData.get('category') as string
    const tier = formData.get('tier') as string

    if (search) params.set('search', search)
    if (category && category !== 'all') params.set('category', category)
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className={colors.text}>Search</Label>
          <div className="relative">
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", colors.textMuted)} />
            <Input
              id="search"
              name="search"
              type="text"
              placeholder="Search courses..."
              defaultValue={searchParams.get('search') || ''}
              className={cn("pl-10 backdrop-blur-xl border", colors.input, colors.inputBorder, colors.inputText, colors.inputPlaceholder)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category" className={colors.text}>Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={searchParams.get('category') || 'all'}
            className={cn("flex h-10 w-full rounded-md border backdrop-blur-xl px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500", colors.input, colors.inputBorder, colors.inputText)}
          >
            <option value="all" className="bg-[#0A0A0A] text-white">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug} className="bg-[#0A0A0A] text-white">
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tier Filter */}
        <div className="space-y-2">
          <Label htmlFor="tier" className={colors.text}>Access</Label>
          <select
            id="tier"
            name="tier"
            defaultValue={searchParams.get('tier') || 'all'}
            className={cn("flex h-10 w-full rounded-md border backdrop-blur-xl px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500", colors.input, colors.inputBorder, colors.inputText)}
          >
            <option value="all" className="bg-[#0A0A0A] text-white">All Access Levels</option>
            <option value="free" className="bg-[#0A0A0A] text-white">Free</option>
            <option value="basic" className="bg-[#0A0A0A] text-white">Basic</option>
            <option value="premium" className="bg-[#0A0A0A] text-white">Premium</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <Label className={colors.text}>Filter by tags:</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.slug)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-colors",
                  selectedTags.includes(tag.slug)
                    ? 'bg-orange-500 text-white border-orange-500'
                    : cn("hover:opacity-80", colors.bgSecondary, colors.cardBorder, colors.text)
                )}
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
          <Button type="button" variant="outline" onClick={handleReset} className={cn("border hover:opacity-80", colors.cardBorder, colors.text)}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>
    </form>
  )
}
