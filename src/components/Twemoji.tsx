'use client';

import { memo, useEffect, useRef } from 'react';
import twemoji from '@twemoji/api';

interface TwemojiProps {
  emoji: string;
  size?: number;
  className?: string;
}

export const Twemoji = memo(function Twemoji({ emoji, size = 24, className = '' }: TwemojiProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      twemoji.parse(ref.current, {
        folder: 'svg',
        ext: '.svg',
      });
    }
  }, [emoji]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      // Twemojiが生成するimgにサイズを適用するためのCSS変数
      // globals.cssでスタイルを定義
      data-twemoji-size={size}
    >
      {emoji}
    </span>
  );
});
