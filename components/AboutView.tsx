
import React from 'react';

const AboutView: React.FC = () => {
  return (
    <div className="flex flex-col bg-black min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="relative p-10 border-b border-zinc-900 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10">
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.5em] mb-2">Protocol: Fortnite Share</h2>
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
            FORTNITE <span className="text-blue-500">SHARE</span>
          </h1>
          <p className="text-zinc-500 font-bold mt-4 max-w-md leading-relaxed">
            The premier social transmission hub for the Fortnite community. 
            Drop clips, share meta-updates, and link up with the best players on the grid.
          </p>
        </div>
      </div>

      {/* Philosophy Grid */}
      <div className="p-8 space-y-8">
        <section>
          <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-6">Core Directives</h3>
          <div className="grid grid-cols-1 gap-6">
            <InfoCard 
              icon="🏗️" 
              title="Built for Players" 
              desc="Fortnite Share was architected to give players a dedicated space. Whether you're an OG map builder or a high-stakes competitive pro, your content belongs here." 
            />
            <InfoCard 
              icon="🛡️" 
              title="The Shield Protocol" 
              desc="We use advanced AI moderation to ensure the grid remains a toxic-free zone. Healthy competition is allowed, but toxicity is automatically scrubbed." 
            />
            <InfoCard 
              icon="📡" 
              title="Direct Uplink" 
              desc="Private real-time messaging allows secure tactical discussions. Connect directly with any player currently broadcasting on the grid." 
            />
            <InfoCard 
              icon="🏷️" 
              title="Mention System" 
              desc="Tag your teammates or rivals using @handles. Mentions are tracked and linked directly to player profiles across the network." 
            />
          </div>
        </section>

        <section className="bg-zinc-900/20 border border-zinc-800 rounded-[2.5rem] p-8 mt-12">
          <h3 className="text-xl font-black italic text-white uppercase tracking-tighter mb-4">The Vision</h3>
          <p className="text-zinc-400 font-medium leading-relaxed">
            Fortnite Share represents the intersection of high-tier gaming and social interaction. 
            It's more than a feed; it's a living, breathing network for those who live for the next drop.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Tag label="#Fortnite" />
            <Tag label="#FortniteShare" />
            <Tag label="#TheGrid" />
            <Tag label="#VictoryRoyale" />
          </div>
        </section>

        <section className="pb-20">
          <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-6">Uplink Status</h3>
          <div className="flex items-center space-x-4 p-6 bg-blue-900/5 border border-blue-500/10 rounded-2xl">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-widest">Share Node Active</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Version 4.0.1 • All systems nominal</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="flex items-start space-x-6 p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 transition-all group">
    <div className="text-3xl bg-zinc-950 p-4 rounded-2xl border border-zinc-800 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="space-y-2">
      <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">{title}</h4>
      <p className="text-zinc-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Tag = ({ label }: { label: string }) => (
  <span className="px-4 py-2 bg-zinc-900 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-zinc-800 hover:text-blue-500 hover:border-blue-500/30 transition-all cursor-default">
    {label}
  </span>
);

export default AboutView;
