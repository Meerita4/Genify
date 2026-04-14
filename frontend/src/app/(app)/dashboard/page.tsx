'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Wand2, History, Zap, TrendingUp, Clock, ChevronRight } from 'lucide-react';

interface Stats {
  credits: number;
  totalGenerations: number;
}

interface RecentGeneration {
  id: string;
  type: string;
  topic: string;
  tone: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentGeneration[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/generations'),
        ]);
        setStats(statsRes.data);
        setRecent(historyRes.data.slice(0, 5));
        await refreshUser();
      } catch {}
    };
    load();
  }, []);

  const typeEmoji: Record<string, string> = {
    post: '📝', ideas: '💡', script: '🎬', caption: '✍️', thread: '🧵',
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          Hey, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400">Ready to create something amazing today?</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Credits left</span>
            <Zap size={18} className={user && user.credits <= 2 ? 'text-red-400' : 'text-yellow-400'} />
          </div>
          <div className={`text-3xl font-bold ${user && user.credits <= 2 ? 'text-red-400' : 'text-white'}`}>
            {stats?.credits ?? user?.credits ?? 0}
          </div>
          {(stats?.credits ?? user?.credits ?? 0) <= 2 && (
            <p className="text-red-400 text-xs mt-1">Running low — upgrade soon</p>
          )}
        </div>

        <div className="bg-gray-900 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Total generated</span>
            <TrendingUp size={18} className="text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white">{stats?.totalGenerations ?? 0}</div>
          <p className="text-gray-500 text-xs mt-1">Pieces of content</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-indigo-300 text-sm font-medium">Quick generate</span>
            <Wand2 size={18} className="text-indigo-400" />
          </div>
          <p className="text-gray-300 text-sm mb-3">Create content in seconds</p>
          <Link
            href="/generator"
            className="flex items-center gap-1 text-indigo-300 text-sm font-medium hover:text-indigo-200"
          >
            Open Generator <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'TikTok ideas', type: 'ideas', platform: 'TikTok', emoji: '💡' },
            { label: 'LinkedIn post', type: 'post', platform: 'LinkedIn', emoji: '📝' },
            { label: 'Video script', type: 'script', platform: 'YouTube', emoji: '🎬' },
            { label: 'IG caption', type: 'caption', platform: 'Instagram', emoji: '✍️' },
          ].map((action) => (
            <Link
              key={action.label}
              href={`/generator?type=${action.type}&platform=${action.platform}`}
              className="bg-gray-900 border border-white/10 hover:border-indigo-500/40 rounded-xl p-4 transition-all hover:scale-105 text-center"
            >
              <div className="text-2xl mb-2">{action.emoji}</div>
              <p className="text-sm text-gray-300 font-medium">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent history */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent generations</h2>
            <Link href="/history" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {recent.map((gen) => (
              <div key={gen.id} className="bg-gray-900 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <span className="text-xl">{typeEmoji[gen.type] ?? '✨'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{gen.topic}</p>
                  <p className="text-gray-500 text-xs capitalize">{gen.type} · {gen.tone}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-xs">
                  <Clock size={12} />
                  {new Date(gen.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
