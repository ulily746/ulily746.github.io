import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

export default function DessertAtelierDesign() {
  // FAQ 아코디언 상태 관리
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqList = [
    { q: "주문 및 제작 기간은 얼마나 걸리나요?", a: "모든 디저트는 100% 수제작으로 진행되어 최소 3~5일 전 예약이 필요합니다." },
    { q: "배송 및 픽업은 어떻게 진행되나요?", a: "매장 직접 픽업을 권장하며, 서울/경기 지역은 신선 오토바이 퀵(착불)이 가능합니다." },
    { q: "결제 및 환불 규정이 궁금합니다.", a: "작업 개시 2일 전까지는 100% 환불이 가능하나, 전날 및 당일 취소는 불가합니다." },
    { q: "맛 선택 및 디자인 변경이 가능한가요?", a: "기본 시트와 크림 종류는 상담을 통해 커스텀 매칭이 가능합니다." },
  ];

  return (
    <div className="min-h-screen bg-[#2B1B17] py-6 px-4 flex justify-center antialiased">
      {/* 모바일 뷰포트 컨테이너 (Taplink 감성 재현) */}
      <div className="w-full max-w-md bg-[#FAF6F0] rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative text-[#4A3B32]">
        
        {/* 상단 뒤로가기 버튼 */}
        <div className="absolute top-6 left-6 z-10">
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#2B1B17] hover:bg-white transition shadow-sm">
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* 1. 히어로 섹션 (소개 및 메인 이미지) */}
        <div className="relative w-full aspect-[4/5] bg-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80" 
            alt="Chef Christina Popova" 
            className="w-full h-full object-cover"
          />
          {/* 이미지 위 가벼운 그라데이션 타이틀 오버레이 */}
          <div className="absolute top-6 right-6 text-right font-serif text-white drop-shadow-md">
            <p className="text-xs uppercase tracking-widest opacity-80">Desserts on order</p>
          </div>
        </div>

        {/* 2. 프로필 소개 글 */}
        <div className="p-8 text-center border-b border-[#EADCC9]">
          <span className="text-xs tracking-widest text-[#8C7A6B] uppercase font-medium">컨디터</span>
          <h1 className="text-2xl font-serif font-bold text-[#2B1B17] mt-1 mb-4">크리스티나 포포바</h1>
          <p className="text-sm leading-relaxed text-[#6E5D53] whitespace-pre-line font-light">
            "3년 전 깨달았습니다. 케이크는 과거와 현재, 그리고 반죽을 치대는 손과 설레며 파티를 기다리는 마음 사이의 대화라는 것을요."
          </p>
        </div>

        {/* 3. 무드보드 감성 격자 (스토리 블록) */}
        <div className="p-6 bg-[#FDFBF7]">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#EADCC9]/40 p-5 rounded-2xl flex items-center justify-center text-center">
              <p className="text-xs leading-relaxed font-serif text-[#5A4B40]">
                할머니의 낡은 레시피 수첩, 그리고 말 없이 이야기를 전하는 케이크에 대한 꿈에서 모든 것이 시작되었습니다.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img src="https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=300&q=80" alt="baking" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80" alt="cake" className="w-full h-full object-cover" />
            </div>
            <div className="bg-[#EADCC9]/40 p-5 rounded-2xl flex items-center justify-center text-center">
              <p className="text-xs leading-relaxed font-serif text-[#5A4B40]">
                오늘도 저는 전통과 현대의 대화인 프리미엄 디저트를 정성스럽게 구워내고 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 4. 포트폴리오 (나의 작품들 슬라이드/그리드) */}
        <div className="p-6 bg-[#FAF6F0]">
          <h2 className="text-center font-serif text-lg font-semibold tracking-wider text-[#2B1B17] mb-4">Мои работы (나의 작품들)</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl overflow-hidden aspect-[3/4]">
              <img src="https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&w=200&q=80" alt="work1" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[3/4] transform -translate-y-2 shadow-md">
              <img src="https://images.unsplash.com/photo-1464349110296-4d54976ad7b6?auto=format&fit=crop&w=200&q=80" alt="work2" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[3/4]">
              <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=200&q=80" alt="work3" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* 5. 메뉴 및 가격표 (프라이스 리스트) */}
        <div className="p-6 bg-[#FDFBF7] border-t border-[#EADCC9]">
          <h2 className="text-center font-serif text-lg font-semibold tracking-wider text-[#2B1B17] mb-6">Прайс (가격표)</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 상품 카드 1 */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#EADCC9]/50 text-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                <img src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=200&q=80" alt="menu1" className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] text-gray-400">1800 rub / kg</p>
              <p className="text-xs font-medium text-[#2B1B17] mt-0.5">라즈베리 카스카드</p>
            </div>
            {/* 상품 카드 2 */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#EADCC9]/50 text-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                <img src="https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=200&q=80" alt="menu2" className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] text-gray-400">1500 rub / kg</p>
              <p className="text-xs font-medium text-[#2B1B17] mt-0.5">레드 벨벳</p>
            </div>
            {/* 상품 카드 3 */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#EADCC9]/50 text-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                <img src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=200&q=80" alt="menu3" className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] text-gray-400">1500 rub / kg</p>
              <p className="text-xs font-medium text-[#2B1B17] mt-0.5">메도빅 (꿀케이크)</p>
            </div>
            {/* 상품 카드 4 */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#EADCC9]/50 text-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                <img src="https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=200&q=80" alt="menu4" className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] text-gray-400">2000 rub / kg</p>
              <p className="text-xs font-medium text-[#2B1B17] mt-0.5">트로피컬 초콜릿</p>
            </div>
          </div>
        </div>

        {/* 6. 자주 묻는 질문 (FAQ 아코디언) */}
        <div className="p-6 bg-[#FAF6F0] border-t border-[#EADCC9]">
          <h2 className="text-center font-serif text-lg font-semibold tracking-wider text-[#2B1B17] mb-4">Частые вопросы (FAQ)</h2>
          <div className="space-y-2">
            {faqList.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#EADCC9]/60 overflow-hidden transition-all">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-medium text-[#4A3B32] hover:bg-[#FAF6F0]/50"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-3 text-[11px] text-gray-500 leading-relaxed border-t border-gray-50 pt-2 bg-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 7. 하단 고정 CTA 버튼 (문의하기) */}
        <div className="p-6 bg-white border-t border-gray-100 text-center mt-auto">
          <p className="text-[11px] text-gray-400 mb-3 font-light">
            원하는 디자인이나 맛을 못 찾으셨나요?<br/>상담을 통해 완벽한 커스텀 케이크를 맞춰드릴게요.
          </p>
          <a 
            href="https://wa.me/#" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#2B1B17] text-[#FAF6F0] text-sm font-medium py-3.5 px-6 rounded-xl hover:bg-[#4A3B32] transition shadow-md w-full"
          >
            <MessageCircle size={18} />
            <span>디자이너에게 문의하기 (WhatsApp)</span>
          </a>
        </div>

      </div>
    </div>
  );
}
