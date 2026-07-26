import { getCollection, type CollectionEntry } from 'astro:content'
import { isFuturePost } from './date'

/**
 * Get all posts, filtering out drafts and future-dated posts
 */
export async function getFilteredPosts() {
  const posts = await getCollection('posts')
  return posts.filter((post: CollectionEntry<'posts'>) => !post.id.startsWith('_') && !isFuturePost(post.data.pubDate))
}

/**
 * Get all posts sorted by publication date, filtering out drafts and future-dated posts
 */
export async function getSortedFilteredPosts() {
  const posts = await getFilteredPosts()
  return posts.sort(
    (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  )
}
