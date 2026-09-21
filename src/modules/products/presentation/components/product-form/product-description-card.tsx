'use client';

import React, { useState } from 'react';
import {
  FileText,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Table,
  Code,
  Sparkles,
  Tag,
  Check,
} from 'lucide-react';

interface ProductDescriptionCardProps {
  description: string;
  onDescriptionChange: (desc: string) => void;
  onAiGenerateDescription: () => void;
  onAiRecommendSeoTags: () => void;
  seoTags: string[];
  onToggleSeoTag: (tag: string) => void;
  isAiGenerating?: boolean;
}

export function ProductDescriptionCard({
  description,
  onDescriptionChange,
  onAiGenerateDescription,
  onAiRecommendSeoTags,
  seoTags,
  onToggleSeoTag,
  isAiGenerating = false,
}: ProductDescriptionCardProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'html'>('editor');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">상품 상세 기술서</h2>
        </div>

        {/* Editor mode tabs */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              activeTab === 'editor' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            에디터 작성
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              activeTab === 'preview' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            모바일 미리보기
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              activeTab === 'html' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            HTML 소스
          </button>
        </div>
      </div>

      {/* Toolbar & AI Assistant Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
        {/* Basic formatting buttons */}
        <div className="flex items-center gap-1 text-slate-600">
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded transition cursor-pointer"
            title="굵게"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded transition cursor-pointer"
            title="기울임"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded transition cursor-pointer"
            title="밑줄"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-slate-300 mx-1" />
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded transition cursor-pointer"
            title="왼쪽 정렬"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded transition cursor-pointer"
            title="가운데 정렬"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded transition cursor-pointer"
            title="오른쪽 정렬"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-slate-300 mx-1" />
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded transition cursor-pointer"
            title="이미지 삽입"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded transition cursor-pointer"
            title="표 삽입"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded transition cursor-pointer"
            title="코드 블록"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AI Helper Section Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAiGenerateDescription}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>AI로 상품 설명 생성</span>
          </button>

          <button
            type="button"
            onClick={onAiRecommendSeoTags}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>SEO 태그 추천</span>
          </button>
        </div>
      </div>

      {/* SEO Tags Container */}
      {seoTags && seoTags.length > 0 && (
        <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-1.5">
          <div className="text-[11px] font-semibold text-indigo-800 flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-indigo-600" />
            <span>추천 SEO 검색 태그 (클릭하여 추가/제거)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {seoTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleSeoTag(tag)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-white text-indigo-700 border border-indigo-200 rounded-full hover:bg-indigo-50 transition cursor-pointer"
              >
                <span>{tag}</span>
                <Check className="w-3 h-3 text-indigo-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      {activeTab === 'editor' && (
        <div className="space-y-1">
          <textarea
            rows={10}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="상세한 제품 스펙, 모델 착용 사이즈 정보 및 세탁 주의사항을 서술해주세요."
            className="w-full p-4 text-xs font-sans rounded-xl border border-slate-200 bg-slate-50/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed text-slate-800"
          />
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 min-h-[240px]">
          <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              스마트폰 화면 미리보기
            </div>
            <div className="text-xs whitespace-pre-wrap leading-relaxed text-slate-700 font-sans">
              {description || '등록된 상세 설명이 없습니다.'}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'html' && (
        <div className="space-y-1">
          <textarea
            rows={10}
            value={`<div>\n  <p>${description.replace(/\n/g, '</p>\n  <p>')}</p>\n</div>`}
            readOnly
            className="w-full p-4 font-mono text-xs rounded-xl border border-slate-200 bg-slate-900 text-slate-100 leading-relaxed select-all"
          />
        </div>
      )}
    </div>
  );
}

