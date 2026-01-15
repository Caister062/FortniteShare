
import React, { useState, useRef } from 'react';
import { NetworkStatus, UserProfile } from '../types';
import { VerifiedBadge } from './Layout';

interface ComposerProps {
  onPost: (content: string, media?: { type: 'image' | 'video' | 'gif', url: string }) => void;
  status: NetworkStatus;
  currentUser: UserProfile;
}

const Composer: React.FC<ComposerProps> = ({ onPost, status, currentUser }) => {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<{ type: 'image' | 'video' | 'gif', url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isVerified = currentUser.followers.length >= 10000;

  const handleSubmit = () => {
    if (!text.trim() || status !== NetworkStatus.IDLE) return;
    onPost(text, preview || undefined);
    setText("");
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const type = file.type.startsWith('video') ? 'video' : 'image';
        setPreview({ type, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 border-b border-zinc-800 flex space-x-4 bg-zinc-950/30">
      <div className="relative flex-shrink-0">
        <img src={currentUser.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" />
        {isVerified && (
          <div className="absolute -top-1 -right-1 bg-black rounded-full p-0.5 shadow-lg">
            <VerifiedBadge size={14} />
          </div>
        )}
      </div>
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your Fortnite clips or latest news... 🏗️"
          className="w-full bg-transparent text-xl outline-none resize-none placeholder:text-zinc-600 min-h-[80px]"
        />
        
        {preview && (
          <div className="relative mt-2 rounded-2xl overflow-hidden border border-zinc-800">
            {preview.type === 'video' ? (
              <video src={preview.url} controls className="w-full max-h-80 object-cover" />
            ) : (
              <img src={preview.url} alt="Upload" className="w-full max-h-80 object-cover" />
            )}
            <button onClick={() => setPreview(null)} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full hover:bg-black">✕</button>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 mt-2 border-t border-zinc-800">
          <div className="flex space-x-2">
            <button onClick={() => fileInputRef.current?.click()} className="hover:bg-blue-500/10 p-2 rounded-full transition text-blue-500">🖼️</button>
            <input type="file" hidden ref={fileInputRef} accept="image/*,video/*" onChange={handleFileChange} />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || status !== NetworkStatus.IDLE}
            className={`px-6 py-2 rounded-full font-black uppercase tracking-widest transition ${
              !text.trim() || status !== NetworkStatus.IDLE
                ? 'bg-blue-500/30 text-zinc-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
            }`}
          >
            SHARE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Composer;