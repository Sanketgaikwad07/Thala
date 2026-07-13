import { v4 as uuid } from 'uuid';
import { db } from '../../data/db';
import { ApiError } from '../../utils/ApiError';
import { PaginationParams, paginate } from '../../utils/pagination';

function enrichPost(post: (typeof db.posts)[number], viewerId: string) {
  const author = db.users.find((u) => u.id === post.userId);
  return {
    ...post,
    author: author ? { id: author.id, name: author.name, photoUrl: author.photoUrl } : null,
    likeCount: post.likes.length,
    commentCount: post.comments.length,
    likedByMe: post.likes.includes(viewerId),
  };
}

export function getFeed(viewerId: string, pagination: PaginationParams) {
  const sorted = [...db.posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const { data, meta } = paginate(sorted, pagination);
  return { data: data.map((p) => enrichPost(p, viewerId)), meta };
}

export function createPost(userId: string, content: string, imageUrl?: string, activitySessionId?: string) {
  const post = {
    id: uuid(),
    userId,
    content,
    imageUrl,
    activitySessionId,
    likes: [] as string[],
    comments: [] as { id: string; userId: string; text: string; createdAt: string }[],
    shares: 0,
    createdAt: new Date().toISOString(),
  };
  db.posts.unshift(post);
  return enrichPost(post, userId);
}

export function toggleLike(userId: string, postId: string) {
  const post = db.posts.find((p) => p.id === postId);
  if (!post) throw ApiError.notFound('Post not found');
  const idx = post.likes.indexOf(userId);
  if (idx === -1) post.likes.push(userId);
  else post.likes.splice(idx, 1);
  return enrichPost(post, userId);
}

export function addComment(userId: string, postId: string, text: string) {
  const post = db.posts.find((p) => p.id === postId);
  if (!post) throw ApiError.notFound('Post not found');
  post.comments.push({ id: uuid(), userId, text, createdAt: new Date().toISOString() });
  return enrichPost(post, userId);
}

export function sharePost(userId: string, postId: string) {
  const post = db.posts.find((p) => p.id === postId);
  if (!post) throw ApiError.notFound('Post not found');
  post.shares += 1;
  return enrichPost(post, userId);
}

export function toggleFollow(followerId: string, followingId: string) {
  if (followerId === followingId) throw ApiError.badRequest('You cannot follow yourself');
  const idx = db.follows.findIndex((f) => f.followerId === followerId && f.followingId === followingId);
  if (idx === -1) {
    db.follows.push({ followerId, followingId });
    return { following: true };
  }
  db.follows.splice(idx, 1);
  return { following: false };
}

export function getFollowStats(userId: string) {
  return {
    followers: db.follows.filter((f) => f.followingId === userId).length,
    following: db.follows.filter((f) => f.followerId === userId).length,
  };
}
