'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { createClient } from '@/lib/db/client';
import type { User } from '@supabase/supabase-js';
import type { Tag } from '@/types/database';

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vercelUrl: '',
    githubUrl: '',
    qiitaUrl: '',
    screenshotUrl: '',
    tags: [] as string[]
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newTagInput, setNewTagInput] = useState('');
  const [addingTag, setAddingTag] = useState(false);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch('/api/tags');
      if (res.ok) {
        const data = await res.json();
        setAvailableTags(data);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthLoading(false);
    });
    fetchTags();
  }, [fetchTags]);

  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/submit`,
      },
    });
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const addNewTag = async () => {
    const tagName = newTagInput.trim();
    if (!tagName) return;

    // Check if already in available tags
    if (availableTags.some(t => t.name.toLowerCase() === tagName.toLowerCase())) {
      // Just select it
      if (!formData.tags.includes(tagName)) {
        toggleTag(tagName);
      }
      setNewTagInput('');
      return;
    }

    setAddingTag(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tagName }),
      });

      if (res.ok) {
        const data = await res.json();
        // Add to available tags if new
        if (!data.exists) {
          setAvailableTags(prev => [...prev, { id: data.id, name: data.name, usage_count: 0, created_at: new Date().toISOString() }]);
        }
        // Select the tag
        if (!formData.tags.includes(data.name)) {
          setFormData(prev => ({ ...prev, tags: [...prev.tags, data.name] }));
        }
        setNewTagInput('');
      } else {
        const data = await res.json();
        setError(data.error || 'タグの追加に失敗しました');
      }
    } catch {
      setError('タグの追加に失敗しました');
    } finally {
      setAddingTag(false);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('対応形式: JPEG, PNG, GIF, WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('ファイルサイズは5MB以下にしてください');
      return;
    }
    setError(null);
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const uploadScreenshot = async (): Promise<string | null> => {
    if (!screenshotFile) return formData.screenshotUrl || null;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', screenshotFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'アップロードに失敗しました');
      }

      const { url } = await res.json();
      return url;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Upload screenshot first if file is selected
      let screenshotUrl = formData.screenshotUrl;
      if (screenshotFile) {
        const uploadedUrl = await uploadScreenshot();
        if (!uploadedUrl) {
          throw new Error('スクリーンショットのアップロードに失敗しました');
        }
        screenshotUrl = uploadedUrl;
      }

      if (!screenshotUrl) {
        throw new Error('スクリーンショットは必須です');
      }

      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          screenshot_url: screenshotUrl,
          vercel_url: formData.vercelUrl,
          github_url: formData.githubUrl || null,
          qiita_url: formData.qiitaUrl || null,
          tags: formData.tags,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '投稿に失敗しました');
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push('/games');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-pixel text-[#331100]">

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[60] animate-bounce">
          <div className="bg-[#fbad08] nes-container !p-0">
            <div className="bg-white px-8 py-4">
              <p className="text-2xl text-black font-bold">
                🎉 投稿成功!
              </p>
            </div>
          </div>
        </div>
      )}

      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">

        {authLoading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 pixelated animate-float">⏳</div>
            <p className="text-2xl text-[#331100]">読み込み中...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-8 pixelated">🔒</div>
            <p className="text-2xl text-[#331100] mb-8">投稿するにはログインが必要です</p>
            <button
              onClick={handleLogin}
              className="pixel-button px-12 py-6 bg-[#333] text-white text-xl hover:bg-yellow-300 shadow-[6px_6px_0_#000] inline-flex items-center gap-3"
            >
              GitHubでログイン
            </button>
          </div>
        ) : (
          <>
            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <div className="w-24 h-24 bg-white nes-container !p-0 flex items-center justify-center animate-float">
                  <span className="text-5xl pixelated">📤</span>
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
              <FormField label="GitHubリポジトリ（任意）">
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-6 py-4 bg-white border-4 border-black text-[#331100] text-lg focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_4px_4px_0_#ccc]"
                />
              </FormField>
              {/* Qiita URL (Optional) */}
              <FormField label="Qiita解説記事（任意）">
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
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative cursor-pointer border-4 border-dashed transition-all ${
                    isDragging
                      ? 'border-[#e45c10] bg-orange-50'
                      : 'border-black bg-white hover:border-[#8b4513]'
                  } ${screenshotPreview ? 'p-2' : 'p-8'}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                  />
                  {screenshotPreview ? (
                    <div className="relative">
                      <img
                        src={screenshotPreview}
                        alt="Preview"
                        className="w-full max-h-64 object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setScreenshotFile(null);
                          setScreenshotPreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white border-2 border-black font-bold hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-5xl mb-4 pixelated">📷</div>
                      <p className="text-lg text-[#331100] font-bold mb-2">
                        クリックまたはドラッグ&ドロップ
                      </p>
                      <p className="text-sm text-[#8b4513]">
                        JPEG, PNG, GIF, WebP (最大5MB)
                      </p>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                      <div className="text-2xl pixelated animate-pulse">アップロード中...</div>
                    </div>
                  )}
                </div>
              </FormField>

              {/* Tags */}
              <FormField label="技術タグ (複数選択可)">
                {/* Add new tag input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addNewTag();
                      }
                    }}
                    placeholder="新しいタグを追加..."
                    className="flex-1 px-4 py-3 bg-white border-4 border-black text-[#331100] focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_2px_2px_0_#ccc]"
                    disabled={addingTag}
                  />
                  <button
                    type="button"
                    onClick={addNewTag}
                    disabled={addingTag || !newTagInput.trim()}
                    className={`pixel-button px-6 py-3 font-bold border-4 border-black transition-all ${
                      addingTag || !newTagInput.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#fbad08] text-black hover:bg-[#e45c10] hover:text-white shadow-[4px_4px_0_#000]'
                    }`}
                  >
                    {addingTag ? '...' : '追加'}
                  </button>
                </div>

                {/* Existing tags */}
                {availableTags.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {availableTags.map(tag => {
                      const isSelected = formData.tags.includes(tag.name);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.name)}
                          className={`pixel-button px-4 py-2 font-bold transition-all border-4 ${
                            isSelected
                              ? '!bg-[#e45c10] !text-white translate-x-[2px] translate-y-[2px] !shadow-none !border-black'
                              : '!bg-white !text-black hover:!bg-gray-100 shadow-[4px_4px_0_#000] !border-black'
                          }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {availableTags.length === 0 && (
                  <p className="text-[#8b4513] text-sm">
                    まだタグがありません。上の入力欄から新しいタグを追加してください。
                  </p>
                )}

                {formData.tags.length > 0 && (
                  <div className="mt-4 text-[#331100] text-sm font-bold">
                    選択中: {formData.tags.join(', ')}
                  </div>
                )}
              </FormField>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border-4 border-red-500 p-4 text-red-700 font-bold">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full pixel-button px-8 py-6 text-white text-2xl font-bold tracking-wider transition-all transform shadow-[6px_6px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0_#000] ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#e45c10] hover:bg-[#c7004c] hover:scale-105 animate-pulse'
                  }`}
                >
                  {submitting ? '投稿中...' : '投稿する！'}
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
                <li>可能ならGitHubでソースコードを公開すること</li>
                <li>技術的な解説があると他の開発者の学びになります</li>
                <li>楽しく、クリエイティブな作品をお待ちしています!</li>
              </ul>
            </div>
          </>
        )}
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
