import React from 'react';
import { ArrowLeft, ShoppingBag, Mail, Heart, ChevronRight } from 'lucide-react';

export default function CeramicShopDesign() {
  const products = [
    { id: 1, name: "체리 블라썸 머그&소저", price: "19,000원", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "파스텔 도트 시리얼 볼", price: "21,000원", img: "https://images.unsplash.com/photo-1576016770956-debb63d900ef?auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "클라우드 미니 요거트 컵", price: "16,500원", img: "https://images.unsplash.com/photo-1535401991746-da3d9055713e?auto=format&fit=crop&w=300&q=80" }
  ];

  return (
    <div className="min-h-screen bg-[#F0E6DF] py-6 px-4 flex justify-center antialiased">
      {/* 모바일 뷰포트 컨테이너 (연한 딸기우유 핑크 매트 톤) */}
      <div className="w-full max-w-md bg-[#FFF5F5] rounded-[36px] shadow-2xl overflow-hidden flex flex-col relative text-[#5E4E4A] font-sans">
        
        {/* 상단 내비게이션 바 */}
        <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
          <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5E4E4A] hover:scale-105 transition shadow-xs">
            <ArrowLeft size={18} />
          </button>
          <span className="font-serif font-black tracking-wider text-sm text-[#FF9494]">p✿syy</span>
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5E4E4A] hover:scale-105 transition shadow-xs">
            <ShoppingBag size={18} />
          </button>
        </div>

        {/* 1. 상단 물결무늬(Wavy) 히어로 배너 */}
        <div className="pt-24 relative bg-[#FFE3E3] pb-10">
          <div className="px-8 text-center relative z-10">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#423633] leading-snug">
              Создавай свой уют<br/>함께 만드는 우리 집 온기
            </h1>
            <p className="text-[11px] text-[#8A716C] mt-2">따뜻한 색감의 핸드메이드 도자기 편집숍</p>
            
            <button className="mt-5 bg-white text-[#FF9494] text-xs font-bold px-5 py-2.5 rounded-full shadow-xs hover:bg-[#FFF5F5] transition">
              카탈로그 보러가기
            </button>
          </div>
          
          {/* CSS 구불구불 물결 모양 데코레이션 하단 마감 재현 */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 120\" preserveAspectRatio=\"none\"><path d=\"M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,42.4V0Z\" fill=\"%23FFF5F5\"/></svg>')] bg-cover rotate-180"></div>
        </div>

        {/* 2. 베스트셀러 / 기획전 세션 (아치형 상품 카드 그리드) */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-serif text-sm font-bold tracking-wider text-[#423633] uppercase flex items-center gap-1">
              <span>✦</span> Распродажа / Best Items
            </h2>
            <span className="text-[10px] text-gray-400 flex items-center">더보기 <ChevronRight size={10} /></span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {products.map((item) => (
              <div key={item.id} className="bg-white p-2 rounded-[20px] shadow-2xs border border-[#F5E6E6] text-center flex flex-col justify-between">
                {/* 둥근 아치형 이미지 탑재 */}
                <div className="w-full aspect-[4/5] rounded-t-[16px] rounded-b-[8px] overflow-hidden bg-[#FDF8F8] relative">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <button className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-[#FF9494] shadow-xs">
                    <Heart size={10} className="fill-[#FF9494]" />
                  </button>
                </div>
                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold text-[#423633] truncate px-0.5">{item.name}</p>
                  <p className="text-[9px] text-[#FF9494] font-semibold mt-0.5">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 브랜드 무드 비주얼 섹션 (연그린 컬러 블록 스위칭) */}
        <div className="mx-6 my-2 p-5 bg-[#E6F0E6] rounded-[28px] border border-[#D5E5D5] flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white flex-shrink-0 shadow-sm">
            <img src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80" alt="pottery brand" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[9px] bg-white text-[#729272] font-bold px-2 py-0.5 rounded-full border border-[#C5DCC5]">BRAND STORY</span>
            <p className="text-xs font-semibold text-[#384A38] mt-1.5 leading-snug">
              흙과 불, 그리고 기다림이 만나 일상에 작은 특별함을 더합니다.
            </p>
          </div>
        </div>

        {/* 4. 뉴스레터 구독 섹션 (키치한 파형 하단 마감) */}
        <div className="mt-4 p-6 bg-[#FFEEDD] border-y border-[#F7D8BF] relative">
          <div className="text-center max-w-xs mx-auto">
            <div className="flex justify-center text-[#DCA070] mb-1"><Mail size={16} /></div>
            <h3 className="text-xs font-bold text-[#574436]">Получайте эксклюзивные новости</h3>
            <p className="text-[10px] text-[#8F7564] mt-0.5 mb-4">단독 신상품 할인 소식과 숍 콘텐츠 구독하기</p>
            
            <div className="flex gap-1.5 bg-white p-1 rounded-full border border-[#F2CCB1] shadow-2xs">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="bg-transparent pl-3 flex-1 text-xs outline-none text-[#574436] placeholder-gray-300"
              />
              <button className="bg-[#FF9494] text-white text-[10px] font-bold px-4 py-2 rounded-full hover:bg-[#FF7A7A] transition">
                구독하기
              </button>
            </div>
          </div>
        </div>

        {/* 5. 푸터 소셜 피드 */}
        <div className="p-6 bg-[#FFF5F5] text-center mt-auto border-t border-[#F5E6E6]">
          <p className="font-serif font-black text-lg tracking-widest text-[#FF9494]">p✿syy</p>
          <div className="flex justify-center gap-6 text-[10px] text-[#8A716C] my-3">
            <a href="#catalog" className="hover:underline">Catalog</a>
            <a href="#contacts" className="hover:underline">Contacts</a>
            <a href="#faq" className="hover:underline">FAQ</a>
          </div>
          <p className="text-[9px] text-gray-400 font-light">© 2026 POSYY CERAMIC. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
