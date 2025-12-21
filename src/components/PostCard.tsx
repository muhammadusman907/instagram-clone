import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, MoreVertical } from 'lucide-react'
import type { Post } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { likesApi, postsApi } from '@/lib/api'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CommentsDialog } from './CommentsDialog'

interface PostCardProps {
  post: Post
  onDelete?: () => void
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAuthStore()
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const isOwnPost = user?.id === post.user_id

  const handleLike = async () => {
    if (!user || isLiking) return

    setIsLiking(true)
    const previousLiked = isLiked
    const previousCount = likesCount

    // Optimistic update
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

    try {
      if (previousLiked) {
        await likesApi.unlikePost(post.id, user.id)
      } else {
        await likesApi.likePost(post.id, user.id)
      }
    } catch (error) {
      // Revert on error
      setIsLiked(previousLiked)
      setLikesCount(previousCount)
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    if (!isOwnPost || !onDelete) return
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await postsApi.deletePost(post.id)
      onDelete()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <article className="mb-8 rounded-lg border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Link to={`/profile/${post.profile?.username}`} className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.profile?.avatar_url ?? undefined} alt={post.profile?.username} />
              <AvatarFallback>{getInitials(post.profile?.full_name ?? post.profile?.username ?? null)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.profile?.username}</p>
              {post.profile?.full_name && (
                <p className="text-sm text-muted-foreground">{post.profile.full_name}</p>
              )}
            </div>
          </Link>
          {isOwnPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Image */}
        <div className="relative aspect-square w-full bg-muted">
          <img
            src={post.image_url}
            alt={post.caption || 'Post image'}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Actions */}
        <div className="p-4 space-y-2">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              disabled={!user || isLiking}
              className={isLiked ? 'text-red-500 hover:text-red-600' : ''}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowComments(true)}
              disabled={!user}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </div>

          {/* Likes Count */}
          {likesCount > 0 && (
            <p className="font-semibold text-sm">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</p>
          )}

          {/* Caption */}
          <div className="text-sm">
            <Link to={`/profile/${post.profile?.username}`} className="font-semibold mr-2">
              {post.profile?.username}
            </Link>
            <span>{post.caption}</span>
          </div>

          {/* Comments Count */}
          {post.comments_count !== undefined && post.comments_count > 0 && (
            <button
              onClick={() => setShowComments(true)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
            </button>
          )}

          {/* Time */}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </article>

      {showComments && (
        <CommentsDialog
          postId={post.id}
          open={showComments}
          onOpenChange={setShowComments}
        />
      )}
    </>
  )
}

