'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vercelUrl: '',
    githubUrl: '',
    qiitaUrl: '',
    screenshot: null as File | null,
    tags: [] as string[]
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const availableTags = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript',
    'WebGL', 'Canvas', 'Three.js', 'Phaser',
    '顔認識', 'Web Audio API', 'WebSocket', 'TensorFlow.js',
    'Matter.js', 'Tailwind', 'Redux'
  ];

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここで実際の投稿処理を行う
    console.log('Submit:', formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Scanline effect */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-5 bg-repeat" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
      }}></div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="pixel-corners bg-gradient-to-r from-cyan-400 to-purple-500 p-1">
            <div className="pixel-corners bg-slate-900 px-8 py-4">
              <p className="text-2xl text-cyan-400 pixel-text font-bold">
                🎉 投稿成功!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b-4 border-cyan-400 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-40">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 relative pixel-corners">
              <div className="absolute inset-1 bg-slate-900 flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-cyan-400 pixel-text tracking-wider group-hover:text-purple-400 transition-colors">
              ゲーム発明会
            </h1>
          </Link>
          
          <div className="flex gap-4">
            <Link href="/games" className="pixel-button px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold pixel-text tracking-wider transition-all">
              一覧
            </Link>
            <Link href="/submit" className="pixel-button px-6 py-3 bg-cyan-500 text-slate-900 font-bold pixel-text tracking-wider">
              投稿
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-500 pixel-corners relative animate-float">
              <div className="absolute inset-2 bg-slate-900 flex items-center justify-center">
                <span className="text-5xl">📤</span>
              </div>
            </div>
          </div>
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 pixel-text mb-4">
            ゲームを投稿
          </h2>
          <p className="text-xl text-purple-300 pixel-text">
            あなたの発明を世界に共有しよう!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Game Title */}
          <FormField label="ゲームタイトル" required>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="例: 顔面ハンマー投げ"
              className="w-full px-6 py-4 bg-slate-800 border-4 border-cyan-400 text-cyan-100 pixel-text text-lg focus:outline-none focus:border-purple-400 transition-colors pixel-corners"
              required
            />
          </FormField>

          {/* Description */}
          <FormField label="説明" required>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="どんなゲームですか? どこが新しいですか?"
              rows={5}
              className="w-full px-6 py-4 bg-slate-800 border-4 border-cyan-400 text-cyan-100 pixel-text text-lg focus:outline-none focus:border-purple-400 transition-colors pixel-corners resize-none"
              required
            />
          </FormField>

          {/* Vercel URL */}
          <FormField label="プレイURL (Vercel等)" required>
            <input
              type="url"
              value={formData.vercelUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, vercelUrl: e.target.value }))}
              placeholder="https://your-game.vercel.app"
              className="w-full px-6 py-4 bg-slate-800 border-4 border-cyan-400 text-cyan-100 pixel-text text-lg focus:outline-none focus:border-purple-400 transition-colors pixel-corners"
              required
            />
          </FormField>

          {/* GitHub URL */}
          <FormField label="GitHubリポジトリ" required>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
              placeholder="https://github.com/username/repo"
              className="w-full px-6 py-4 bg-slate-800 border-4 border-cyan-400 text-cyan-100 pixel-text text-lg focus:outline-none focus:border-purple-400 transition-colors pixel-corners"
              required
            />
          </FormField>

          {/* Qiita URL (Optional) */}
          <FormField label="Qiita解説記事 (任意)">
            <input
              type="url"
              value={formData.qiitaUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, qiitaUrl: e.target.value }))}
              placeholder="https://qiita.com/username/items/..."
              className="w-full px-6 py-4 bg-slate-800 border-4 border-purple-400 text-cyan-100 pixel-text text-lg focus:outline-none focus:border-cyan-400 transition-colors pixel-corners"
            />
          </FormField>

          {/* Screenshot Upload */}
          <FormField label="スクリーンショット" required>
            <div className="border-4 border-dashed border-cyan-400 bg-slate-800 p-8 text-center pixel-corners hover:border-purple-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData(prev => ({ ...prev, screenshot: e.target.files?.[0] || null }))}
                className="hidden"
                id="screenshot-upload"
                required
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer">
                <div className="text-6xl mb-4">📸</div>
                <p className="text-xl text-cyan-400 pixel-text mb-2">
                  クリックして画像をアップロード
                </p>
                <p className="text-purple-300 pixel-text">
                  {formData.screenshot ? formData.screenshot.name : 'PNG, JPG, GIF (最大5MB)'}
                </p>
              </label>
            </div>
          </FormField>

          {/* Tags */}
          <FormField label="技術タグ (複数選択可)">
            <div className="flex flex-wrap gap-3">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`pixel-button px-4 py-2 pixel-text font-bold transition-all ${
                    formData.tags.includes(tag)
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-4 text-cyan-400 pixel-text">
                選択中: {formData.tags.join(', ')}
              </div>
            )}
          </FormField>

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="submit"
              className="w-full pixel-button px-8 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-2xl font-bold pixel-text tracking-wider transition-all transform hover:scale-105"
            >
              🚀 投稿する
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-12 pixel-corners bg-gradient-to-r from-purple-600 to-cyan-600 p-1">
          <div className="pixel-corners bg-slate-900 p-6">
            <h3 className="text-2xl font-bold text-cyan-400 pixel-text mb-3">📋 投稿ガイドライン</h3>
            <ul className="space-y-2 text-purple-300 pixel-text">
              <li>• 既存ゲームのコピーではなく、独自の工夫があること</li>
              <li>• GitHubでソースコードを公開すること</li>
              <li>• 技術的な解説があると他の開発者の学びになります</li>
              <li>• 楽しく、クリエイティブな作品をお待ちしています!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ 
  label, 
  required = false, 
  children 
}: { 
  label: string; 
  required?: boolean; 
  children: React.ReactNode 
}) {
  return (
    <div>
      <label className="block mb-3">
        <span className="text-2xl font-bold text-cyan-400 pixel-text">
          {label}
          {required && <span className="text-purple-400 ml-2">*</span>}
        </span>
      </label>
      {children}
    </div>
  );
}
