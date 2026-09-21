'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { AiInsightItem } from '../../domain/entities/sales-metrics';

interface AiInsightsCardProps {
  insights: AiInsightItem[];
}

export function AiInsightsCard({ insights }: AiInsightsCardProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white p-6 sm:p-7 rounded-2xl shadow-md border border-indigo-500/20">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30 shadow-inner">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">AI 인사이트</h3>
            <p className="text-[11px] text-slate-300">최근 판매 패턴 및 이상 징후 자동 분석 리포트</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          AI 심층 분석
        </span>
      </div>

      {/* 3 Insight Sentences in Bullet Points */}
      <ul className="relative z-10 space-y-3">
        {insights.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
          >
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0 shadow-sm shadow-blue-400/50" />
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              {item.content}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

