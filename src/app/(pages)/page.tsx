import Link from 'next/link';
import { Header } from '@/components/Header';

export default function Home() {

  return (
    <div className="font-pixel text-[#331100]">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative overflow-hidden">
        <div className="text-center mb-16 relative z-10">
          <div className="inline-block mb-8 animate-float">
            <div className="w-32 h-32 mx-auto bg-[#e45c10] border-4 border-black flex items-center justify-center shadow-[8px_8px_0_#000]">
              <span className="text-6xl drop-shadow-md pixelated">💡</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-[#8b4513] mb-6 leading-tight drop-shadow-[4px_4px_0_#fff] stroke-black" style={{ textShadow: '4px 4px 0 #fff, 6px 6px 0 #000' }}>
            新しいゲームを<br />発明しよう
          </h2>
          
          <div className="nes-container inline-block max-w-3xl mx-auto transform -rotate-1">
            <p className="text-xl md:text-2xl text-[#331100] leading-relaxed">
              既存のゲームに＋１の工夫を加えた<br />
              独創的なゲームを作って共有するコミュニティ
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
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
        <div className="mt-20 text-center relative z-10">
          <div className="mb-4 text-[#e45c10] font-bold text-xl animate-blink">
             ▶ PRESS START
          </div>
          <Link 
            href="/games"
            className="inline-block pixel-button px-16 py-6 bg-[#8b4513] border-4 border-black text-white text-2xl font-bold tracking-wider transform hover:scale-105 shadow-[6px_6px_0_#000] hover:bg-[#5e300d]"
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
    <div className="nes-container h-full transition-transform hover:-translate-y-2 hover:rotate-1">
      <div className="text-5xl mb-4 text-center pixelated">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-center border-b-4 border-black pb-2 text-[#8b4513]">{title}</h3>
      <p className="leading-relaxed mt-4 text-[#331100]">{description}</p>
    </div>
  );
}
