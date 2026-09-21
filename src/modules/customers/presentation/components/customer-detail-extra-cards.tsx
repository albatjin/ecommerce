'use client';

import React, { useState } from 'react';
import {
  MessageSquareText,
  Lock,
  Eye,
  ShoppingCart,
  ExternalLink,
} from 'lucide-react';
import {
  CustomerMemo,
  CustomerRecentProduct,
  CustomerCartItem,
  formatCurrencyWon,
} from '../../domain/entities/customer';

interface CustomerCsMemoCardProps {
  initialMemos?: CustomerMemo[];
}

export function CustomerCsMemoCard({
  initialMemos = [],
}: CustomerCsMemoCardProps) {
  const [memoText, setMemoText] = useState('');
  const [memos, setMemos] = useState<CustomerMemo[]>(
    initialMemos.length > 0
      ? initialMemos
      : [
          {
            id: 'memo-1',
            author: '이수민 매니저(배송CS)',
            content:
              '문 앞 공동현관 비밀번호 재확인 안내 드렸으며, 통화 시 항상 부재중일 경우 문자 안내 선호하심.',
            createdAt: '2025.02.18 10:45',
          },
          {
            id: 'memo-2',
            author: '김운영 관리자',
            content: '연말 VIP 감사 프로모션 20% 추가 쿠폰 수동 지급 완료.',
            createdAt: '2024.12.24 16:30',
          },
        ]
  );

  const handleSaveMemo = () => {
    if (!memoText.trim()) return;
    const newMemo: CustomerMemo = {
      id: `memo-${Date.now()}`,
      author: '김운영(최고관리자)',
      content: memoText.trim(),
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ').replace(/-/g, '.'),
    };
    setMemos([newMemo, ...memos]);
    setMemoText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <MessageSquareText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">관리자 CS 상담 메모</h3>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          <Lock className="w-3 h-3" />
          내부 보안
        </span>
      </div>

      {/* Input area */}
      <div className="space-y-2">
        <textarea
          value={memoText}
          onChange={(e) => setMemoText(e.target.value)}
          placeholder="고객 특별 요청사항이나 특이사항을 기록하세요 (Shift+Enter 줄바꿈)"
          rows={3}
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">작성자: 김운영 (최고관리자)</span>
          <button
            type="button"
            onClick={handleSaveMemo}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
          >
            메모 저장
          </button>
        </div>
      </div>

      {/* Memo List */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100 max-h-56 overflow-y-auto">
        {memos.map((memo) => (
          <div key={memo.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-700">{memo.author}</span>
              <span className="text-[11px] text-slate-400 font-mono">{memo.createdAt}</span>
            </div>
            <p className="text-slate-700 leading-relaxed">{memo.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface CustomerRecentCartCardsProps {
  recentProducts?: CustomerRecentProduct[];
  cartItems?: CustomerCartItem[];
}

export function CustomerRecentCartCards({
  recentProducts = [
    {
      id: 'view-1',
      name: '이탈리안 레더 앵클 첼시 부츠',
      category: 'Footwear',
      price: 245000,
      viewedAt: '조회 2시간 전',
    },
    {
      id: 'view-2',
      name: '소프트 알파카 V넥 루즈 니트',
      category: 'Apparel',
      price: 138000,
      viewedAt: '조회 어제',
    },
  ],
  cartItems = [
    {
      id: 'cart-1',
      name: '클래식 레더 미니 크로스바디 백',
      option: '옵션: 카멜브라운 / One Size',
      price: 189000,
      quantity: 1,
      stockStatus: '재고 여유',
    },
    {
      id: 'cart-2',
      name: '실크 터치 프리미엄 파자마 세트',
      option: '옵션: 아이보리 / M (수량 2)',
      price: 158000,
      quantity: 2,
      stockStatus: '품절임박 (3개 남음)',
    },
  ],
}: CustomerRecentCartCardsProps) {
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. 최근 조회 상품 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">최근 조회 상품</h3>
          </div>
          <span className="text-xs text-slate-400">최근 48시간 기준</span>
        </div>

        <div className="space-y-3">
          {recentProducts.map((prod) => (
            <div
              key={prod.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 font-bold text-xs">
                {prod.category}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-400">{prod.category}</p>
                <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                <p className="text-xs font-bold text-blue-600 mt-0.5">
                  {formatCurrencyWon(prod.price)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">{prod.viewedAt}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300 hover:text-slate-600 inline-block mt-1 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 현재 장바구니 보관함 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">현재 장바구니 보관함</h3>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              총 {cartItems.length}종
            </span>
          </div>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">{item.option}</p>
                  <span className={`inline-block text-[10px] font-semibold ${item.stockStatus.includes('품절') ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {item.stockStatus}
                  </span>
                </div>
                <div className="text-right shrink-0 font-bold text-slate-900">
                  {formatCurrencyWon(item.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Total */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">장바구니 합계 금액</span>
          <span className="text-base font-black text-blue-600">
            {formatCurrencyWon(cartTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

