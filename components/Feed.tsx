
import React from 'react';
import { RapPost, UserProfile } from '../types';
import Post from './Post';

interface FeedProps {
  posts: RapPost[];
  profiles: Record<string, UserProfile>;
  onReply: (content: string, media?: any, parentId?: string) => void;
  onDelete: (postId: string) => void;
  onMetric: (postId: string, metric: 'view' | 'share' | 'like') => void;
  onFollow: (handle: string) => void;
  activeViewers?: Record<string, Record<string, number>>;
  onHeartbeatView?: (postId: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, profiles, onReply, onDelete, onMetric, onFollow, activeViewers, onHeartbeatView }) => {
  if (posts.length === 0) {
    return (
      <div className="p-20 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center mb-4 border border-zinc-800">
          <span className="text-2xl">📡</span>
        </div>
        <h3 className="text-lg font-black text-white uppercase tracking-tighter">Grid Standby</h3>
        <p className="text-zinc-500 text-sm mt-2 max-w-xs font-medium">No posts yet. Start sharing across the grid.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <Post 
          key={post.id} 
          post={post} 
          profiles={profiles}
          onReply={onReply} 
          onDelete={onDelete}
          onMetric={onMetric} 
          onFollow={onFollow}
          viewersCount={activeViewers ? Object.keys(activeViewers[post.id] || {}).length : 0}
          onHeartbeatView={onHeartbeatView}
        />
      ))}
    </div>
  );
};

export default Feed;