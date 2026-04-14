'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { History, Copy, Check, Trash2, Wand2, Search, ChevronRight } from 'lucide-react';

interface Generation {
  id: string;
  type: string;
  topic: string;
  tone: string;
  result: string;
  createdAt: string;
}

const typeEmoji: Record<string, string> = {
  post: '📝', ideas: '💡', script: '🎬', caption: '✍️', thread: '🧵',
};

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    api.get('/generations').then(({ data }) => {
      setGenerations(data);
    }).catch(() => {
      toast.error('Failed to load history');
    }).finally(() => setLoading(false));
  }, []);

  const handleCopy = async (gen: Generation) => {
    await navigator.clipboard.writeText(gen.result);
    setCopied(gen.id);
    toast.success('Copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/generations/${id}`);
      setGenerations((prev) => prev.filter((g) => g.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = generations.filter(
    (g) =>
      g.topic.toLowerCase().includes(search.toLowerCase()) ||
      g.type.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
          <History className="text-indigo-400" size={30} /> History
        </h1>
        <p className="text-gray-400">All your generated content in one place</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by topic or type..."
          className="w-full bg-gray-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-white/10 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-800 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-600">
          <Wand2 size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium text-gray-500">No content yet</p>
          <p className="text-sm mb-6">Start generating content to see it here</p>
          <Link
            href="/generator"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium"
          >
            Open Generator <ChevronRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((gen) => (
            <div
              key={gen.id}
              className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="p-4 flex items-start gap-4">
                <span className="text-2xl shrink-0 mt-0.5">{typeEmoji[gen.type] ?? '✨'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{gen.topic}</p>
                  <p className="text-gray-500 text-xs capitalize mt-0.5">
                    {gen.type} · {gen.tone} · {new Date(gen.createdAt).toLocaleDateString()}
                  </p>
                  {expanded === gen.id && (
                    <pre className="text-gray-300 text-sm mt-3 whitespace-pre-wrap leading-relaxed font-sans bg-gray-800/50 rounded-lg p-3">
                      {gen.result}
                    </pre>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setExpanded(expanded === gen.id ? null : gen.id)}
                    className="text-gray-500 hover:text-gray-300 text-xs px-2 py-1 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                  >
                    {expanded === gen.id ? 'Hide' : 'View'}
                  </button>
                  <button
                    onClick={() => handleCopy(gen)}
                    className="text-gray-500 hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-indigo-500/10"
                    title="Copy"
                  >
                    {copied === gen.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(gen.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
