'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/database/supabase/server'

/**
 * Create a new comment on a lesson
 */
export async function createComment(formData: FormData) {
  try {
    const supabase = await createServerClient()
    const lessonId = formData.get('lessonId') as string
    const comment = formData.get('comment') as string
    const parentId = formData.get('parentId') as string | null

    if (!lessonId || !comment) {
      return {
        success: false,
        error: 'Missing required fields'
      }
    }

    if (comment.length > 2000) {
      return {
        success: false,
        error: 'Comment is too long (max 2000 characters)'
      }
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be signed in to comment'
      }
    }

    // Create comment
    const { error } = await supabase
      .from('lesson_comments')
      .insert({
        user_id: user.id,
        lesson_id: lessonId,
        comment,
        parent_id: parentId || null
      })

    if (error) throw error

    revalidatePath(`/courses/[slug]/lessons/[lessonId]`)

    return {
      success: true,
      message: 'Comment posted successfully!'
    }
  } catch (error) {
    console.error('Comment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Get all comments for a lesson
 */
export async function getLessonComments(lessonId: string) {
  try {
    const supabase = await createServerClient()

    const { data: comments, error } = await supabase
      .from('lesson_comments')
      .select(`
        *,
        profiles (
          name,
          email,
          avatar_url
        )
      `)
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Organize comments into parent and replies
    const parentComments = comments?.filter(c => !c.parent_id) || []
    const replies = comments?.filter(c => c.parent_id) || []

    const commentsWithReplies = parentComments.map(parent => ({
      ...parent,
      replies: replies.filter(r => r.parent_id === parent.id)
    }))

    return commentsWithReplies
  } catch (error) {
    console.error('Get comments error:', error)
    return []
  }
}

/**
 * Delete a comment (user must be comment author or admin)
 */
export async function deleteComment(commentId: string) {
  try {
    const supabase = await createServerClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be signed in'
      }
    }

    // Get comment to check ownership
    const { data: comment } = await supabase
      .from('lesson_comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (!comment) {
      return {
        success: false,
        error: 'Comment not found'
      }
    }

    // Check if user owns the comment or is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isOwner = comment.user_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        error: 'You do not have permission to delete this comment'
      }
    }

    // Delete the comment
    const { error } = await supabase
      .from('lesson_comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error

    revalidatePath(`/courses/[slug]/lessons/[lessonId]`)

    return {
      success: true,
      message: 'Comment deleted successfully'
    }
  } catch (error) {
    console.error('Delete comment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Update a comment
 */
export async function updateComment(commentId: string, newComment: string) {
  try {
    const supabase = await createServerClient()

    if (!newComment || newComment.length > 2000) {
      return {
        success: false,
        error: 'Invalid comment length'
      }
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'You must be signed in'
      }
    }

    // Verify ownership
    const { data: comment } = await supabase
      .from('lesson_comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (!comment || comment.user_id !== user.id) {
      return {
        success: false,
        error: 'You do not have permission to edit this comment'
      }
    }

    // Update the comment
    const { error } = await supabase
      .from('lesson_comments')
      .update({
        comment: newComment,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)

    if (error) throw error

    revalidatePath(`/courses/[slug]/lessons/[lessonId]`)

    return {
      success: true,
      message: 'Comment updated successfully'
    }
  } catch (error) {
    console.error('Update comment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
