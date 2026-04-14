'use client';
import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Wand2, Copy, Check, Loader2, Zap } from 'lucide-react';

const TYPES = [
  { value: 'post', label: '📝 Post', desc: 'Social media post' },
  { value: 'ideas', label: '💡 Ideas', desc: '5 content ideas' },
  { value: 'script', label: '🎬 Script', desc: 'Video script' },
  { value: 'caption', label: '✍️ Caption', desc: 'Short caption' },
  { value: 'thread', label: '🧵 Thread', desc: 'Twitter/X thread' },
];

const TONES = [
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'funny', label: 'Funny 😄' },
  { value: 'motivational', label: 'Motivational 🔥' },
  { value: 'professional', label: 'Professional' },
];

const PLATFORMS = ['TikTok', 'Instagram', 'LinkedIn', 'Twitter/X', 'YouTube', 'Facebook'];

function GeneratorContent() {
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();

  const [type, setType] = useState(searchParams.get('type') ?? 'post');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('casual');
  const [platform, setPlatform] = useState(searchParams.get('platform') ?? 'Instagram');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    if ((user?.credits ?? 0) <= 0) {
      toast.error('No credits remaining. Please upgrade your plan!');
      return;
    }

    setLoading(true);
    setResult('');

    const token = Cookies.get('token');
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'}/generations/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type, topic, tone, platform }),
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? 'Generation failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response stream');

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (!json) continue;
          try {
            const data = JSON.parse(json);
            if (data.chunk) setResult((prev) => prev + data.chunk);
            if (data.done) {
              await refreshUser();
              toast.success('Content generated! 🎉');
            }
          } catch {}
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const error = err as { message?: string };
      toast.error(error.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
          <Wand2 className="text-indigo-400" size={30} /> Content Generator
        </h1>
        <p className="text-gray-400">Fill in the form and watch AI create your content in real time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          {/* Content type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Content type</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    type === t.value
                      ? 'bg-indigo-600/30 border-indigo-500 text-white'
                      : 'bg-gray-900 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <div className="font-medium text-sm">{t.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    platform === p
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-gray-900 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Topic / prompt</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`e.g. "5 morning habits that changed my life" or "sustainable fashion for budget travelers"`}
              rows={3}
              className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    tone === t.value
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-gray-900 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Credits info */}
          <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border
            ${(user?.credits ?? 0) <= 2 ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'}`}>
            <Zap size={14} />
            {user?.credits} credit{user?.credits !== 1 ? 's' : ''} remaining
          </div>

          {/* Generate button */}
          <button
            onClick={loading ? handleStop : handleGenerate}
            disabled={!loading && (user?.credits ?? 0) <= 0}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
              loading
                ? 'bg-red-600/80 hover:bg-red-600 text-white'
                : (user?.credits ?? 0) <= 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.02]'
            }`}
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Stop generation</>
            ) : (
              <><Wand2 size={18} /> Generate content</>
            )}
          </button>
        </div>

        {/* Result */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">Generated content</label>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            )}
          </div>
          <div
            className={`min-h-[400px] bg-gray-900 border rounded-2xl p-5 transition-all ${
              loading ? 'border-indigo-500/50' : 'border-white/10'
            }`}
          >
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center gap-3">
                <Wand2 size={40} className="opacity-20" />
                <p className="text-sm">Your generated content will appear here</p>
                <p className="text-xs">Fill the form and click Generate</p>
              </div>
            )}
            {result && (
              <pre className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed font-sans">
                {result}
                {loading && <span className="inline-block w-2 h-4 bg-indigo-400 ml-1 animate-pulse rounded" />}
              </pre>
            )}
            {loading && !result && (
              <div className="h-full flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-400">
                  <Loader2 className="animate-spin text-indigo-400" size={22} />
                  <span className="text-sm">AI is generating your content...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense>
      <GeneratorContent />
    </Suspense>
  );
}
