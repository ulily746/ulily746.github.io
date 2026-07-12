import React from 'react';
import { ArrowLeft, Instagram, Mail, ExternalLink, Image, Compass } from 'lucide-react';

export default function MinimalPortfolioDesign() {
  const galleryItems = [
    { id: 1, title: "Silence", location: "Iceland, 2025", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Warmth", location: "Kyoto, 2025", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Wave", location: "Busan, 2026", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Light & Shadow", location: "Seoul, 2026", img: "https://images.unsplash.com/photo-1513829092359-0a67be157697?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className="min-h-screen bg-[#1E1C1A] py-6 px-4 flex justify-center antialiased">
      {/* 모바일 뷰포트 컨테이너 (정제된 웜 오프화이트 매트 톤) */}
      <div className="w-full max-w-md bg-[#FAF8F5] rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative text-[#2B2927] font-sans">
        
        {/* 상단 뒤로가기 버튼 */}
        <div className="absolute top-6 left-6 z-10">
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-[#1E1C1A]/5 backdrop-blur-sm flex items-center justify-center text-[#2B2927] hover:bg-[#1E1C1A]/10 transition">
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* 1. 상단 타이틀 (클래식 미니멀 타이포그래피) */}
        <div className="pt-20 px-8 pb-4 text-center">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 font-medium mb-1">Visual Archive</p>
          <h1 className="text-2xl font-serif tracking-widest text-[#1E1C1A] font-light uppercase">
            STUDIO OBLIQUE
          </h1>
          <p className="text-[11px] text-gray-500 font-serif italic mt-1">"시선이 머무는 찰나의 순간들"</p>
        </div>

        {/* 2. 간결한 작가 소개 문구 */}
        <div className="px-8 py-4 text-center max-w-xs mx-auto">
          <p className="text-xs leading-relaxed text-gray-600 font-light">
            빛과 그림자, 그리고 그 경계에 존재하는 평온함을 담아냅니다. 인위적인 연출을 배제하고 일상이 주는 자연스러운 서사를 프레임 속에 기록합니다.
          </p>
        </div>

        {/* 3. 2x2 정방형 포트폴리오 갤러리 그리드 */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-4 px-1">
            <Image size={12} />
            <span>Selected Works</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {galleryItems.map((item) => (
              <div key={item.id} className="group bg-white p-2 rounded-xl border border-gray-100 shadow-3xs">
                <div className="w-full aspect-square overflow-hidden rounded-lg bg-gray-50 relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="pt-2 px-1 flex flex-col">
                  <span className="text-[11px] font-medium text-[#1E1C1A] truncate">{item.title}</span>
                  <span className="text-[9px] text-gray-400 font-mono mt-0.5">{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 작업 및 의뢰 안내 브릿지 (모노톤 미니멀 배너) */}
        <div className="mx-6 my-2 p-5 bg-[#2B2927] text-[#FAF8F5] rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FAF8F5]">
              <Compass size={16} />
            </div>
            <div>
              <h4 className="text-xs font-medium tracking-wide">2026 하반기 스냅 촬영 예약</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">개인 화보 및 브랜드 룩북 비주얼 디렉팅</p>
            </div>
          </div>
          <a href="#booking" className="text-gray-400 hover:text-white transition">
            <ExternalLink size={14} />
          </a>
        </div>

        {/* 5. 하단 텍스트 링크 및 SNS 채널 연동 */}
        <div className="mt-auto p-8 bg-[#FAF8F5] border-t border-gray-100 text-center">
          <div className="flex justify-center gap-4 max-w-xs mx-auto mb-6">
            <a href="#instagram" className="flex items-center justify-center gap-1.5 bg-white text-gray-700 text-xs px-4 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition shadow-3xs flex-1">
              <Instagram size={12} />
              <span>Instagram</span>
            </a>
            <a href="#email" className="flex items-center justify-center gap-1.5 bg-[#1E1C1A] text-white text-xs px-4 py-2.5 rounded-full hover:bg-[#33302D] transition shadow-xs flex-1">
              <Mail size={12} />
              <span>Email</span>
            </a>
          </div>
          <p className="text-[9px] text-gray-400 font-light tracking-wide">© 2026 STUDIO OBLIQUE. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
