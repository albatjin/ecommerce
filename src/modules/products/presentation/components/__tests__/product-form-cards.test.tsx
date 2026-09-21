import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProductPricingCard } from '../product-form/product-pricing-card';
import { ProductBasicInfoCard } from '../product-form/product-basic-info-card';
import { ProductSkuOptionsCard } from '../product-form/product-sku-options-card';
import { ProductDescriptionCard } from '../product-form/product-description-card';
import { ProductImageCard } from '../product-form/product-image-card';

describe('Product Form Subcomponents (Unit Tests)', () => {
  it('ProductPricingCard의 가격, 할인율, 세금 유형, 최대 수량 변경이 작동한다', () => {
    const onPrice = vi.fn();
    const onDiscount = vi.fn();
    const onTax = vi.fn();
    const onMaxQty = vi.fn();

    render(
      <ProductPricingCard
        regularPrice={100000}
        discountRate={10}
        taxType="TAXABLE"
        maxOrderQuantity={5}
        onRegularPriceChange={onPrice}
        onDiscountRateChange={onDiscount}
        onTaxTypeChange={onTax}
        onMaxOrderQuantityChange={onMaxQty}
      />
    );

    // 할인금액 90,000 KRW 표시 확인
    expect(screen.getByText('90,000')).toBeInTheDocument();

    // 정상가 변경
    const priceInput = screen.getByLabelText(/정상 판매가/i);
    fireEvent.change(priceInput, { target: { value: '200000' } });
    expect(onPrice).toHaveBeenCalledWith(200000);

    // 할인율 변경
    const discountInput = screen.getByLabelText(/할인 프로모션/i);
    fireEvent.change(discountInput, { target: { value: '20' } });
    expect(onDiscount).toHaveBeenCalledWith(20);

    // 면세 선택
    const exemptRadio = screen.getByLabelText(/면세 상품/i);
    fireEvent.click(exemptRadio);
    expect(onTax).toHaveBeenCalledWith('TAX_EXEMPT');

    // 최대 수량 변경
    const maxQtyInput = screen.getByLabelText(/1인당 1회 최대 주문 한도/i);
    fireEvent.change(maxQtyInput, { target: { value: '10' } });
    expect(onMaxQty).toHaveBeenCalledWith(10);
  });

  it('ProductBasicInfoCard의 모든 입력값 변경 이벤트가 전달된다', () => {
    const onName = vi.fn();
    const onNameEn = vi.fn();
    const onCategory = vi.fn();
    const onSubCategory = vi.fn();
    const onDetailCategory = vi.fn();
    const onSku = vi.fn();
    const onBrand = vi.fn();

    render(
      <ProductBasicInfoCard
        name="상품"
        nameEn="Product"
        category="의류"
        subCategory="남성 아우터"
        detailCategory="미니멀 테일러드 재킷"
        productCode="PRD-1234"
        skuCode="SKU-1"
        brandName="Brand"
        errorMessage="에러메시지"
        onNameChange={onName}
        onNameEnChange={onNameEn}
        onCategoryChange={onCategory}
        onSubCategoryChange={onSubCategory}
        onDetailCategoryChange={onDetailCategory}
        onSkuCodeChange={onSku}
        onBrandNameChange={onBrand}
      />
    );

    expect(screen.getByText('에러메시지')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/중분류/i), { target: { value: '상의' } });
    expect(onSubCategory).toHaveBeenCalledWith('상의');

    fireEvent.change(screen.getByLabelText(/소분류/i), { target: { value: '싱글 코트' } });
    expect(onDetailCategory).toHaveBeenCalledWith('싱글 코트');

    fireEvent.change(screen.getByLabelText(/상품명 \(영문/i), { target: { value: 'New Name' } });
    expect(onNameEn).toHaveBeenCalledWith('New Name');

    fireEvent.change(screen.getByLabelText(/자체 SKU 식별코드/i), { target: { value: 'SKU-99' } });
    expect(onSku).toHaveBeenCalledWith('SKU-99');

    fireEvent.change(screen.getByLabelText(/제조사 \/ 브랜드명/i), { target: { value: 'New Brand' } });
    expect(onBrand).toHaveBeenCalledWith('New Brand');
  });

  it('ProductSkuOptionsCard의 옵션 수정, 삭제 및 다중옵션 토글이 작동한다', () => {
    const onTotalStock = vi.fn();
    render(
      <ProductSkuOptionsCard
        totalStockQuantity={57}
        onTotalStockChange={onTotalStock}
      />
    );

    // 단일 재고 수정
    const totalStockInput = screen.getByLabelText(/재고 수량 \(총 가용재고\)/i);
    fireEvent.change(totalStockInput, { target: { value: '60' } });
    expect(onTotalStock).toHaveBeenCalledWith(60);

    // 개별 옵션 수량 수정
    const numberInputs = screen.getAllByRole('spinbutton');
    const optionStockInput = numberInputs[1]; // 첫 번째 옵션의 재고 입력
    fireEvent.change(optionStockInput, { target: { value: '0' } });
    expect(onTotalStock).toHaveBeenCalled();

    // 옵션 삭제 버튼 클릭
    const deleteButtons = screen.getAllByTitle('옵션 삭제');
    fireEvent.click(deleteButtons[0]);
    expect(onTotalStock).toHaveBeenCalled();

    // 다중 옵션 토글 버튼
    const switchBtn = screen.getByRole('switch');
    fireEvent.click(switchBtn);
    expect(switchBtn.getAttribute('aria-checked')).toBe('false');
  });

  it('ProductDescriptionCard의 탭 전환 및 태그 토글이 작동한다', () => {
    const onDesc = vi.fn();
    const onTagToggle = vi.fn();

    render(
      <ProductDescriptionCard
        description="테스트 상세 설명입니다."
        onDescriptionChange={onDesc}
        onAiGenerateDescription={vi.fn()}
        onAiRecommendSeoTags={vi.fn()}
        seoTags={['#블레이저', '#자켓']}
        onToggleSeoTag={onTagToggle}
      />
    );

    // 미리보기 탭 전환
    const previewTab = screen.getByRole('button', { name: '모바일 미리보기' });
    fireEvent.click(previewTab);
    expect(screen.getByText('스마트폰 화면 미리보기')).toBeInTheDocument();

    // HTML 소스 탭 전환
    const htmlTab = screen.getByRole('button', { name: 'HTML 소스' });
    fireEvent.click(htmlTab);

    // 태그 토글
    const tagChip = screen.getByText('#블레이저');
    fireEvent.click(tagChip);
    expect(onTagToggle).toHaveBeenCalledWith('#블레이저');
  });

  it('ProductImageCard의 드래그 앤 드롭 및 추가 이미지 삭제가 작동한다', () => {
    const onCoverChange = vi.fn();
    const onAdd = vi.fn();
    const onRemove = vi.fn();

    render(
      <ProductImageCard
        coverImageUrl="https://test.com/cover.png"
        additionalImages={['https://test.com/sub1.png']}
        onCoverImageChange={onCoverChange}
        onAddAdditionalImage={onAdd}
        onRemoveAdditionalImage={onRemove}
      />
    );

    // 대표 이미지 삭제
    const coverDeleteBtn = screen.getByLabelText('대표 이미지 삭제');
    fireEvent.click(coverDeleteBtn);
    expect(onCoverChange).toHaveBeenCalledWith(undefined);

    // 상세 추가 이미지 삭제
    const subDeleteBtn = screen.getByLabelText('추가 이미지 1 삭제');
    fireEvent.click(subDeleteBtn);
    expect(onRemove).toHaveBeenCalledWith(0);
  });
});

