
import React, { useState, useRef } from 'react';
import { UserProfile, RapPost } from '../types';
import { formatMetric, CURRENT_USER } from '../constants';
import { VerifiedBadge } from './Layout';
import Feed from './Feed';

interface ProfileViewProps {
  user: UserProfile;
  posts: RapPost[];
  presenceCount: number;
  onReply: (content: string, media?: any, parentId?: string) => void;
  onDelete: (postId: string) => void;
  onMetric: (postId: string, metric: 'view' | 'share' | 'like') => void;
  onFollow: (handle: string) => void;
  onProfileUpdate: (updates: Partial<UserProfile>) => void;
  activeViewers?: Record<string, Record<string, number>>;
  onHeartbeatView?: (postId: string) => void;
  profiles: Record<string, UserProfile>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, posts, presenceCount, onReply, onDelete, onMetric, onFollow, onProfileUpdate, activeViewers, onHeartbeatView, profiles 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    handle: user.handle,
    bio: user.bio,
    avatar: user.avatar,
    banner: user.banner || ''
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const author = profiles[user.handle] || user;
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes || 0), 0);
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const isVerified = author.followers.length >= 10000;
  const isMe = author.handle === CURRENT_USER.handle;

  const verificationGoal = 10000;
  const progress = Math.min((author.followers.length / verificationGoal) * 100, 100);

  const handleSave = () => {
    onProfileUpdate(editData);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="relative">
        {/* Banner Section */}
        <div className="h-48 relative overflow-hidden group">
          <img 
            src={isEditing ? editData.banner : (author.banner || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop')} 
            className="w-full h-full object-cover transition-transform duration-700" 
            alt="Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
          {isEditing && (
            <button 
              onClick={() => bannerInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Change Banner</span>
            </button>
          )}
          <input type="file" hidden ref={bannerInputRef} accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
        </div>

        <div className="px-6 -mt-16 relative z-10">
          <div className="flex justify-between items-end">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="relative">
                <img 
                  src={isEditing ? editData.avatar : author.avatar} 
                  className="w-32 h-32 rounded-3xl border-4 border-black bg-zinc-900 shadow-2xl transition-transform group-hover:scale-105 object-cover" 
                  alt="Avatar"
                />
                {isEditing && (
                  <button 
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Edit</span>
                  </button>
                )}
              </div>
              <input type="file" hidden ref={avatarInputRef} accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
              
              {isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-1 border-4 border-black shadow-xl">
                  <VerifiedBadge size={20} />
                </div>
              )}
            </div>

            {isMe && (
              <div className="flex gap-2 mb-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-zinc-800 rounded-full text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-600 rounded-full text-xs font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                    >
                      Save Uplink
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 border border-zinc-800 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95 shadow-lg"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-4">
            {isEditing ? (
              <div className="space-y-4 max-w-lg animate-in zoom-in-95 duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Display Name</label>
                    <input 
                      type="text" 
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Username (Handle)</label>
                    <input 
                      type="text" 
                      value={editData.handle}
                      onChange={(e) => setEditData(prev => ({ ...prev, handle: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-400 outline-none focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Bio Protocol</label>
                  <textarea 
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 transition-all shadow-inner"
                    rows={3}
                    placeholder="Tell the grid your story..."
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-black text-white" style={{ color: author.color }}>{author.name}</h2>
                  {isVerified && <VerifiedBadge size={18} />}
                </div>
                <p className="text-zinc-500 font-bold">@{author.handle}</p>
                <div className="mt-4">
                  <p className="text-zinc-300 text-[15px] leading-relaxed max-w-lg whitespace-pre-wrap">{author.bio}</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex gap-6 text-[11px] font-black uppercase tracking-widest text-zinc-500">
            <div className="flex items-center space-x-2 group cursor-default">
              <span className="text-white group-hover:text-blue-500 transition-colors">{formatMetric(author.following.length)}</span>
              <span className="text-zinc-600">Following</span>
            </div>
            <div className="flex items-center space-x-2 group cursor-default">
              <span className="text-white group-hover:text-blue-500 transition-colors">{formatMetric(author.followers.length)}</span>
              <span className="text-zinc-600">Followers</span>
            </div>
          </div>

          {!isVerified && (
            <div className="mt-6 max-w-sm">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter mb-2 text-zinc-500">
                <span>Verification Path</span>
                <span>{formatMetric(author.followers.length)} / {formatMetric(verificationGoal)}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.6)]" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-[8px] text-zinc-600 font-bold uppercase mt-2 tracking-widest">Connect with {formatMetric(verificationGoal - author.followers.length)} more users to unlock the badge.</p>
            </div>
          )}

          <div className="mt-8 flex gap-8 border-y border-zinc-900 py-6">
            <Stat label="Total Drops" value={posts.length} />
            <Stat label="Grid Reach" value={totalViews} />
            <Stat label="Like Uplinks" value={totalLikes} />
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        <Feed 
          posts={posts} 
          profiles={profiles}
          onReply={onReply} 
          onDelete={onDelete}
          onMetric={onMetric} 
          onFollow={onFollow}
          activeViewers={activeViewers}
          onHeartbeatView={onHeartbeatView}
        />
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string, value: number }) => (
  <div className="flex flex-col group cursor-default">
    <span className="text-xl font-black text-white group-hover:text-blue-500 transition-colors">{formatMetric(value)}</span>
    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-0.5">{label}</span>
  </div>
);

export default ProfileView;
