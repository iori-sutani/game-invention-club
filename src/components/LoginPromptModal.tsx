'use client';

import { Twemoji } from '@/components/Twemoji';
import { useAuth } from '@/hooks/useAuth';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** ログイン後にリダイレクトするパス */
  redirectPath?: string;
  /** モーダルのメッセージ（デフォルト: いいねするにはログインが必要です） */
  message?: string;
}

export function LoginPromptModal({
  isOpen,
  onClose,
  redirectPath = '/games',
  message = 'いいねするには\nログインが必要です',
}: LoginPromptModalProps) {
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleLogin = () => {
    login(redirectPath);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="nes-container bg-white !p-0 mx-4 max-w-sm animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#8b4513] px-4 py-2 border-b-[3px] border-black">
          <p className="text-white font-bold text-sm flex items-center gap-2">
            <Twemoji emoji="💡" size={16} /> おしらせ
          </p>
        </div>
        <div className="p-5 text-center">
          <div className="mb-4">
            <Twemoji emoji="🙏" size={32} />
          </div>
          <p className="text-[#331100] font-bold mb-5 text-sm whitespace-pre-line">
            {message}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="pixel-button px-4 py-2 bg-gray-200 text-[#331100] font-bold border-[3px] border-black shadow-[3px_3px_0_#000] hover:bg-gray-300 text-sm"
            >
              キャンセル
            </button>
            <button
              onClick={handleLogin}
              className="pixel-button px-4 py-2 bg-[#333] text-white font-bold border-[3px] border-black shadow-[3px_3px_0_#000] hover:bg-[#8b4513] text-sm"
            >
              ログイン
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
