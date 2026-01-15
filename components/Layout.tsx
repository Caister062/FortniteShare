
import React from 'react';
import { UserProfile, LobbyPresence, RapPost, AppTab } from '../types';
import { formatMetric } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  presence: LobbyPresence[];
  postCount: number;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  currentUser: UserProfile;
  posts: RapPost[];
  onViewProfile?: (handle: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, presence, postCount, activeTab, onTabChange, currentUser, posts, onViewProfile }) => {
  const isVerified = currentUser.followers.length >= 10000;

  const getTrends = () => {
    const hashtags: Record<string, number> = {};
    const extract = (p: RapPost) => {
      const found = p.content.match(/#\w+/g);
      if (found) found.forEach(h => hashtags[h] = (hashtags[h] || 0) + 1);
      p.replies.forEach(extract);
    };
    posts.forEach(extract);
    return Object.entries(hashtags).sort((a, b) => b[1] - a[1]).slice(0, 5);
  };

  const trends = getTrends();

  return (
    <div className="bg-black text-white min-h-screen selection:bg-blue-500/30 font-sans overflow-x-hidden">
      <div className="flex justify-center max-w-[1400px] mx-auto">
        <aside className="hidden lg:flex flex-col w-64 p-6 sticky top-0 h-screen border-r border-zinc-800">
          <div className="mb-12 group cursor-pointer" onClick={() => onTabChange('posts')}>
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-4xl italic tracking-tighter">FS</span>
            </div>
          </div>
          <nav className="space-y-2">
            <NavItem icon="🏠" label="Posts" active={activeTab === 'posts'} onClick={() => onTabChange('posts')} />
            <NavItem icon="✉️" label="Messages" active={activeTab === 'messages'} onClick={() => onTabChange('messages')} />
            <NavItem icon="👤" label="Profile" active={activeTab === 'profile'} onClick={() => onTabChange('profile')} />
            <NavItem icon="📖" label="About" active={activeTab === 'about'} onClick={() => onTabChange('about')} />
          </nav>
          
          <div className="mt-auto space-y-4">
            <div className="px-4 py-2 bg-zinc-900/20 rounded-xl border border-zinc-800/50">
              <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                <span>Network Node</span>
                <span className="text-blue-500">Online</span>
              </div>
            </div>

            <div 
              className={`p-5 border transition-all duration-300 cursor-pointer rounded-[2rem] shadow-xl ${activeTab === 'profile' ? 'bg-blue-900/10 border-blue-500/30 scale-[1.02]' : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'}`}
              onClick={() => onTabChange('profile')}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src={currentUser.avatar} className="w-11 h-11 rounded-full border-2 border-zinc-800 bg-zinc-950" alt="" />
                  {isVerified && (
                    <div className="absolute -top-1 -right-1 text-blue-400 bg-black rounded-full p-0.5 shadow-lg">
                      <VerifiedBadge size={12} />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-black text-sm truncate" style={{ color: currentUser.color }}>{currentUser.name}</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{formatMetric(currentUser.followers.length)} Followers</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 w-full max-w-2xl min-h-screen">
          {children}
        </main>

        <aside className="hidden md:flex flex-col w-80 p-6 sticky top-0 h-screen space-y-6 border-l border-zinc-800">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-6 backdrop-blur-sm">
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">Grid Trends</h2>
            <div className="space-y-4">
              {trends.length > 0 ? trends.map(([tag, count]) => (
                <div key={tag} className="group cursor-pointer">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">Trending on Grid</p>
                  <p className="text-sm font-black text-white group-hover:text-blue-500 transition-colors">{tag}</p>
                  <p className="text-[9px] text-zinc-600 font-medium">{formatMetric(count)} Transmissions</p>
                </div>
              )) : (
                <p className="text-[10px] text-zinc-600 italic">No trending hashtags detected yet.</p>
              )}
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-7 backdrop-blur-sm shadow-2xl flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Grid Members</h2>
              <span className="bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{presence.length + 1}</span>
            </div>
            
            <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar">
              <MemberItem user={currentUser} label="Broadcasting" isMe onClick={() => onTabChange('profile')} />
              {presence.map((peer) => (
                <MemberItem key={peer.tabId} user={peer.user} label="Active Link" onClick={() => onViewProfile?.(peer.user.handle)} />
              ))}
              {presence.length === 0 && (
                <p className="text-[10px] text-zinc-600 font-medium italic pt-4">Watching the grid solo. Open another tab to link up.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const MemberItem = ({ user, label, isMe = false, onClick }: { user: UserProfile, label: string, isMe?: boolean, onClick?: () => void }) => {
  const isVerified = user.followers.length >= 10000;
  return (
    <div onClick={onClick} className="flex items-center justify-between group animate-in fade-in slide-in-from-right-2 duration-300 cursor-pointer">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="relative">
          <img src={user.avatar} className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-950 group-hover:border-zinc-600 transition-colors" alt="" />
          {isVerified && <div className="absolute -top-1 -right-1"><VerifiedBadge size={10} /></div>}
        </div>
        <div className="truncate">
          <div className="flex items-center space-x-1">
            <p className="font-bold text-sm text-zinc-200" style={{ color: user.color }}>{user.name}</p>
            {isMe && <span className="text-[8px] bg-zinc-800 px-1 rounded text-zinc-500">YOU</span>}
          </div>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{label}</p>
        </div>
      </div>
    </div>
  );
};

export const VerifiedBadge = ({ size = 14 }: { size?: number }) => (
  <div className="relative group">
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.47 0-.903.084-1.3.238C14.75 2.545 13.41 1.5 11.5 1.5c-1.92 0-3.26 1.045-3.902 2.348-.397-.154-.83-.238-1.3-.238-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4C1.375 9.55.5 10.92.5 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.47 0 .903-.084 1.3-.238.642 1.303 1.982 2.348 3.902 2.348 1.91 0 3.25-1.045 3.932-2.348.397.154.83.238 1.3.238 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.5 5l-4-4 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
    <div className="absolute inset-0 bg-blue-400 blur-md opacity-0 group-hover:opacity-30 transition-opacity rounded-full"></div>
  </div>
);

const NavItem = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center space-x-5 w-full p-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-zinc-900 text-blue-500 shadow-lg border border-zinc-800' : 'hover:bg-zinc-900/50 text-zinc-500 hover:text-white'}`}
  >
    <span className={`text-2xl transition-transform group-hover:scale-125 ${active ? 'scale-110' : ''}`}>{icon}</span>
    <span className={`text-[13px] font-black uppercase tracking-[0.2em] transition-opacity ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>{label}</span>
  </button>
);

export default Layout;
