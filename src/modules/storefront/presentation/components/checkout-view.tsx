'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/cart-context';
import { createOrderAction } from '../../application/actions/order.actions';
import { OrderStepper } from './order-stepper';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  Smartphone,
} from 'lucide-react';

export function CheckoutView() {
  const router = useRouter();
  const { items, removeSelected, toggleSelectAll, isLoaded } = useCart();

  // 장바구니에서 선택된 품목만 체크아웃 대상
  const checkoutItems = items.filter((item) => item.selected);

  // 배송지 상태값
  const [recipientName, setRecipientName] = useState('홍길동');
  const [phone, setPhone] = useState('010-1234-5678');
  const [zipcode, setZipcode] = useState('06236');
  const [address, setAddress] = useState('서울특별시 강남구 테헤란로 152');
  const [detailAddress, setDetailAddress] = useState('14층 강남파이낸스센터');
  const [memo, setMemo] = useState('문 앞에 두고 벨 눌러주세요');

  // 결제 수단 상태값
  const [paymentMethod, setPaymentMethod] = useState<
    'CREDIT_CARD' | 'KAKAO_PAY' | 'TOSS_PAY' | 'NAVER_PAY' | 'VIRTUAL_ACCOUNT' | 'PAYPAL'
  >('CREDIT_CARD');
  const [cardCompany, setCardCompany] = useState('현대카드');
  const [installment, setInstallment] = useState('일시불');

  // 로딩 및 에러 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 로컬 스토리지 초기 복원 대기 (Hydration)
  if (isLoaded === false) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-800">주문서 정보를 준비하고 있습니다...</h2>
        <p className="text-xs text-gray-400 mt-1">잠시만 기다려 주세요.</p>
      </div>
    );
  }

  // 장바구니 선택 상품이 없을 때
  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">주문할 상품이 없습니다</h2>
        <p className="text-sm text-gray-500 mb-6">
          {items.length > 0
            ? '장바구니에 담긴 상품의 체크박스가 해제되어 있습니다. 상품을 선택한 후 주문해 주세요.'
            : '장바구니가 비어 있습니다. 원하는 상품을 담은 후 주문해 주세요.'}
        </p>

        <div className="flex justify-center gap-3">
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => toggleSelectAll(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              전체 상품 선택하고 주문서 작성하기
            </button>
          )}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            장바구니로 돌아가기
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm px-6 py-3 rounded-xl transition-all"
          >
            상품 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  // 금액 계산
  const totalProductAmount = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 0; // 무료 배송 정책
  const finalPaymentAmount = totalProductAmount + shippingFee;

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'CREDIT_CARD':
        return `신용카드 (${cardCompany} / ${installment})`;
      case 'KAKAO_PAY':
        return '카카오페이 (간편결제)';
      case 'TOSS_PAY':
        return '토스페이 (간편결제)';
      case 'NAVER_PAY':
        return '네이버페이 (간편결제)';
      case 'VIRTUAL_ACCOUNT':
        return '무통장 입금 (가상계좌)';
      case 'PAYPAL':
        return 'PayPal (글로벌 간편결제)';
      default:
        return '신용카드';
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!recipientName.trim()) {
      setErrorMessage('수령인 이름을 입력해 주세요.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('연락처를 입력해 주세요.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('배송지 주소를 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const fullAddress = detailAddress.trim() ? `${address} ${detailAddress}` : address;

      const orderInput = {
        shipping: {
          recipientName: recipientName.trim(),
          phone: phone.trim(),
          address: fullAddress,
          zipcode: zipcode.trim(),
          memo: memo.trim(),
        },
        payment: {
          method: paymentMethod,
          methodLabel: getPaymentMethodLabel(),
          installment: paymentMethod === 'CREDIT_CARD' ? installment : undefined,
        },
        items: checkoutItems.map((item) => ({
          productId: item.productId,
          productCode: item.productCode,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          category: item.category,
        })),
      };

      const response = await createOrderAction(orderInput);

      if (response.success && response.data) {
        // 주문 성공 시 주문한 선택 항목 장바구니에서 제거
        removeSelected();

        // 완료 페이지로 이동
        const query = new URLSearchParams({
          orderNumber: response.data.orderNumber,
          orderId: response.data.id,
          paidAmount: response.data.paidAmount.toString(),
          orderSummary: response.data.orderSummary,
          recipientName: response.data.customerName,
          shippingAddress: response.data.shippingAddress,
          paymentMethod: response.data.paymentMethod,
        });

        router.push(`/checkout/success?${query.toString()}`);
      } else {
        setErrorMessage(response.error || '주문 생성에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '예상치 못한 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <OrderStepper currentStep={2} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* 상단 타이틀 */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">주문서 작성</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            배송지 정보와 결제 수단을 확인하고 안전하게 결제를 완료하세요.
          </p>
        </div>

      {/* 에러 메시지 알림 배너 */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div>
            <div className="font-semibold">주문 처리 오류</div>
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* 좌측 폼 영역 (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. 배송지 정보 카드 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-base font-bold text-gray-900">배송지 정보</h2>
                </div>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                  기본 배송지
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    수령인 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                    placeholder="수령인 성명"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    연락처 (휴대폰) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  배송 주소 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="w-28 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700"
                    placeholder="우편번호"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setZipcode('06236');
                      setAddress('서울특별시 강남구 테헤란로 152');
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    주소 검색
                  </button>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                  placeholder="기본 주소"
                />
                <input
                  type="text"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                  placeholder="상세 주소 (동/호수, 층수 등)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  배송 요청사항
                </label>
                <select
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 bg-white"
                >
                  <option value="문 앞에 두고 벨 눌러주세요">문 앞에 두고 벨 눌러주세요</option>
                  <option value="부재 시 경비실에 맡겨주세요">부재 시 경비실에 맡겨주세요</option>
                  <option value="배송 전 미리 연락 바랍니다">배송 전 미리 연락 바랍니다</option>
                  <option value="택배함에 보관해 주세요">택배함에 보관해 주세요</option>
                  <option value="직접 수령하겠습니다">직접 수령하겠습니다</option>
                </select>
              </div>
            </div>

            {/* 2. 결제 수단 선택 카드 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="text-base font-bold text-gray-900">결제 수단</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* 신용/체크카드 */}
                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold ring-1 ring-blue-600'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CREDIT_CARD"
                    checked={paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setPaymentMethod('CREDIT_CARD')}
                    className="sr-only"
                  />
                  <CreditCard className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-xs">신용 / 체크카드</span>
                </label>

                {/* 카카오페이 */}
                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentMethod === 'KAKAO_PAY'
                      ? 'border-yellow-400 bg-yellow-50/50 text-gray-900 font-semibold ring-1 ring-yellow-400'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="KAKAO_PAY"
                    checked={paymentMethod === 'KAKAO_PAY'}
                    onChange={() => setPaymentMethod('KAKAO_PAY')}
                    className="sr-only"
                  />
                  <span className="w-6 h-6 rounded-md bg-[#FEE500] text-gray-900 font-black text-xs flex items-center justify-center mb-2">
                    K
                  </span>
                  <span className="text-xs">카카오페이</span>
                </label>

                {/* 토스페이 */}
                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentMethod === 'TOSS_PAY'
                      ? 'border-blue-500 bg-blue-50/50 text-blue-700 font-semibold ring-1 ring-blue-500'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="TOSS_PAY"
                    checked={paymentMethod === 'TOSS_PAY'}
                    onChange={() => setPaymentMethod('TOSS_PAY')}
                    className="sr-only"
                  />
                  <Smartphone className="w-6 h-6 mb-2 text-blue-500" />
                  <span className="text-xs">토스페이</span>
                </label>

                {/* 네이버페이 */}
                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentMethod === 'NAVER_PAY'
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 font-semibold ring-1 ring-emerald-500'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="NAVER_PAY"
                    checked={paymentMethod === 'NAVER_PAY'}
                    onChange={() => setPaymentMethod('NAVER_PAY')}
                    className="sr-only"
                  />
                  <span className="w-6 h-6 rounded-md bg-[#03C75A] text-white font-black text-xs flex items-center justify-center mb-2">
                    N
                  </span>
                  <span className="text-xs">네이버페이</span>
                </label>

                {/* 가상계좌 무통장입금 */}
                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentMethod === 'VIRTUAL_ACCOUNT'
                      ? 'border-gray-700 bg-gray-50 text-gray-900 font-semibold ring-1 ring-gray-700'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VIRTUAL_ACCOUNT"
                    checked={paymentMethod === 'VIRTUAL_ACCOUNT'}
                    onChange={() => setPaymentMethod('VIRTUAL_ACCOUNT')}
                    className="sr-only"
                  />
                  <Building className="w-6 h-6 mb-2 text-gray-700" />
                  <span className="text-xs">가상계좌 (무통장)</span>
                </label>

                {/* PayPal (글로벌 간편결제) */}
                <label
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentMethod === 'PAYPAL'
                      ? 'border-[#003087] bg-blue-50/60 text-[#003087] font-semibold ring-1 ring-[#003087]'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAYPAL"
                    checked={paymentMethod === 'PAYPAL'}
                    onChange={() => setPaymentMethod('PAYPAL')}
                    className="sr-only"
                  />
                  <div className="w-6 h-6 flex items-center justify-center mb-2 font-black text-base italic tracking-tighter text-[#003087]">
                    <span className="text-[#003087]">P</span>
                    <span className="text-[#0079C1] -ml-0.5">P</span>
                  </div>
                  <span className="text-xs">PayPal</span>
                </label>
              </div>

              {/* 신용카드 선택 시 카드사 및 할부 옵션 상세 */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">카드사 선택</label>
                    <select
                      value={cardCompany}
                      onChange={(e) => setCardCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none"
                    >
                      <option value="현대카드">현대카드</option>
                      <option value="삼성카드">삼성카드</option>
                      <option value="KB국민카드">KB국민카드</option>
                      <option value="신한카드">신한카드</option>
                      <option value="롯데카드">롯데카드</option>
                      <option value="하나카드">하나카드</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">할부 기간</label>
                    <select
                      value={installment}
                      onChange={(e) => setInstallment(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none"
                    >
                      <option value="일시불">일시불</option>
                      <option value="2개월 무이자">2개월 (무이자)</option>
                      <option value="3개월 무이자">3개월 (무이자)</option>
                      <option value="6개월">6개월</option>
                      <option value="12개월">12개월</option>
                    </select>
                  </div>
                </div>
              )}

              {/* PayPal 선택 시 글로벌 결제 안내 박스 */}
              {paymentMethod === 'PAYPAL' && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0079C1]" />
                      PayPal 글로벌 결제 지원
                    </span>
                    <span className="text-blue-700 font-bold">
                      약 ${(finalPaymentAmount / 1350).toFixed(2)} USD (기준환율 1,350원)
                    </span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    PayPal 계정으로 로그인하여 잔액 또는 등록된 해외 신용카드(Visa, MasterCard, Amex)로 안전하게 즉시 결제할 수 있습니다.
                  </p>
                  <div className="pt-2 border-t border-blue-100 flex items-center gap-2 text-[11px] text-blue-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>PayPal 구매자 보호 프로그램(Buyer Protection) 적용</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. 주문 상품 목록 카드 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h2 className="text-base font-bold text-gray-900">
                    주문 상품 ({checkoutItems.length}개 품목)
                  </h2>
                </div>
                <Link href="/cart" className="text-xs text-blue-600 hover:underline">
                  장바구니 수정
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {checkoutItems.map((item) => (
                  <div key={item.productId} className="py-3.5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 font-medium">{item.category || '일반'}</div>
                      <div className="text-sm font-semibold text-gray-900 truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.price.toLocaleString('ko-KR')}원 × {item.quantity}개
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {(item.price * item.quantity).toLocaleString('ko-KR')}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 우측 결제 요약 Sticky 패널 (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">최종 결제 금액</h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>총 상품금액</span>
                  <span>{totalProductAmount.toLocaleString('ko-KR')}원</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span className="font-semibold text-blue-600">무료 배송</span>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-gray-900">총 결제금액</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600">
                      {finalPaymentAmount.toLocaleString('ko-KR')}
                    </span>
                    <span className="text-sm font-bold text-gray-900 ml-1">원</span>
                  </div>
                </div>
              </div>

              {/* 결제하기 제출 버튼 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>결제 승인 처리 중...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'PAYPAL'
                        ? `PayPal로 ${finalPaymentAmount.toLocaleString('ko-KR')}원 ($${(finalPaymentAmount / 1350).toFixed(2)} USD) 결제하기`
                        : `${finalPaymentAmount.toLocaleString('ko-KR')}원 결제하기`}
                    </span>
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
                <div className="flex items-center gap-2 text-gray-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>256-bit SSL 암호화 안전 결제 연동</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>주문 후 24시간 내 빠른 출고 처리</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  );
}

