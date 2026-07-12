import React from 'react';
import { ArrowLeft, MessageSquare, MapPin, Sparkles, HelpCircle } from 'lucide-react';

export default function FloristGardenDesign() {
  const faqList = [
    { q: "원하는 특정 꽃으로 부케 제작이 가능한가요?", a: "네, 가능합니다. 다만 계절 꽃이 아닐 경우 수급을 위해 최소 1주일 전 상담이 필요합니다." },
    { q: "꽃집 위치와 픽업 가능 시간이 어떻게 되나요?", a: "서울 성수동 숲길 근처에 위치해 있으며, 매일 오전 10시부터 오후 8시까지 픽업 가능합니다." },
    { q: "플라워 클래스 정원과 소요 시간이 궁금해요.", a: "정원은 최대 4인 이하의 소규모 밀착 클래스로 진행되며, 회당 약 2시간~2시간 반 정도 소요됩니다." },
    { q: "당일 예약이나 주문도 가능한가요?", a: "매장 내 보유 중인 싱싱한 계절 꽃들로 당일 제작이 가능하니 방문 전 전화 문의 부탁드립니다." },
  ];

  return (
    <div className="min-h-screen bg-[#A9988B] py-6 px-4 flex justify-center antialiased">
      {/* 모바일 뷰포트 컨테이너 (화사한 올리브 베이지 톤) */}
      <div className="w-full max-w-md bg-[#F4F6F0] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative text-[#4A5343] font-sans">
        
        {/* 상단 뒤로가기 버튼 */}
        <div className="absolute top-6 left-6 z-10">
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-[#E5EAD9]/80 backdrop-blur-sm flex items-center justify-center text-[#4A5343] hover:bg-[#E5EAD9] transition shadow-sm">
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* 1. 상단 히어로 (아치형 대형 레이아웃 + 꽃 오브제 느낌) */}
        <div className="relative pt-20 px-6 pb-6 text-center">
          {/* 부드러운 아치 형태의 이미지 프레임 */}
          <div className="w-[85%] mx-auto aspect-[3/4] bg-[#E5EAD9] rounded-t-full overflow-hidden border-4 border-white shadow-md relative">
            <img 
              src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80" 
              alt="Lily Gloges Florist" 
              className="w-full h-full object-cover"
            />
            {/* 장식용 요정 그래픽 느낌의 파스텔톤 오버레이 요소 대체 */}
            <div className="absolute bottom-4 right-4 bg-white/70 backdrop-blur-xs text-[10px] px-2 py-1 rounded-full text-[#E58F8F] font-serif font-bold">
              ✿ spring mood
            </div>
          </div>
          
          <h1 className="text-3xl font-serif text-[#3B4235] tracking-wide mt-6">
            Lily Gloges <span className="text-xs block italic text-[#A66E6E] font-sans tracking-widest mt-1">/ florist</span>
          </h1>
        </div>

        {/* 2. ABOUT ME (곡선형 말풍선 스타일 블록) */}
        <div className="px-6 py-4 space-y-4">
          <div className="bg-white p-5 rounded-[24px] rounded-tl-none border border-[#DEE5D2] shadow-xs">
            <p className="text-[11px] uppercase tracking-widest text-[#A66E6E] font-bold mb-1">About me</p>
            <p className="text-xs leading-relaxed text-[#5C6654]">
              안녕하세요! 플로리스트 릴리입니다. 자연 고유의 선과 색감의 조화를 사랑하며, 오직 당신만을 위한 세상에 하나뿐인 커스텀 부케를 만듭니다.
            </p>
          </div>

          <div className="bg-[#EDF2E7] p-5 rounded-[24px] rounded-tr-none border border-[#DEE5D2]/60 text-right">
            <p className="text-xs leading-relaxed text-[#5C6654] inline-block text-left">
              계절의 변화를 가장 가까이서 느낄 수 있는 성수동 아틀리에에서 매주 프라이빗한 무료 오픈 클래스 및 정규 마스터 클래스를 운영하고 있어요.
            </p>
          </div>
        </div>

        {/* 3. MASTER CLASS (원형 일러스트 매칭 섹션) */}
        <div className="p-6 bg-white border-y border-[#DEE5D2] mt-4">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Sparkles size={16} className="text-[#E58F8F]" />
            <h2 className="font-serif text-base font-semibold tracking-wide text-[#3B4235]">Master Class 수강 대상</h2>
          </div>
          
          <div className="space-y-2 text-center max-w-xs mx-auto">
            <div className="bg-[#F4F6F0] py-2.5 px-4 rounded-full text-xs text-[#5C6654] border border-[#DEE5D2]">
              ❀ 기초부터 나만의 첫 부케를 직접 만들고 싶으신 분
            </div>
            <div className="bg-[#F4F6F0] py-2.5 px-4 rounded-full text-xs text-[#5C6654] border border-[#DEE5D2]">
              ❀ 일상에서 벗어나 새로운 꽃 힐링 취미를 찾으시는 분
            </div>
            <div className="bg-[#F4F6F0] py-2.5 px-4 rounded-full text-xs text-[#5C6654] border border-[#DEE5D2]">
              ❀ 소중한 사람에게 직접 만든 꽃을 선물하고 싶으신 분
            </div>
          </div>
        </div>

        {/* 4. LOCATION (자연스러운 다각형/원형 이미지 프레임) */}
        <div className="p-6 text-center">
          <div className="flex items-center gap-1.5 justify-center mb-4 text-[#A66E6E]">
            <MapPin size={16} />
            <h2 className="font-serif text-base font-semibold tracking-wide text-[#3B4235]">Our Location</h2>
          </div>
          
          {/* 유기적 형태(꽃잎 모양 프레임)를 구현하기 위해 특이한 border-radius 적용 */}
          <div className="w-48 h-48 mx-auto rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] overflow-hidden border-4 border-white shadow-md mb-3">
            <img 
              src="https://images.unsplash.com/photo-1508789454646-bef72439f197?auto=format&fit=crop&w=400&q=80" 
              alt="Shop location" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-[#5C6654]">서울 성수동 숲길 아틀리에 2층</p>
        </div>

        {/* 5. FAQ 아코디언 */}
        <div className="p-6 bg-[#EDF2E7] border-t border-[#DEE5D2]">
          <div className="flex items-center gap-1.5 justify-center mb-4 text-[#4A5343]">
            <HelpCircle size={16} />
            <h2 className="font-serif text-base font-semibold tracking-wide text-[#3B4235]">FAQ</h2>
          </div>
          <div className="space-y-2">
            {faqList.map((faq, idx) => (
              <details key={idx} className="group bg-white rounded-2xl border border-[#DEE5D2] overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-3.5 cursor-pointer text-xs font-medium text-[#4A5343] select-none">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180 text-[#A66E6E]">▼</span>
                </summary>
                <div className="px-4 pb-3.5 pt-1 text-[11px] text-gray-500 leading-relaxed border-t border-gray-50 bg-[#FDFDFD]">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* 6. CONTACTS 메신저 연결 */}
        <div className="p-6 bg-white text-center mt-auto">
          <p className="text-[11px] text-gray-400 mb-4 uppercase tracking-wider font-semibold">Contacts</p>
          <div className="grid grid-cols-3 gap-2">
            <a href="#vconnect" className="bg-[#F4F6F0] hover:bg-[#EDF2E7] text-[#4A5343] text-xs font-medium py-3 px-2 rounded-xl transition border border-[#DEE5D2] block text-center">
              인스타 DM
            </a>
            <a href="#telegram" className="bg-[#F4F6F0] hover:bg-[#EDF2E7] text-[#4A5343] text-xs font-medium py-3 px-2 rounded-xl transition border border-[#DEE5D2] block text-center">
              텔레그램
            </a>
            <a href="#whatsapp" className="bg-[#A66E6E] hover:bg-[#8C5A5A] text-white text-xs font-medium py-3 px-2 rounded-xl transition shadow-xs block text-center">
              카카오톡
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
