import React from 'react';
import { ArrowLeft, Heart, Calendar, Bookmark, MessageCircle, Sparkles } from 'lucide-react';

export default function HomeBakingDesign() {
  const diaryLogs = [
    { id: 1, title: "주말의 홈카페: 딸기 생크림 스콘", date: "2026.04.12", likes: "1,240", img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=300&q=80" },
    { id: 2, title: "오븐 속 행복: 노버터 초코칩 쿠키", date: "2026.04.05", likes: "980", img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80" },
  ];

  return (
    <div className="min-h-screen bg-[#D0D7DE] py-6 px-4 flex justify-center antialiased">
      {/* 모바일 뷰포트 컨테이너 (부드러운 파우더 블루 & 밀크 크림 톤) */}
      <div className="w-full max-w-md bg-[#F4F7F9] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative text-[#4E5660] font-sans">
        
        {/* 상단 뒤로가기 버튼 */}
        <div className="absolute top-6 left-6 z-10">
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#4E5660] hover:bg-white transition shadow-2xs">
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* 1. 상단 히어로 배너 (폴라로이드 스크랩북 연출) */}
        <div className="pt-20 px-6 pb-6 text-center bg-[#E5ECEF]">
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8A97A4] block mb-2">My sweet cozy kitchen</span>
          <h1 className="text-xl font-bold tracking-tight text-[#333C46] leading-snug">
            마음까지 달콤해지는<br/>달라의 홈베이킹 기록 일기
          </h1>
          
          {/* 폴라로이드 사진 프레임 */}
          <div className="mt-6 mx-auto w-[75%] bg-white p-3 pb-8 rounded-sm shadow-md border border-[#D0D7DE] rotate-[-2deg]">
            <div className="aspect-square bg-gray-100 overflow-hidden rounded-xs">
              <img 
                src="https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=500&q=80" 
                alt="Baking mood" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 text-left pl-1">
              <p className="text-[10px] font-serif italic text-gray-400">♥ today's baking log</p>
            </div>
          </div>
        </div>

        {/* 2. 프로필 메시지 박스 */}
        <div className="p-6">
          <div className="bg-white p-5 rounded-[24px] border border-[#E0E7EC] shadow-3xs relative">
            <div className="absolute -top-3 left-6 bg-[#A2B5CD] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full">
              ABOUT ME
            </div>
            <p className="text-xs leading-relaxed text-[#5A636E] pt-1">
              안녕하세요, 홈베이커 달라(@dalla_bake)입니다. 복잡한 베이킹 대신, 집에서 쉽게 구할 수 있는 착한 재료들로 오븐 가득 행복을 구워내는 따뜻한 순간들을 기록하고 있어요.
            </p>
          </div>
        </div>

        {/* 3. 최근 레시피 피드 (폴라로이드 리스트형 배치) */}
        <div className="px-6 pb-6 bg-[#F4F7F9]">
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#738496] uppercase mb-4 px-1">
            <Calendar size={14} />
            <span>Recent Recipe Logs</span>
          </div>

          <div className="space-y-6">
            {diaryLogs.map((log) => (
              <div key={log.id} className="bg-white p-4 pb-6 rounded-md shadow-sm border border-[#E0E7EC] relative">
                {/* 상단 스크랩 마스킹 테이프 장식 효과 */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-[#A2B5CD]/20 border border-dashed border-[#A2B5CD]/40 rounded-xs" />
                
                {/* 사진 영역 */}
                <div className="aspect-[4/3] rounded-xs overflow-hidden bg-gray-50 mb-3">
                  <img src={log.img} alt={log.title} className="w-full h-full object-cover" />
                </div>

                {/* 텍스트 정보 영역 */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-[#333C46]">{log.title}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">{log.date}</p>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] text-[#FF9494] bg-[#FFF5F5] py-1 px-2.5 rounded-full border border-[#FFE3E3]">
                    <Heart size={10} className="fill-[#FF9494]" />
                    <span>{log.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 프라이빗 원데이 클래스 신청 브릿지 */}
        <div className="mx-6 my-2 p-5 bg-[#EAF0F4] rounded-[24px] border border-[#D5E1E8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#A2B5CD] shadow-3xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#333C46]">달라의 시크릿 홈카페 클래스</h4>
              <p className="text-[10px] text-[#738496] mt-0.5">매월 선착순 5명 소규모 오프라인 정원</p>
            </div>
          </div>
          <button className="p-2 bg-white rounded-full hover:bg-gray-50 text-[#4E5660] transition shadow-3xs">
            <Bookmark size={14} />
          </button>
        </div>

        {/* 5. 소셜 채널 링크 연동 푸터 */}
        <div className="mt-auto p-6 bg-white border-t border-[#E0E7EC] text-center">
          <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-widest font-semibold">Join my community</p>
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
            <a href="#youtube" className="flex items-center justify-center gap-2 bg-[#E5ECEF] hover:bg-[#D9E3E7] text-[#4E5660] text-xs font-medium py-3 rounded-xl transition border border-[#D5E1E8]">
              <span>유튜브 브이로그</span>
            </a>
            <a href="#instagram" className="flex items-center justify-center gap-2 bg-[#333C46] hover:bg-[#252C33] text-white text-xs font-medium py-3 rounded-xl transition shadow-sm">
              <MessageCircle size={12} />
              <span>클래스 문의하기</span>
            </a>
          </div>
          <p className="text-[9px] text-gray-300 font-light mt-5">© 2026 DALLA BAKE. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
