import { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { Post } from '@/types'
import { postsApi } from '@/lib/api'
import { PostCard } from '@/components/PostCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const postsPerPage = 10

  const loadPosts = async (pageNum: number, reset = false) => {
    try {
      const newPosts = await postsApi.getPosts(postsPerPage, pageNum * postsPerPage)
      
      if (reset) {
        setPosts(newPosts)
      } else {
        setPosts((prev) => [...prev, ...newPosts])
      }

      setHasMore(newPosts.length === postsPerPage)
    } catch (error) {
      console.error('Error loading posts:', error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts(0, true)
    
    // Listen for comment changes to refresh posts
    const handleCommentChange = () => {
      loadPosts(0, true)
    }
    window.addEventListener('comment-added', handleCommentChange)
    window.addEventListener('comment-deleted', handleCommentChange)
    
    return () => {
      window.removeEventListener('comment-added', handleCommentChange)
      window.removeEventListener('comment-deleted', handleCommentChange)
    }
  }, [])

  const fetchMorePosts = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadPosts(nextPage, false)
  }

  const handlePostDelete = () => {
    loadPosts(0, true)
  }

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-xl font-semibold text-muted-foreground mb-2">No posts yet</p>
        <p className="text-muted-foreground">Be the first to share something!</p>
      </div>
    )
  }

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMorePosts}
      hasMore={hasMore}
      loader={
        <div className="space-y-8 mt-8">
          {[1, 2].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      }
      endMessage={
        <div className="text-center py-8 text-muted-foreground">
          <p>You've seen all posts!</p>
        </div>
      }
    >
      <div className="space-y-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={handlePostDelete} />
        ))}
      </div>
    </InfiniteScroll>
  )
}

function PostSkeleton() {
  return (
    <article className="rounded-lg border bg-card shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <div className="flex space-x-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6" />
        </div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-32" />
      </div>
    </article>
  )
}
