'use client';

import React, { useState } from 'react';
import { MessageSquarePlus, ShieldAlert, Laptop, Bot } from 'lucide-react';
import { OrderCsMemo } from '../../domain/entities/order';

interface OrderCsMemoCardProps {
  initialMemos?: OrderCsMemo[];
  onAddMemo?: (content: string) => void;
}

export function OrderCsMemoCard({
  initialMemos = [],
  onAddMemo,
}: OrderCsMemoCardProps) {
  const [memos, setMemos] = useState<OrderCsMemo[]>(initialMemos);
  const [inputText, setInputText] = useState('');

  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMemo: OrderCsMemo = {
      id: `memo-${Date.now()}`,
      author: '김운영 (관리자)',
      content: inputText.trim(),
      isSystem: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setMemos([newMemo, ...memos]);
    if (onAddMemo) {
      onAddMemo(inputText.trim());
    }
    setInputText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquarePlus className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">
            관리자 CS 메모 및 처리 이력
          </h3>
        </div>
      </div>

      {/* Memo Input */}
      <form onSubmit={handleAddMemo} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="고객 요청이나 특이사항 메모를 입력하세요 (예: 유선 통화로 배송 전 연락 요청)"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shrink-0"
        >
          메모 등록
        </button>
      </form>

      {/* History Timeline */}
      <div className="space-y-3 pt-2">
        {memos.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            등록된 메모 또는 처리 이력이 없습니다.
          </div>
        ) : (
          memos.map((memo) => {
            const isSys = memo.isSystem || memo.author.includes('시스템');
            return (
              <div
                key={memo.id}
                className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3 text-xs"
              >
                {/* Icon */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isSys ? 'bg-slate-200/80 text-slate-600' : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {isSys ? <Bot className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{memo.author}</span>
                    <span className="text-[11px] font-mono text-slate-400">{memo.createdAt}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">{memo.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

