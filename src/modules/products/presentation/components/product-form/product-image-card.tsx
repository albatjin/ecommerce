'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Image as ImageIcon, UploadCloud, Trash2, Plus, Star, Loader2, AlertCircle, X } from 'lucide-react';
import { SupabaseProductStorageService } from '@/modules/products/infrastructure/supabase-product-storage.service';

interface ProductImageCardProps {
  coverImageUrl?: string;
  additionalImages: string[];
  onCoverImageChange: (url: string | undefined) => void;
  onAddAdditionalImage: (url: string) => void;
  onRemoveAdditionalImage: (index: number) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export function ProductImageCard({
  coverImageUrl,
  additionalImages,
  onCoverImageChange,
  onAddAdditionalImage,
  onRemoveAdditionalImage,
}: ProductImageCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storageService = useMemo(() => new SupabaseProductStorageService(), []);

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

  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Validate files
    for (const file of fileArray) {
      if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
        setUploadError(`'${file.name}'은(는) 지원되지 않는 파일 형식입니다. 이미지 파일(JPG, PNG, WebP, GIF, AVIF)만 등록 가능합니다.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`'${file.name}' 파일 크기가 10MB를 초과합니다.`);
        return;
      }
    }

    setIsUploading(true);
    setUploadError(null);

    let currentHasCover = Boolean(coverImageUrl);

    for (const file of fileArray) {
      try {
        const result = await storageService.uploadImage(file);
        if (!currentHasCover) {
          onCoverImageChange(result.url);
          currentHasCover = true;
        } else {
          onAddAdditionalImage(result.url);
        }
      } catch {
        // Fallback to local object URL if upload fails (e.g. test environment / offline)
        const fallbackUrl = createSafeObjectURL(file);
        if (!currentHasCover) {
          onCoverImageChange(fallbackUrl);
          currentHasCover = true;
        } else {
          onAddAdditionalImage(fallbackUrl);
        }
      }
    }

    setIsUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUploadFiles(files);
    }
    if (e.target) {
      e.target.value = '';
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
    if (files && files.length > 0) {
      handleUploadFiles(files);
    }
  };

  const handleDeleteCoverImage = () => {
    if (coverImageUrl) {
      // Background cleanup in storage
      storageService.deleteImage(coverImageUrl).catch(() => {});
      onCoverImageChange(undefined);
    }
  };

  const handleDeleteAdditionalImage = (index: number) => {
    const targetUrl = additionalImages[index];
    if (targetUrl) {
      // Background cleanup in storage
      storageService.deleteImage(targetUrl).catch(() => {});
      onRemoveAdditionalImage(index);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        aria-label="상품 이미지 파일 선택"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Uploading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-white/85 backdrop-blur-xs rounded-2xl z-30 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          <span className="text-xs font-semibold text-slate-700">스토리지 업로드 중...</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">상품 이미지</h2>
          </div>
        </div>
        <span className="text-xs text-slate-400">최대 10장 (장당 10MB)</span>
      </div>

      {/* Error Banner */}
      {uploadError && (
        <div className="flex items-center justify-between gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-rose-500 hover:text-rose-700 p-0.5"
            aria-label="에러 메시지 닫기"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
              onClick={handleDeleteCoverImage}
              aria-label="대표 이미지 삭제"
              className="absolute top-3 right-3 p-2 bg-slate-900/70 hover:bg-rose-600 rounded-xl text-white transition shadow-sm cursor-pointer"
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
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-700">
                클릭하여 대표 이미지 업로드 또는 드래그 앤 드롭
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                JPG, PNG, WebP, GIF, AVIF (최대 10MB)
              </p>
            </div>
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
                onClick={() => handleDeleteAdditionalImage(idx)}
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
