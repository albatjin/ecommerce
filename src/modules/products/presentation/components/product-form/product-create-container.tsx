'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductFormView } from './product-form-view';
import { createProductAction } from '@/modules/products/application/actions/product.actions';
import { CreateProductInputDto } from '@/modules/products/application/dto/product.dto';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function ProductCreateContainer() {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleCancel = () => {
    router.push('/products');
  };

  const handleSubmit = async (data: CreateProductInputDto) => {
    const res = await createProductAction(data);
    if (res.success) {
      setNotification({
        type: 'success',
        message: `'${res.data?.name}' 상품이 성공적으로 등록되었습니다. 목록으로 이동합니다.`,
      });
      setTimeout(() => {
        router.push('/products');
      }, 1200);
    } else {
      setNotification({
        type: 'error',
        message: res.error || '상품 등록 중 오류가 발생했습니다.',
      });
    }
  };

  const handleSaveDraft = async (data: CreateProductInputDto) => {
    const res = await createProductAction({ ...data, status: 'DRAFT' });
    if (res.success) {
      setNotification({
        type: 'success',
        message: '임시 초안이 안전하게 저장되었습니다.',
      });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({
        type: 'error',
        message: res.error || '임시저장 중 오류가 발생했습니다.',
      });
    }
  };

  return (
    <div className="relative">
      {/* Feedback Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      <ProductFormView
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
      />
    </div>
  );
}
