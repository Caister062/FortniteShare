
import React, { useState, useEffect, useRef } from 'react';
import { DirectMessage, UserProfile } from '../types';

interface MessagesViewProps {
  messages: DirectMessage[];
  myProfile: UserProfile;
  profiles: Record<string, UserProfile>;
  onlineUsers: UserProfile[];
  onSendMessage: (receiverHandle: string, content: string) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ messages, myProfile, profiles, onlineUsers, onSendMessage }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter messages for current conversation
  const chatMessages = messages.filter(m => 
    (m.senderHandle === myProfile.handle && m.receiverHandle === selectedChat) ||
    (m.receiverHandle === myProfile.handle && m.senderHandle === selectedChat)
  ).sort((a, b) => a.timestamp - b.timestamp);

  // Group messages by contact to list conversations
  const conversations = Array.from(new Set([
    ...messages.map(m => m.senderHandle === myProfile.handle ? m.receiverHandle : m.senderHandle),
    ...onlineUsers.map(u => u.handle).filter(h => h !== myProfile.handle)
  ])).map(handle => profiles[handle] || { handle, name: handle, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${handle}`, color: '#ccc' });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedChat) return;
    onSendMessage(selectedChat, inputText);
    setInputText("");
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-black animate-in fade-in duration-500">
      {/* Contact List */}
      <div className="w-1/3 border-r border-zinc-800 overflow-y-auto">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Active Links</h3>
        </div>
        {conversations.length > 0 ? conversations.map(user => (
          <div 
            key={user.handle}
            onClick={() => setSelectedChat(user.handle)}
            className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-zinc-900 transition-colors border-b border-zinc-900/50 ${selectedChat === user.handle ? 'bg-zinc-900 border-r-4 border-blue-600' : ''}`}
          >
            <img src={user.avatar} className="w-10 h-10 rounded-xl border border-zinc-800" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: user.color }}>{user.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">@{user.handle}</p>
            </div>
          </div>
        )) : (
          <div className="p-10 text-center text-zinc-600 text-xs font-bold uppercase">No active uplinks</div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-zinc-950/20">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center space-x-3 bg-black/50">
              <img src={profiles[selectedChat]?.avatar} className="w-8 h-8 rounded-lg" />
              <div>
                <p className="font-black text-xs uppercase" style={{ color: profiles[selectedChat]?.color }}>{profiles[selectedChat]?.name}</p>
                <p className="text-[9px] text-zinc-500">SECURE CHANNEL</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {chatMessages.map(msg => {
                const isMe = msg.senderHandle === myProfile.handle;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-200 rounded-tl-none'}`}>
                      {msg.content}
                      <p className={`text-[8px] mt-1 opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {chatMessages.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Start of Transmission</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-black border-t border-zinc-800">
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Drop a message..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                >
                  📡
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-4 border border-zinc-800 text-3xl">
              ✉️
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Encrypted Uplink</h3>
            <p className="text-zinc-600 text-[10px] mt-2 font-bold uppercase tracking-widest max-w-xs">Select a player from the grid to initiate private transmission.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;
