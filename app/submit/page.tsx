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
    <div className="min-h-screen font-pixel text-[#331100]">

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-[#fbad08] nes-container !p-0">
            <div className="bg-white px-8 py-4">
              <p className="text-2xl text-black font-bold">
                🎉 投稿成功!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b-4 border-black bg-[#8b4513] sticky top-0 z-40">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-[#fbad08] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#000]">
              <span className="text-2xl">🎮</span>
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-widest drop-shadow-[2px_2px_0_#000] group-hover:text-[#fbad08] transition-colors">
              ゲーム発明会
            </h1>
          </Link>
          
          <div className="flex gap-4">
            <Link href="/games" className="pixel-button px-4 md:px-6 py-2 md:py-3 bg-[#c46237] text-white hover:bg-[#e45c10] no-underline shadow-[4px_4px_0_#000]">
              一覧
            </Link>
            <Link href="/submit" className="pixel-button px-4 md:px-6 py-2 md:py-3 bg-[#fbad08] text-black hover:bg-yellow-300 no-underline shadow-[4px_4px_0_#000]">
              投稿
            </Link>
          </div>
        </nav>
      </header>


      <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 bg-white nes-container !p-0 flex items-center justify-center animate-float">
              <span className="text-5xl">📤</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#8b4513] mb-4 drop-shadow-[3px_3px_0_#fff]" style={{ textShadow: '3px 3px 0 #fff, 5px 5px 0 #000' }}>
            ゲームを投稿
          </h2>
          <div className="nes-container inline-block bg-white mt-4">
            <p className="text-xl text-[#331100]">
              あなたの発明を世界に共有しよう!
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="nes-container bg-[#f8dcb4] mb-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Game Title */}
          <FormField label="ゲームタイトル" required>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="例: 顔面ハンマー投げ"
              className="w-full px-6 py-4 bg-white border-4 border-black text-[#331100] text-lg focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_4px_4px_0_#ccc]"
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
              className="w-full px-6 py-4 bg-white border-4 border-black text-[#331100] text-lg focus:outline-none focus:border-[#8b4513] transition-colors resize-none shadow-[inset_4px_4px_0_#ccc]"
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
              className="w-full px-6 py-4 bg-white border-4 border-black text-[#331100] text-lg focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_4px_4px_0_#ccc]"
              required
            />
            <p className="mt-2 text-sm text-[#8b4513] font-bold">
              ※アカウント登録なしですぐに遊べるURLを入力してください
            </p>
          </FormField>

          {/* GitHub URL */}
          <FormField label="GitHubリポジトリ" required>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
              placeholder="https://github.com/username/repo"
              className="w-full px-6 py-4 bg-white border-4 border-black text-[#331100] text-lg focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_4px_4px_0_#ccc]"
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
              className="w-full px-6 py-4 bg-white border-4 border-black text-[#331100] text-lg focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_4px_4px_0_#ccc]"
            />
          </FormField>

          {/* Screenshot Upload */}
          <FormField label="スクリーンショット" required>
            <div className="border-4 border-dashed border-black bg-[#f8dcb4] p-8 text-center hover:bg-white transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData(prev => ({ ...prev, screenshot: e.target.files?.[0] || null }))}
                className="hidden"
                id="screenshot-upload"
                required
              />
              <label htmlFor="screenshot-upload" className="cursor-pointer block w-full h-full">
                <div className="text-6xl mb-4">📸</div>
                <p className="text-xl text-[#331100] mb-2 font-bold">
                  クリックして画像をアップロード
                </p>
                <p className="text-[#331100] text-sm opacity-75">
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
                  className={`pixel-button px-4 py-2 font-bold transition-all border-4 ${
                    formData.tags.includes(tag)
                      ? 'bg-[#e45c10] text-white translate-x-[2px] translate-y-[2px] shadow-none border-black'
                      : 'bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0_#000] border-black'
                  }`}
                >
                  {formData.tags.includes(tag) && <span className="mr-2">✔️</span>}
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-4 text-[#331100] text-sm font-bold">
                選択中: {formData.tags.join(', ')}
              </div>
            )}
          </FormField>

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="submit"
              className="w-full pixel-button px-8 py-6 bg-[#e45c10] hover:bg-[#c7004c] text-white text-2xl font-bold tracking-wider transition-all transform hover:scale-105 shadow-[6px_6px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0_#000] animate-pulse"
            >
              🚀 INSERT COIN TO SUBMIT
            </button>
          </div>
        </form>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-white nes-container">
          <h3 className="text-2xl font-bold text-[#8b4513] mb-3 border-b-4 border-black pb-2">📋 投稿ガイドライン</h3>
          <ul className="space-y-4 text-[#331100] list-disc list-inside">
            <li>既存ゲームのコピーではなく、独自の工夫があること</li>
            <li>遊ぶ際にアカウント作成やログインを求めないこと（誰でもすぐに遊べるようにしてください）</li>
            <li>GitHubでソースコードを公開すること</li>
            <li>技術的な解説があると他の開発者の学びになります</li>
            <li>楽しく、クリエイティブな作品をお待ちしています!</li>
          </ul>
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
        <span className="text-xl md:text-2xl font-bold text-[#331100] block border-l-8 border-[#e45c10] pl-3">
          {label}
          {required && <span className="text-[#8b4513] ml-2 text-sm">(必須)</span>}
        </span>
      </label>
      {children}
    </div>
  );
}
