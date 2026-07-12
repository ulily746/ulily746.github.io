import React from 'react';
import { ArrowLeft, Film, Camera, Heart, Sparkles, FolderHeart } from 'lucide-react';

export default function FilmArchiveDesign() {
  return (
    <div className="min-h-screen bg-[#1E251C] py-6 px-4 flex justify-center antialiased">
      {/* 모바일 뷰포트 컨테이너 (빛바랜 양반지/크라프트지 필터 톤) */}
      <div className="w-full max-w-md bg-[#EFECE3] rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative text-[#403B32] font-sans">
        
        {/* 상단 뒤로가기 버튼 */}
        <div className="absolute top-6 left-6 z-10">
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-[#403B32] hover:bg-white transition shadow-sm">
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* 1. 상단 타이틀 */}
        <div className="pt-20 px-8 pb-4 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8C8472] mb-1">@arish_design</p>
          <h1 className="text-xl font-serif tracking-widest text-[#2B2720] uppercase font-semibold">
            ТАПЛИНК НА ТЕМУ ДЕТСТВА
          </h1>
          <p className="text-xs text-[#736B5E] italic mt-1">(유년 시절의 기록)</p>
        </div>

        {/* 2. 첫 번째 아카이브 블록 (CHILDHOOD - 들판 속 아이들) */}
        <div className="mx-6 my-4 p-5 bg-[#FAF9F5] rounded-2xl border border-[#D5D0C1] shadow-sm relative">
          {/* 마스킹 테이프 데코레이션 효과 표현 */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-[#E1DBCA]/60 backdrop-blur-xs border border-dashed border-[#BDB59F]/50 rotate-[-2deg]" />
          
          <div className="flex items-center gap-1.5 text-[11px] font-serif font-bold tracking-wider text-[#636A52] uppercase mb-3">
            <Camera size={14} />
            <span>CHILDHOOD IN THE COUNTRYSIDE</span>
          </div>

          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 mb-4">
            <img 
              src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=80" 
              alt="Childhood memory" 
              className="w-full h-full object-cover grayscale-[15%]"
            />
          </div>

          <p className="text-xs leading-relaxed text-[#5C5549] italic text-center px-2">
            "시골 외할머니 댁 평상에 누워 올려다보던 여름밤의 은하수, 그 속에 새겨진 가장 순수했던 날들의 단편."
          </p>
        </div>

        {/* 3. 중간 텍스트 가이드 선 브릿지 (손글씨 일러스트 느낌 연출) */}
        <div className="px-12 py-2 text-center text-[#8C8472] relative">
          <div className="border-l border-dashed border-[#C4BDB0] h-8 mx-auto w-0" />
          <span className="text-[10px] italic">그때의 바람, 냄새, 그리고 풍경</span>
          <div className="border-l border-dashed border-[#C4BDB0] h-8 mx-auto w-0" />
        </div>

        {/* 4. 두 번째 아카이브 블록 (FILM REEL - 연속된 필름 프레임 효과) */}
        <div className="mx-6 my-4 p-5 bg-[#242320] text-[#EFECE3] rounded-2xl shadow-inner border border-black relative">
          <div className="flex items-center gap-1.5 text-[11px] font-serif tracking-widest text-[#D5CEB6] uppercase mb-4 justify-center">
            <Film size={14} className="animate-pulse" />
            <span>MEMORIES ON FILM</span>
          </div>

          {/* 필름 스트립 재현 */}
          <div className="space-y-3">
            {/* 필름 컷 1 */}
            <div className="border-y-8 border-dashed border-[#121211] bg-black p-2 rounded-md">
              <div className="aspect-[21/9] rounded-sm overflow-hidden grayscale">
                <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80" alt="Film 1" className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-between items-center text-[9px] text-[#8C8472] px-1 mt-1 font-mono">
                <span>KODAK 400</span>
                <span>01A</span>
              </div>
            </div>

            {/* 필름 컷 2 */}
            <div className="border-y-8 border-dashed border-[#121211] bg-black p-2 rounded-md">
              <div className="aspect-[21/9] rounded-sm overflow-hidden sepia-[30%]">
                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80" alt="Film 2" className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-between items-center text-[9px] text-[#8C8472] px-1 mt-1 font-mono">
                <span>FUJI SUPERIA</span>
                <span>02A</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#BDB59F] leading-relaxed text-center mt-4 italic font-light">
            바래진 슬라이드 필름 속에 머물러 있는 나의 소중한 기억들.
          </p>
        </div>

        {/* 5. 감성 폴라로이드 조각 카드 */}
        <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-5 bg-white p-2 rounded-sm shadow-md border border-[#E1DBCA] rotate-[-4deg]">
            <div className="aspect-square bg-gray-200 overflow-hidden mb-2">
              <img src="https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?auto=format&fit=crop&w=200&q=80" alt="polaroid" className="w-full h-full object-cover" />
            </div>
            <p className="text-[9px] text-center text-gray-400 font-mono">1998. SUMMER</p>
          </div>
          
          <div className="col-span-7 pl-2">
            <div className="flex items-center gap-1 text-[#636A52] text-xs font-bold mb-1">
              <Heart size={12} className="fill-[#636A52]" />
              <span>포토에세이집 발행</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#5C5549]">
              유년의 기억을 엮어 만든 소규모 독립 출판 사진집 <span className="font-semibold text-[#2B2720]">"돌아가고 싶은 날들의 기록"</span>을 만나보세요.
            </p>
          </div>
        </div>

        {/* 6. 하단 링크/연결 섹션 */}
        <div className="mt-auto p-6 bg-[#FAF9F5] border-t border-[#D5D0C1] text-center">
          <div className="flex justify-center gap-1 text-[#8C8472] mb-3">
            <Sparkles size={12} />
            <span className="text-[10px] font-serif uppercase tracking-widest">taplink website</span>
            <Sparkles size={12} />
          </div>
          
          <div className="space-y-2 max-w-xs mx-auto">
            <a href="#book" className="flex items-center justify-center gap-2 bg-[#403B32] hover:bg-[#2B2720] text-[#EFECE3] text-xs font-medium py-3 rounded-xl transition shadow-sm">
              <FolderHeart size={14} />
              <span>독립출판 사진집 구매하기</span>
            </a>
            <a href="#inst" className="flex items-center justify-center gap-2 bg-transparent border border-[#403B32] text-[#403B32] text-xs font-medium py-3 rounded-xl hover:bg-[#403B32]/5 transition">
              <span>필름 아카이브 인스타그램</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
