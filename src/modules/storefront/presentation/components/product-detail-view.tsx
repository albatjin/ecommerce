'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreProductDto } from '../../application/dto/store-product.dto';
import {
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Share2,
} from 'lucide-react';

import { useCart } from '../context/cart-context';

interface ProductDetailViewProps {
  product: StoreProductDto;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  // useCart 안전하게 참조
  let cartContext: ReturnType<typeof useCart> | null = null;
  try {
    cartContext = useCart();
  } catch {
    cartContext = null;
  }

  // 이미지 갤러리 상태
  const allImages = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...(product.additionalImages || []),
  ];
  const [selectedImage, setSelectedImage] = useState<string>(
    allImages[0] || ''
  );

  // 수량 상태
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'shipping'>('desc');

  const isSoldOut = product.isSoldOut;
  const maxAvailable = Math.min(product.stockQuantity, product.maxOrderQuantity);

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    if (newQty > maxAvailable) return;
    setQuantity(newQty);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = () => {
    if (cartContext) {
      const res = cartContext.addItem(product, quantity);
      showToast(res.message);
    } else {
      showToast(`"${product.name}" 상품 ${quantity}개가 장바구니에 담겼습니다!`);
    }
  };

  const handleDirectBuy = () => {
    showToast(`주문/결제 단계로 이동합니다. (총 ${(product.salePrice * quantity).toLocaleString('ko-KR')}원)`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          url: window.location.href,
        });
      } catch {
        // ignore share cancellation
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('상품 링크가 클립보드에 복사되었습니다.');
    }
  };

  const totalPrice = product.salePrice * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm border border-slate-700 animate-slide-up">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <Link
            href="/cart"
            className="ml-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-2.5 py-1 rounded-lg text-xs transition-colors shrink-0"
          >
            장바구니 가기
          </Link>
        </div>
      )}

      {/* 브레드크럼 */}
      <nav className="flex items-center text-xs text-gray-500 mb-6 gap-1.5">
        <Link href="/" className="hover:text-blue-600">
          홈
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href={`/shop?category=${product.category}`} className="hover:text-blue-600">
          {product.category || '기타'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 상품 상단: 이미지 갤러리 + 주문 정보 패널 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
        {/* 좌측: 이미지 갤러리 */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-xs">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                이미지 준비중
              </div>
            )}

            {product.discountRate > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                {product.discountRate}% SALE
              </span>
            )}

            {isSoldOut && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white/90 text-gray-900 font-extrabold text-sm px-4 py-2 rounded-lg">
                  품절된 상품입니다
                </span>
              </div>
            )}
          </div>

          {/* 썸네일 리스트 */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} 썸네일 ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 우측: 상품 정보 및 주문 패널 */}
        <div className="flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-blue-600">{product.brandName || product.category}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">상품코드: {product.productCode}</span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1 text-gray-400 hover:text-gray-700"
                  aria-label="공유하기"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {product.nameEn && (
              <p className="text-xs text-gray-400 -mt-2">{product.nameEn}</p>
            )}

            {/* 가격 섹션 */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-1">
              {product.discountRate > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="line-through">{product.regularPrice.toLocaleString('ko-KR')}원</span>
                  <span className="text-red-600 font-semibold">{product.discountRate}% 할인</span>
                </div>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-gray-900">
                  {product.salePrice.toLocaleString('ko-KR')}
                </span>
                <span className="text-base font-bold text-gray-800">원</span>
              </div>
            </div>

            {/* 배송 및 혜택 배지 */}
            <div className="grid grid-cols-2 gap-3 py-2 text-xs text-gray-600">
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-gray-100">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>무료 배송 (도서산간 제외)</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>정품 보증 및 A/S 지원</span>
              </div>
            </div>

            {/* 재고 상태 알림 */}
            <div>
              {isSoldOut ? (
                <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded-lg font-medium">
                  현재 상품이 품절되었습니다. 재입고 알림을 신청해 보세요.
                </div>
              ) : product.isLowStock ? (
                <div className="bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-lg font-medium">
                  ⚡ 마감 임박: 남은 수량이 <strong>{product.stockQuantity}</strong>개뿐입니다!
                </div>
              ) : (
                <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  주문 시 내일 바로 출고 가능한 상품입니다.
                </div>
              )}
            </div>

            {/* 수량 선택기 */}
            {!isSoldOut && (
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">구매 수량</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= maxAvailable}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 하단 주문 버튼 영역 */}
          <div className="pt-6 border-t border-gray-100 mt-6 space-y-4">
            {!isSoldOut && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">총 결제 금액</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-blue-600">
                    {totalPrice.toLocaleString('ko-KR')}
                  </span>
                  <span className="text-sm font-bold text-gray-800">원</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className="w-full py-3.5 px-4 rounded-xl border-2 border-blue-600 text-blue-600 text-sm font-bold hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                장바구니 담기
              </button>
              <button
                type="button"
                onClick={handleDirectBuy}
                disabled={isSoldOut}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                {isSoldOut ? '품절' : '바로 구매하기'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 탭: 상세설명 / 사양 / 배송정책 */}
      <div className="border-t border-gray-200 pt-10">
        <div className="flex border-b border-gray-200 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'desc'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            상세 정보
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('spec')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'spec'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            기본 사양 & 고시정보
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'shipping'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            배송 / 교환 / 반품 안내
          </button>
        </div>

        {/* 탭 내용 */}
        {activeTab === 'desc' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs prose max-w-none text-gray-700 leading-relaxed text-sm">
            {product.description ? (
              <div className="whitespace-pre-line">{product.description}</div>
            ) : (
              <p className="text-gray-400 italic">등록된 상세 설명이 없습니다.</p>
            )}
          </div>
        )}

        {activeTab === 'spec' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-gray-50/50">
                  <th className="py-3 px-5 font-semibold text-gray-600 w-1/3">상품명</th>
                  <td className="py-3 px-5 text-gray-800">{product.name}</td>
                </tr>
                <tr>
                  <th className="py-3 px-5 font-semibold text-gray-600">브랜드</th>
                  <td className="py-3 px-5 text-gray-800">{product.brandName || '자체제작'}</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <th className="py-3 px-5 font-semibold text-gray-600">카테고리</th>
                  <td className="py-3 px-5 text-gray-800">{product.category}</td>
                </tr>
                <tr>
                  <th className="py-3 px-5 font-semibold text-gray-600">SKU 코드</th>
                  <td className="py-3 px-5 text-gray-800 font-mono">{product.skuCode || product.productCode}</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <th className="py-3 px-5 font-semibold text-gray-600">과세 구분</th>
                  <td className="py-3 px-5 text-gray-800">
                    {product.taxType === 'TAX_EXEMPT' ? '면세' : '과세 상품 (부가세 포함)'}
                  </td>
                </tr>
                <tr>
                  <th className="py-3 px-5 font-semibold text-gray-600">1회 최대 구매수량</th>
                  <td className="py-3 px-5 text-gray-800">{product.maxOrderQuantity}개</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs space-y-6 text-xs text-gray-600 leading-relaxed">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                배송 안내
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>배송 방법: 택배 배송 (CJ대한통운 / 우체국택배)</li>
                <li>배송 비용: 무료 배송 (제주 및 도서산간 지역 추가 운임 3,000원 발생 가능)</li>
                <li>배송 기간: 결제 확인 후 영업일 기준 1~3일 이내 출고</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                교환 및 반품 안내
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>상품 수령 후 7일 이내에 교환/반품 신청이 가능합니다.</li>
                <li>단순 변심으로 인한 교환/반품 시 왕복 택배비 6,000원이 부과됩니다.</li>
                <li>포장이 훼손되어 상품 가치가 상실된 경우에는 교환/반품이 불가할 수 있습니다.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
