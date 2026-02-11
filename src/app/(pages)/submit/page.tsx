'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Twemoji } from '@/components/Twemoji';
import { useAuth } from '@/hooks/useAuth';
import type { Tag } from '@/types/database';

export default function SubmitPage() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();
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
    fetchTags();
  }, [fetchTags]);

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
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] animate-bounce">
          <div className="bg-[#fbad08] nes-container !p-0">
            <div className="bg-white px-6 py-3">
              <p className="text-xl text-black font-bold flex items-center gap-1.5">
                <Twemoji emoji="🎉" size={20} /> 投稿成功!
              </p>
            </div>
          </div>
        </div>
      )}

      <Header />

      <div className="container mx-auto px-3 py-10 max-w-4xl min-h-screen">

        {authLoading ? (
          <div className="text-center py-16">
            <div className="mb-3 animate-float"><Twemoji emoji="⏳" size={51} /></div>
            <p className="text-xl text-[#331100]">読み込み中...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-16">
            <div className="mb-6"><Twemoji emoji="🔒" size={51} /></div>
            <p className="text-xl text-[#331100] mb-6">投稿するにはログインが必要です</p>
            <button
              onClick={() => login('/submit')}
              className="pixel-button px-10 py-5 bg-[#333] text-white text-lg hover:bg-yellow-300 shadow-[5px_5px_0_#000] inline-flex items-center gap-2"
            >
              GitHubでログイン
            </button>
          </div>
        ) : (
          <>
            {/* Title */}
            <div className="text-center mb-10">
              <div className="inline-block mb-5">
                <div className="w-20 h-20 bg-white nes-container !p-0 flex items-center justify-center animate-float">
                  <Twemoji emoji="📤" size={38} />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#8b4513] mb-3 drop-shadow-[2px_2px_0_#fff]" style={{ textShadow: '2px 2px 0 #fff, 4px 4px 0 #000' }}>
                ゲームを投稿
              </h2>
              <div className="nes-container inline-block bg-white mt-3">
                <p className="text-lg text-[#331100]">
                  あなたの発明を世界に共有しよう!
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="nes-container bg-[#f8dcb4] mb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Game Title */}
              <FormField label="ゲームタイトル" required>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="例: 顔面ハンマー投げ"
                  className="w-full px-5 py-3 bg-white border-[3px] border-black text-[#331100] text-base focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_3px_3px_0_#ccc]"
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
                  className="w-full px-5 py-3 bg-white border-[3px] border-black text-[#331100] text-base focus:outline-none focus:border-[#8b4513] transition-colors resize-none shadow-[inset_3px_3px_0_#ccc]"
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
                  className="w-full px-5 py-3 bg-white border-[3px] border-black text-[#331100] text-base focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_3px_3px_0_#ccc]"
                  required
                />
                <p className="mt-1.5 text-xs text-[#8b4513] font-bold">
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
                  className="w-full px-5 py-3 bg-white border-[3px] border-black text-[#331100] text-base focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_3px_3px_0_#ccc]"
                />
              </FormField>
              {/* Qiita URL (Optional) */}
              <FormField label="Qiita解説記事（任意）">
                <input
                  type="url"
                  value={formData.qiitaUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, qiitaUrl: e.target.value }))}
                  placeholder="https://qiita.com/username/items/..."
                  className="w-full px-5 py-3 bg-white border-[3px] border-black text-[#331100] text-base focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_3px_3px_0_#ccc]"
                />
              </FormField>

              {/* Screenshot Upload */}
              <FormField label="スクリーンショット" required>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative cursor-pointer border-[3px] border-dashed transition-all ${
                    isDragging
                      ? 'border-[#e45c10] bg-orange-50'
                      : 'border-black bg-white hover:border-[#8b4513]'
                  } ${screenshotPreview ? 'p-1.5' : 'p-6'}`}
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
                      <Image
                        src={screenshotPreview}
                        alt="Preview"
                        width={512}
                        height={288}
                        className="w-full max-h-52 object-contain"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setScreenshotFile(null);
                          setScreenshotPreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white border-[1.5px] border-black font-bold hover:bg-red-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-3"><Twemoji emoji="📷" size={38} /></div>
                      <p className="text-base text-[#331100] font-bold mb-1.5">
                        クリックまたはドラッグ&ドロップ
                      </p>
                      <p className="text-xs text-[#8b4513]">
                        JPEG, PNG, GIF, WebP (最大5MB)
                      </p>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                      <div className="text-xl pixelated animate-pulse">アップロード中...</div>
                    </div>
                  )}
                </div>
              </FormField>

              {/* Tags */}
              <FormField label="技術タグ (複数選択可)">
                {/* Add new tag input */}
                <div className="flex gap-1.5 mb-3">
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
                    className="flex-1 px-3 py-2 bg-white border-[3px] border-black text-[#331100] focus:outline-none focus:border-[#8b4513] transition-colors shadow-[inset_1.5px_1.5px_0_#ccc]"
                    disabled={addingTag}
                  />
                  <button
                    type="button"
                    onClick={addNewTag}
                    disabled={addingTag || !newTagInput.trim()}
                    className={`pixel-button px-5 py-2 font-bold border-[3px] border-black transition-all ${
                      addingTag || !newTagInput.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#fbad08] text-black hover:bg-[#e45c10] hover:text-white shadow-[3px_3px_0_#000]'
                    }`}
                  >
                    {addingTag ? '...' : '追加'}
                  </button>
                </div>

                {/* Existing tags */}
                {availableTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => {
                      const isSelected = formData.tags.includes(tag.name);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.name)}
                          className={`pixel-button px-3 py-1.5 font-bold transition-all border-[3px] ${
                            isSelected
                              ? '!bg-[#e45c10] !text-white translate-x-[1.5px] translate-y-[1.5px] !shadow-none !border-black'
                              : '!bg-white !text-black hover:!bg-gray-100 shadow-[3px_3px_0_#000] !border-black'
                          }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {availableTags.length === 0 && (
                  <p className="text-[#8b4513] text-xs">
                    まだタグがありません。上の入力欄から新しいタグを追加してください。
                  </p>
                )}

                {formData.tags.length > 0 && (
                  <div className="mt-3 text-[#331100] text-xs font-bold">
                    選択中: {formData.tags.join(', ')}
                  </div>
                )}
              </FormField>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border-[3px] border-red-500 p-3 text-red-700 font-bold text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full pixel-button px-6 py-5 text-white text-xl font-bold tracking-wider transition-all transform shadow-[5px_5px_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1.5px_1.5px_0_#000] ${
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
            <div className="mt-10 bg-white nes-container">
              <h3 className="text-xl font-bold text-[#8b4513] mb-2 border-b-[3px] border-black pb-1.5 flex items-center gap-1.5"><Twemoji emoji="📋" size={20} /> 投稿ガイドライン</h3>
              <ul className="space-y-3 text-[#331100] list-disc list-inside text-sm">
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
      <label className="block mb-2">
        <span className="text-lg md:text-xl font-bold text-[#331100] block border-l-6 border-[#e45c10] pl-2">
          {label}
          {required && <span className="text-[#8b4513] ml-1.5 text-xs">(必須)</span>}
        </span>
      </label>
      {children}
    </div>
  );
}
