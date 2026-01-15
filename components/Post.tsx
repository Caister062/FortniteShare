
import React, { useState, useEffect, useRef } from 'react';
import { RapPost, UserProfile } from '../types';
import { CURRENT_USER, formatMetric } from '../constants';
import { VerifiedBadge } from './Layout';

interface PostProps {
  post: RapPost;
  profiles: Record<string, UserProfile>;
  onReply: (content: string, media?: any, parentId?: string) => void;
  onDelete: (postId: string) => void;
  onMetric: (postId: string, metric: 'view' | 'share' | 'like') => void;
  onFollow: (handle: string) => void;
  isReply?: boolean;
  viewersCount?: number;
  onHeartbeatView?: (postId: string) => void;
}

const Post: React.FC<PostProps> = ({ post, profiles, onReply, onDelete, onMetric, onFollow, isReply = false, viewersCount = 0, onHeartbeatView }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isInViewport, setIsInViewport] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);

  const author = profiles[post.author.handle] || post.author;
  const me = profiles[CURRENT_USER.handle];
  const isFollowing = me?.following.includes(author.handle);
  const isVerified = author.followers.length >= 10000;

  const isLikedByMe = post.likedBy.includes(CURRENT_USER.handle);
  const isSharedByMe = post.sharedBy?.includes(CURRENT_USER.handle) || false;
  const hasIViewed = post.viewedBy?.includes(CURRENT_USER.handle) || false;
  const isMyPost = author.handle === CURRENT_USER.handle;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const isVisible = entries[0].isIntersecting;
      setIsInViewport(isVisible);
      if (isVisible && !hasIViewed) onMetric(post.id, 'view');
    }, { threshold: 0.5 });
    if (postRef.current) observer.observe(postRef.current);
    return () => observer.disconnect();
  }, [hasIViewed, post.id, onMetric]);

  useEffect(() => {
    if (!isInViewport || !onHeartbeatView) return;
    onHeartbeatView(post.id);
    const interval = setInterval(() => onHeartbeatView(post.id), 2000);
    return () => clearInterval(interval);
  }, [isInViewport, post.id, onHeartbeatView]);

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFollow(author.handle);
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const handle = part.slice(1);
        const user = profiles[handle];
        return (
          <span 
            key={i} 
            className="text-blue-500 font-bold hover:underline cursor-pointer"
            title={user ? user.name : handle}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const formattedTime = new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div ref={postRef} className={`${isReply ? 'ml-8 mt-2 border-l-2 border-zinc-800 pl-4' : 'border-b border-zinc-900'} p-5 hover:bg-zinc-900/10 transition-all group relative overflow-hidden`}>
      {viewersCount > 0 && (
        <div className="absolute top-0 right-0 p-3 pointer-events-none">
          <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center space-x-1 animate-pulse">
            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
            <span>{viewersCount} Watching</span>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <div className="relative flex-shrink-0">
          <img src={author.avatar} alt={author.handle} className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900" />
          {isVerified && (
            <div className="absolute -top-1.5 -right-1.5 bg-black rounded-full p-0.5 shadow-lg">
              <VerifiedBadge size={12} />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white flex items-center gap-1" style={{ color: author.color }}>
                {author.name}
              </span>
              <span className="text-zinc-600 text-xs">@{author.handle}</span>
              {!isMyPost && (
                <button 
                  onClick={handleFollowToggle}
                  className={`ml-2 text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded-full transition-all border ${
                    isFollowing 
                      ? 'border-zinc-800 text-zinc-500 hover:border-red-500 hover:text-red-500' 
                      : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-zinc-700 text-[9px] font-black uppercase tracking-widest">{formattedTime}</span>
              {isMyPost && (
                <button 
                  onClick={() => isConfirmingDelete ? onDelete(post.id) : setIsConfirmingDelete(true)}
                  className={`text-[9px] font-black p-1 transition-all ${isConfirmingDelete ? 'bg-red-600 text-white rounded px-2 animate-pulse' : 'text-zinc-700 hover:text-red-500'}`}
                >
                  {isConfirmingDelete ? 'SCRUB?' : '✕'}
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-2 text-[15px] leading-relaxed text-zinc-200">
            {renderContent(post.content)}
          </div>

          {post.media && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
              {post.media.type === 'video' ? (
                <video src={post.media.url} controls className="w-full max-h-80 object-contain" />
              ) : (
                <img src={post.media.url} alt="" className="w-full max-h-80 object-contain" />
              )}
            </div>
          )}

          <div className="flex items-center space-x-8 mt-4 text-zinc-500 select-none">
            <button onClick={() => setShowReplyBox(!showReplyBox)} className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
              <span className="text-lg">💬</span>
              <span className="text-xs font-black">{post.replies.length}</span>
            </button>
            <button onClick={() => onMetric(post.id, 'like')} className={`flex items-center space-x-2 transition-colors ${isLikedByMe ? 'text-pink-500' : 'hover:text-pink-500'}`}>
              <span className="text-lg">{isLikedByMe ? '❤️' : '🤍'}</span>
              <span className="text-xs font-black">{formatMetric(post.likes)}</span>
            </button>
            <button onClick={() => onMetric(post.id, 'share')} className={`flex items-center space-x-2 transition-colors ${isSharedByMe ? 'text-green-500' : 'hover:text-green-500'}`}>
              <span className="text-lg">🔁</span>
              <span className="text-xs font-black">{formatMetric(post.shares)}</span>
            </button>
            <div className="flex items-center space-x-2 text-zinc-700">
              <span className="text-sm">👁️</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{formatMetric(post.views)} Views</span>
            </div>
          </div>

          {showReplyBox && (
            <div className="mt-4 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Drop a reply... Tip: Use @name to mention someone!"
                className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-zinc-700 min-h-[60px]"
              />
              <div className="flex justify-end mt-2">
                <button onClick={() => { onReply(replyText, undefined, post.id); setReplyText(""); setShowReplyBox(false); }} className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full hover:bg-blue-500 uppercase tracking-widest">Reply</button>
              </div>
            </div>
          )}

          {post.replies && post.replies.length > 0 && (
            <div className="mt-4 space-y-2">
              {post.replies.map(reply => (
                <Post key={reply.id} post={reply} profiles={profiles} onReply={onReply} onDelete={onDelete} onMetric={onMetric} onFollow={onFollow} isReply={true} onHeartbeatView={onHeartbeatView} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
