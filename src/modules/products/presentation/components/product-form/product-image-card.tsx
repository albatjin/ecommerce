'use client';

import React, { useRef, useState } from 'react';
import { Image as ImageIcon, UploadCloud, Trash2, Plus, Star } from 'lucide-react';

interface ProductImageCardProps {
  coverImageUrl?: string;
  additionalImages: string[];
  onCoverImageChange: (url: string | undefined) => void;
  onAddAdditionalImage: (url: string) => void;
  onRemoveAdditionalImage: (index: number) => void;
}

export function ProductImageCard({
  coverImageUrl,
  additionalImages,
  onCoverImageChange,
  onAddAdditionalImage,
  onRemoveAdditionalImage,
}: ProductImageCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createSafeObjectURL = (file: File): string => {
    try {
      if (typeof window !== 'undefined' && window.URL && typeof window.URL.createObjectURL === 'function') {
        return window.URL.createObjectURL(file);
      }
    } catch {
      // fallback
    }
    return `blob:mock-url-${file.name}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const fakeUrl = createSafeObjectURL(files[0]);
      if (!coverImageUrl) {
        onCoverImageChange(fakeUrl);
      } else {
        onAddAdditionalImage(fakeUrl);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const fakeUrl = createSafeObjectURL(files[0]);
      if (!coverImageUrl) {
        onCoverImageChange(fakeUrl);
      } else {
        onAddAdditionalImage(fakeUrl);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        aria-label="상품 이미지 파일 선택"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <ImageIcon className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">상품 이미지</h2>
        </div>
        <span className="text-xs text-slate-400">최대 10장</span>
      </div>

      {/* Cover / Representative Image */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">
            대표 썸네일 <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-slate-400">권장: 1000 x 1000px</span>
        </div>

        {coverImageUrl ? (
          <div className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-square max-h-[340px] bg-slate-100 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImageUrl}
              alt="대표 상품 이미지"
              className="w-full h-full object-cover"
            />
            {/* Cover Badge */}
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold rounded-lg flex items-center gap-1.5 shadow-sm">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>대표 컷 (Cover)</span>
            </div>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onCoverImageChange(undefined)}
              aria-label="대표 이미지 삭제"
              className="absolute top-3 right-3 p-2 bg-rose-600/90 hover:bg-rose-700 text-white rounded-xl shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 shadow-2xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-800">
              클릭 또는 드래그 앤 드롭으로 이미지 업로드
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              JPG, PNG, WEBP (최대 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Additional Images Section */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">
            상세 추가 컷 ({additionalImages.length}/9장 등록됨)
          </label>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {additionalImages.map((img, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`상세 이미지 ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveAdditionalImage(idx)}
                aria-label={`추가 이미지 ${idx + 1} 삭제`}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          ))}

          {additionalImages.length < 9 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl aspect-square flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-semibold">+ 추가</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
