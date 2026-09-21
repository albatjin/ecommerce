'use client';

import React, { useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import { ProductFormHeader } from './product-form-header';
import { ProductBasicInfoCard } from './product-basic-info-card';
import { ProductPricingCard } from './product-pricing-card';
import { ProductSkuOptionsCard } from './product-sku-options-card';
import { ProductDescriptionCard } from './product-description-card';
import { ProductImageCard } from './product-image-card';
import { ProductShippingCard } from './product-shipping-card';
import { GenerateProductAiUseCase } from '@/modules/products/application/use-cases/generate-product-ai.usecase';
import { CreateProductInputDto } from '@/modules/products/application/dto/product.dto';
import { CATEGORY_HIERARCHY } from '@/modules/products/domain/entities/category-data';
import { productFormSchema } from '@/modules/products/presentation/schemas/product-form.schema';
import { Check, Bookmark, ArrowLeft } from 'lucide-react';

export interface ProductFormViewProps {
  initialValues?: Partial<CreateProductInputDto>;
  onCancel: () => void;
  onSubmit: (data: CreateProductInputDto) => Promise<void> | void;
  onSaveDraft?: (data: CreateProductInputDto) => Promise<void> | void;
}

export function ProductFormView({
  initialValues,
  onCancel,
  onSubmit,
  onSaveDraft,
}: ProductFormViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const aiUseCase = new GenerateProductAiUseCase();

  const form = useForm({
    defaultValues: {
      name: initialValues?.name || '',
      nameEn: initialValues?.nameEn || '',
      category: initialValues?.category || '의류',
      subCategory: '남성 아우터',
      detailCategory: '미니멀 테일러드 재킷',
      productCode: 'PRD-202410-9841',
      skuCode: initialValues?.skuCode || '',
      brandName: initialValues?.brandName || '',
      regularPrice: initialValues?.regularPrice ?? 0,
      discountRate: initialValues?.discountRate ?? 0,
      taxType: (initialValues?.taxType || 'TAXABLE') as 'TAXABLE' | 'TAX_EXEMPT',
      maxOrderQuantity: initialValues?.maxOrderQuantity || 3,
      stockQuantity: initialValues?.stockQuantity ?? 0,
      description: initialValues?.description || '',
      imageUrl: initialValues?.imageUrl,
      additionalImages: initialValues?.additionalImages || [],
      seoTags: initialValues?.seoTags || [],
      status: (initialValues?.status || 'ACTIVE') as 'ACTIVE' | 'OUT_OF_STOCK' | 'HIDDEN' | 'DRAFT',
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = productFormSchema.safeParse(value);
        if (!result.success) {
          const fields: Record<string, string> = {};
          for (const issue of result.error.issues) {
            const field = issue.path[0] as string;
            if (field && !fields[field]) {
              fields[field] = issue.message;
            }
          }
          return { fields };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const discountAmount = Math.round((value.regularPrice * value.discountRate) / 100);
        const salePrice = Math.max(0, value.regularPrice - discountAmount);

        const payload: CreateProductInputDto = {
          name: value.name.trim(),
          nameEn: value.nameEn?.trim(),
          category: value.category,
          regularPrice: value.regularPrice,
          salePrice,
          discountRate: value.discountRate,
          stockQuantity: value.stockQuantity,
          safetyStock: 10,
          status: value.status,
          description: value.description,
          imageUrl: value.imageUrl,
          additionalImages: value.additionalImages,
          skuCode: value.skuCode,
          brandName: value.brandName,
          taxType: value.taxType,
          maxOrderQuantity: value.maxOrderQuantity,
          seoTags: value.seoTags,
        };

        await onSubmit(payload);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const formState = useStore(form.store);
  const values = formState.values;
  const fieldMeta = formState.fieldMeta;

  const nameError = fieldMeta.name?.errors?.[0];
  const categoryError = fieldMeta.category?.errors?.[0];
  const regularPriceError = fieldMeta.regularPrice?.errors?.[0];
  const discountRateError = fieldMeta.discountRate?.errors?.[0];
  const maxOrderQuantityError = fieldMeta.maxOrderQuantity?.errors?.[0];
  const stockQuantityError = fieldMeta.stockQuantity?.errors?.[0];

  const handleNameChange = (val: string) => {
    form.setFieldValue('name', val);
    if (val.trim()) {
      form.setFieldMeta('name', (prev) => ({
        ...prev,
        errors: [],
        errorMap: { ...prev.errorMap, onSubmit: undefined, onChange: undefined },
      }));
    }
  };

  const handleRegularPriceChange = (price: number) => {
    form.setFieldValue('regularPrice', price);
    if (price > 0) {
      form.setFieldMeta('regularPrice', (prev) => ({
        ...prev,
        errors: [],
        errorMap: { ...prev.errorMap, onSubmit: undefined, onChange: undefined },
      }));
    }
  };

  const handleDiscountRateChange = (rate: number) => {
    form.setFieldValue('discountRate', rate);
    if (rate >= 0 && rate <= 99) {
      form.setFieldMeta('discountRate', (prev) => ({
        ...prev,
        errors: [],
        errorMap: { ...prev.errorMap, onSubmit: undefined, onChange: undefined },
      }));
    }
  };

  const handleMaxOrderQuantityChange = (qty: number) => {
    form.setFieldValue('maxOrderQuantity', qty);
    if (qty >= 1) {
      form.setFieldMeta('maxOrderQuantity', (prev) => ({
        ...prev,
        errors: [],
        errorMap: { ...prev.errorMap, onSubmit: undefined, onChange: undefined },
      }));
    }
  };

  const handleStockQuantityChange = (qty: number) => {
    form.setFieldValue('stockQuantity', qty);
    if (qty >= 0) {
      form.setFieldMeta('stockQuantity', (prev) => ({
        ...prev,
        errors: [],
        errorMap: { ...prev.errorMap, onSubmit: undefined, onChange: undefined },
      }));
    }
  };

  const handleCategoryChange = (newCat: string) => {
    form.setFieldValue('category', newCat);
    const mainObj = CATEGORY_HIERARCHY[newCat] || CATEGORY_HIERARCHY['의류'];
    const firstSub = mainObj.subCategories[0];
    const firstDetail = firstSub?.detailCategories[0]?.value || '';
    form.setFieldValue('subCategory', firstSub?.value || '');
    form.setFieldValue('detailCategory', firstDetail);
    if (newCat) {
      form.setFieldMeta('category', (prev) => ({
        ...prev,
        errors: [],
        errorMap: { ...prev.errorMap, onSubmit: undefined, onChange: undefined },
      }));
    }
  };

  const handleSubCategoryChange = (newSub: string) => {
    form.setFieldValue('subCategory', newSub);
    const mainObj = CATEGORY_HIERARCHY[values.category] || CATEGORY_HIERARCHY['의류'];
    const subObj =
      mainObj.subCategories.find((s) => s.value === newSub) || mainObj.subCategories[0];
    const firstDetail = subObj?.detailCategories[0]?.value || '';
    form.setFieldValue('detailCategory', firstDetail);
  };

  const handleAiGenerateDescription = async () => {
    setIsAiGenerating(true);
    try {
      const res = await aiUseCase.generateDescription({
        productName: values.name,
        category: values.category,
        features: ['최고급 원단', '세미 오버핏', '프리미엄 퀄리티'],
      });
      form.setFieldValue('description', res.description);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAiRecommendSeoTags = async () => {
    setIsAiGenerating(true);
    try {
      const res = await aiUseCase.recommendSeoTags({
        productName: values.name,
        category: values.category,
      });
      form.setFieldValue('seoTags', res.tags);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleToggleSeoTag = (tag: string) => {
    const currentTags = values.seoTags || [];
    if (currentTags.includes(tag)) {
      form.setFieldValue(
        'seoTags',
        currentTags.filter((t) => t !== tag)
      );
    } else {
      form.setFieldValue('seoTags', [...currentTags, tag]);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      const currentValues = form.state.values;
      const discountAmount = Math.round((currentValues.regularPrice * currentValues.discountRate) / 100);
      const salePrice = Math.max(0, currentValues.regularPrice - discountAmount);

      const payload: CreateProductInputDto = {
        name: currentValues.name.trim() || '임시 저장 상품',
        nameEn: currentValues.nameEn?.trim(),
        category: currentValues.category,
        regularPrice: currentValues.regularPrice,
        salePrice,
        discountRate: currentValues.discountRate,
        stockQuantity: currentValues.stockQuantity,
        safetyStock: 10,
        status: 'DRAFT',
        description: currentValues.description,
        imageUrl: currentValues.imageUrl,
        additionalImages: currentValues.additionalImages,
        skuCode: currentValues.skuCode,
        brandName: currentValues.brandName,
        taxType: currentValues.taxType,
        maxOrderQuantity: currentValues.maxOrderQuantity,
        seoTags: currentValues.seoTags,
      };

      if (onSaveDraft) {
        await onSaveDraft(payload);
      } else {
        await onSubmit(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Bar */}
      <ProductFormHeader
        onCancel={onCancel}
        onSaveDraft={handleSaveDraft}
        onSubmit={() => form.handleSubmit()}
        isSubmitting={isSubmitting}
      />

      {/* Main Form Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Basic Info, Pricing, SKU Options, Description */}
        <div className="lg:col-span-8 space-y-6">
          <ProductBasicInfoCard
            name={values.name}
            nameEn={values.nameEn || ''}
            category={values.category}
            subCategory={values.subCategory || ''}
            detailCategory={values.detailCategory || ''}
            productCode={values.productCode || 'PRD-202410-9841'}
            skuCode={values.skuCode || ''}
            brandName={values.brandName || ''}
            errorMessage={nameError}
            categoryErrorMessage={categoryError}
            onNameChange={handleNameChange}
            onNameEnChange={(val) => form.setFieldValue('nameEn', val)}
            onCategoryChange={handleCategoryChange}
            onSubCategoryChange={handleSubCategoryChange}
            onDetailCategoryChange={(val) => form.setFieldValue('detailCategory', val)}
            onSkuCodeChange={(val) => form.setFieldValue('skuCode', val)}
            onBrandNameChange={(val) => form.setFieldValue('brandName', val)}
          />

          <ProductPricingCard
            regularPrice={values.regularPrice}
            discountRate={values.discountRate}
            taxType={values.taxType}
            maxOrderQuantity={values.maxOrderQuantity}
            priceErrorMessage={regularPriceError}
            discountRateErrorMessage={discountRateError}
            maxOrderQuantityErrorMessage={maxOrderQuantityError}
            onRegularPriceChange={handleRegularPriceChange}
            onDiscountRateChange={handleDiscountRateChange}
            onTaxTypeChange={(type) => form.setFieldValue('taxType', type)}
            onMaxOrderQuantityChange={handleMaxOrderQuantityChange}
          />

          <ProductSkuOptionsCard
            totalStockQuantity={values.stockQuantity}
            stockErrorMessage={stockQuantityError}
            onTotalStockChange={handleStockQuantityChange}
          />

          <ProductDescriptionCard
            description={values.description || ''}
            onDescriptionChange={(val) => form.setFieldValue('description', val)}
            onAiGenerateDescription={handleAiGenerateDescription}
            onAiRecommendSeoTags={handleAiRecommendSeoTags}
            seoTags={values.seoTags || []}
            onToggleSeoTag={handleToggleSeoTag}
            isAiGenerating={isAiGenerating}
          />
        </div>

        {/* Right Column (4 cols): Images, Logistics, Sync Info */}
        <div className="lg:col-span-4 space-y-6">
          <ProductImageCard
            coverImageUrl={values.imageUrl}
            additionalImages={values.additionalImages || []}
            onCoverImageChange={(url) => form.setFieldValue('imageUrl', url)}
            onAddAdditionalImage={(url) =>
              form.setFieldValue('additionalImages', [...(values.additionalImages || []), url])
            }
            onRemoveAdditionalImage={(idx) =>
              form.setFieldValue(
                'additionalImages',
                (values.additionalImages || []).filter((_, i) => i !== idx)
              )
            }
          />

          <ProductShippingCard />
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-4 z-20">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>등록 취소 및 목록으로 이동</span>
          </button>
          <span className="hidden md:inline-block text-xs text-slate-400">|</span>
          <span className="hidden md:inline-block text-xs text-slate-400">마지막 자동 저장: 방금 전</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span>임시저장 초안 유지</span>
          </button>

          <button
            type="button"
            onClick={() => form.handleSubmit()}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-xl shadow-sm shadow-indigo-600/30 transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? '등록 중...' : '최종 상품 등록 완료'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
