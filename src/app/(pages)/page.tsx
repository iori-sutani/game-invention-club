import Link from 'next/link';
import { Header } from '@/components/Header';

export default function Home() {

  return (
    <div className="font-pixel text-[#331100]">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-3 py-16 relative overflow-hidden">
        <div className="text-center mb-12 relative z-10">
          <div className="inline-block mb-6 animate-float">
            <div className="w-[104px] h-[104px] mx-auto bg-[#e45c10] border-[3px] border-black flex items-center justify-center shadow-[6px_6px_0_#000]">
              <span className="text-5xl drop-shadow-md pixelated">💡</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-[#8b4513] mb-5 leading-tight drop-shadow-[3px_3px_0_#fff] stroke-black" style={{ textShadow: '3px 3px 0 #fff, 5px 5px 0 #000' }}>
            新しいゲームを<br />発明しよう
          </h2>

          <div className="nes-container inline-block max-w-3xl mx-auto transform -rotate-1">
            <p className="text-lg md:text-xl text-[#331100] leading-relaxed">
              既存のゲームに＋１の工夫を加えた<br />
              独創的なゲームを作って共有するコミュニティ
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
          <FeatureCard
            icon="🎨"
            title="創造性"
            description="あなたの独創的なアイデアを形に。今までにない体験を生み出そう"
          />
          <FeatureCard
            icon="⚙️"
            title="技術共有"
            description="実装の工夫をGitHubとQiitaで共有。学びながら成長"
          />
          <FeatureCard
            icon="🏆"
            title="コミュニティ"
            description="同じ志を持つ開発者とつながり、フィードバックし合おう"
          />
        </div>

        {/* CTA */}
        <div className="mt-16 text-center relative z-10">
          <div className="mb-3 text-[#e45c10] font-bold text-lg animate-blink">
             ▶ PRESS START
          </div>
          <Link
            href="/games"
            className="inline-block pixel-button px-12 py-5 bg-[#8b4513] border-[3px] border-black text-white text-xl font-bold tracking-wider transform hover:scale-105 shadow-[5px_5px_0_#000] hover:bg-[#5e300d]"
          >
            ゲームを見る
          </Link>
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="nes-container h-full transition-transform hover:-translate-y-1.5 hover:rotate-1">
      <div className="text-4xl mb-3 text-center pixelated">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-center border-b-[3px] border-black pb-1.5 text-[#8b4513]">{title}</h3>
      <p className="leading-relaxed mt-3 text-[#331100] text-sm">{description}</p>
    </div>
  );
}
