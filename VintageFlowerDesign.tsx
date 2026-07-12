import React from 'react';
import { ArrowLeft, ShoppingCart, Info, Award, Heart } from 'lucide-react';

export default function VintageFlowerDesign() {
  const flowerCards = [
    { id: 1, name: "«После дождя» (비 온 뒤)", desc: "수국과 보라색 델피늄, 이슬을 머금은 듯 청초한 새벽 무드의 꽃다발", price: "7,200 ₽", img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "«Босиком по траве» (풀밭 위 맨발)", desc: "들국화와 데이지, 은은한 캐모마일 향이 가득한 파스텔톤 가든 부케", price: "5,400 ₽", img: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "«Где прячутся стрекозы» (잠자리의 쉼터)", desc: "들풀과 야생화, 코스모스를 매칭해 자연 그대로의 야생 정원을 닮은 선물", price: "4,800 ₽", img: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=300&q=80" }
  ];

  return (
    <div className="min-h-screen bg-[#2D2A26] py-6 px-4 flex justify-center antialiased">
      {/* 모바일 뷰포트 컨테이너 (빈티지한 양장 종이 질감의 크림색 톤) */}
      <div className="w-full max-w-md bg-[#F2EDE4] rounded-[36px] shadow-2xl overflow-hidden flex flex-col relative text-[#423C36] font-sans">
        
        {/* 상단 내비게이션 바 */}
        <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center text-[#423C36] hover:bg-white transition shadow-2xs">
            <ArrowLeft size={18} />
          </button>
          <span className="font-serif tracking-widest text-xs uppercase font-bold text-[#6B6155]">БУКЕТНАЯ</span>
          <button className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center text-[#423C36] hover:bg-white transition shadow-2xs">
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* 1. 메인 히어로 섹션 (유러피안 가든 아치 대형 이미지) */}
        <div className="relative w-full aspect-[4/3] bg-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1507504038482-7621c4b24ee1?auto=format&fit=crop&w=600&q=80" 
            alt="European garden arch" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-6 left-6 right-6 text-white drop-shadow-md text-center">
            <h1 className="text-xl font-serif tracking-wider leading-snug uppercase">
              ЦВЕТЕМ РАЗ В ГОД,<br/>ЧТОБЫ ОСТАТЬСЯ В СЕРДЦЕ
            </h1>
            <p className="text-[10px] tracking-widest opacity-80 mt-1 italic font-serif">마음속에 깊이 스며들 유러피안 계절 플라워</p>
          </div>
        </div>

        {/* 2. 플라워 철학 섹션 (보태니컬 드로잉 감성 라인 매칭) */}
        <div className="p-8 border-b border-[#E1D9CD] bg-[#FAF7F2] relative overflow-hidden">
          {/* 우측 배경에 라인 일러스트 느낌의 투명 마크 배치 대체 */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 text-[#E6DEC2]/30 border border-dashed border-current rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-1.5 text-[11px] font-serif font-bold tracking-widest text-[#8A7A68] uppercase mb-3">
            <Info size={14} />
            <span>Цветочная философия (플라워 철학)</span>
          </div>
          
          <h2 className="text-lg font-serif font-semibold text-[#2D2A26] mb-3 leading-snug">
            "가장 자연스러운 순간이 가장 아름답습니다."
          </h2>
          <p className="text-xs leading-relaxed text-[#6B6155] font-light">
            아틀리에 부케트나야는 인위적인 포장을 덜어내고, 자연 정원 그대로의 자유로운 선과 흐름을 지향합니다. 계절의 온도를 품고 자란 들꽃과 수입 생화들을 조화롭게 매칭해 한 편의 편지 같은 감동을 선물합니다.
          </p>
        </div>

        {/* 3. 오늘 피어난 꽃 (아치형 창문 모양 상품 카드 3열 배열) */}
        <div className="p-6 bg-[#F2EDE4]">
          <div className="text-center mb-6">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8A7A68]">What's blooming today</span>
            <h3 className="text-base font-serif font-bold text-[#2D2A26] mt-0.5">Что расцвело сегодня (오늘의 추천 부케)</h3>
          </div>

          <div className="space-y-6">
            {flowerCards.map((flower) => (
              <div key={flower.id} className="bg-[#FAF7F2] p-4 rounded-3xl border border-[#E1D9CD] shadow-2xs flex flex-col items-center text-center">
                
                {/* 우아한 고전 아치형 이미지 프레임 */}
                <div className="w-32 aspect-[3/4] rounded-t-full overflow-hidden border-2 border-white shadow-sm mb-4">
                  <img src={flower.img} alt={flower.name} className="w-full h-full object-cover" />
                </div>

                <div className="max-w-[90%]">
                  <h4 className="text-xs font-serif font-bold text-[#2D2A26]">{flower.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed px-2">{flower.desc}</p>
                  <p className="text-xs font-serif font-bold text-[#8A7A68] mt-2.5">{flower.price}</p>
                  
                  <button className="mt-3 w-full bg-[#423C36] hover:bg-[#5C534B] text-[#FAF7F2] text-[10px] font-medium py-2 px-6 rounded-xl transition shadow-2xs uppercase tracking-wider">
                    купить букет (구매하기)
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* 4. 인증 및 가치 섹션 */}
        <div className="mx-6 my-2 p-5 bg-[#FAF7F2] rounded-2xl border border-[#E1D9CD] flex items-start gap-4">
          <div className="p-2.5 bg-[#F2EDE4] rounded-xl text-[#8A7A68] mt-0.5">
            <Award size={20} />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold text-[#2D2A26]">100% 신선도 보장제</h4>
            <p className="text-[11px] text-[#6B6155] leading-relaxed mt-1">
              새벽 시장에서 직접 큐레이션한 꽃들로만 엄선하며, 차량 배송 시 전용 오아시스 케어를 통해 최상의 싱싱함을 유지해 드립니다.
            </p>
          </div>
        </div>

        {/* 5. 하단 소셜 및 문의 링크 푸터 */}
        <div className="p-6 text-center mt-auto bg-[#2D2A26] text-[#F2EDE4] rounded-t-[28px]">
          <div className="flex justify-center text-[#E6DEC2] mb-2"><Heart size={16} /></div>
          <p className="text-[10px] tracking-widest uppercase opacity-70">Atelier Букетная</p>
          <p className="text-xs font-serif italic text-[#E6DEC2] mt-1">"정원을 당신의 품 안으로"</p>
          
          <div className="flex justify-center gap-4 text-[10px] my-4 text-[#C2BAB0]">
            <a href="#instagram" className="hover:text-white transition">Instagram</a>
            <a href="#telegram" className="hover:text-white transition">Telegram</a>
            <a href="#whatsapp" className="hover:text-white transition">WhatsApp</a>
          </div>
          <p className="text-[9px] text-gray-500 font-light">© 2026 БУКЕТНАЯ. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
