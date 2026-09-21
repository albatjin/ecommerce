'use client';

import React, { useState, useMemo } from 'react';
import { ProductDto } from '../../application/dto/product.dto';
import { ProductHeader } from './product-header';
import { ProductFilterBar } from './product-filter-bar';
import { ProductTable } from './product-table';
import { ProductPagination } from './product-pagination';
import { ProductModal } from './product-modal';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ProductViewProps {
  initialProducts: ProductDto[];
  totalCount?: number;
}

export function ProductView({ initialProducts }: ProductViewProps) {
  const [products, setProducts] = useState<ProductDto[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const [stockStatus, setStockStatus] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const pageSize = 10;

  // 필터링 적용
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. 검색어 필터
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchCode = product.productCode.toLowerCase().includes(q);
        if (!matchName && !matchCode) return false;
      }

      // 2. 카테고리 필터
      if (category !== '전체' && product.category !== category) {
        return false;
      }

      // 3. 재고 상태 필터
      if (stockStatus !== '전체' && product.stockStatusLabel !== stockStatus) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, category, stockStatus]);

  // 페이지네이션 슬라이스
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const pagedProducts = useMemo(() => {
    const startIndex = (validPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, validPage]);

  const showFeedback = (message: string, type: 'success' | 'info' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  // 체크박스 핸들러
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = pagedProducts.map((p) => p.id);
      const union = Array.from(new Set([...selectedIds, ...pageIds]));
      setSelectedIds(union);
    } else {
      const pageIds = new Set(pagedProducts.map((p) => p.id));
      setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // 개별 삭제
  const handleDelete = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showFeedback(`'${target.name}' 상품이 성공적으로 삭제되었습니다.`);
  };

  // 일괄 삭제
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    showFeedback(`선택한 ${count}개 상품이 일괄 삭제되었습니다.`);
  };

  // 일괄 수정 (예: 일괄 재고 +10개 추가 또는 일괄 상태 변경)
  const handleBulkEdit = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setProducts((prev) =>
      prev.map((p) => {
        if (!selectedIds.includes(p.id)) return p;
        const newStock = p.stockQuantity + 10;
        const newStatus = newStock > p.safetyStock ? 'NORMAL' : 'LOW';
        const newStatusLabel = newStatus === 'NORMAL' ? '정상' : '부족';
        return {
          ...p,
          stockQuantity: newStock,
          stockStatus: newStatus,
          stockStatusLabel: newStatusLabel,
        };
      })
    );
    showFeedback(`선택한 ${count}개 상품의 재고가 일괄 수정(+10개)되었습니다.`, 'info');
  };

  // 상품 추가/수정 저장
  const handleSaveProduct = (productData: Partial<ProductDto>) => {
    if (productData.id) {
      // 수정
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productData.id) return p;
          const regularPrice = productData.regularPrice ?? p.regularPrice;
          const salePrice = productData.salePrice ?? p.salePrice;
          const stockQuantity = productData.stockQuantity ?? p.stockQuantity;
          const safetyStock = productData.safetyStock ?? p.safetyStock;
          let stockStatus: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK' = 'NORMAL';
          let stockStatusLabel = '정상';

          if (stockQuantity === 0) {
            stockStatus = 'OUT_OF_STOCK';
            stockStatusLabel = '품절';
          } else if (stockQuantity <= safetyStock) {
            stockStatus = 'LOW';
            stockStatusLabel = '부족';
          }

          return {
            ...p,
            name: productData.name ?? p.name,
            category: productData.category ?? p.category,
            regularPrice,
            salePrice,
            stockQuantity,
            safetyStock,
            stockStatus,
            stockStatusLabel,
          };
        })
      );
      showFeedback(`상품 '${productData.name}' 정보가 성공적으로 수정되었습니다.`);
    } else {
      // 신규 등록
      const regularPrice = productData.regularPrice ?? 50000;
      const salePrice = productData.salePrice ?? 45000;
      const stockQuantity = productData.stockQuantity ?? 20;
      const safetyStock = productData.safetyStock ?? 10;
      let stockStatus: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK' = 'NORMAL';
      let stockStatusLabel = '정상';

      if (stockQuantity === 0) {
        stockStatus = 'OUT_OF_STOCK';
        stockStatusLabel = '품절';
      } else if (stockQuantity <= safetyStock) {
        stockStatus = 'LOW';
        stockStatusLabel = '부족';
      }

      const newProduct: ProductDto = {
        id: `prod-${Date.now()}`,
        productCode: `PROD-${Math.floor(10000 + Math.random() * 90000)}`,
        name: productData.name || '신규 등록 상품',
        category: productData.category || '전자제품',
        regularPrice,
        salePrice,
        stockQuantity,
        safetyStock,
        status: 'ACTIVE',
        stockStatus,
        stockStatusLabel,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setProducts((prev) => [newProduct, ...prev]);
      showFeedback(`신규 상품 '${newProduct.name}'이 등록되었습니다.`);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('전체');
    setStockStatus('전체');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* 알림 토스트 피드백 */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-2 p-3.5 rounded-xl border text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 헤더 */}
      <ProductHeader
        onAddProduct={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
        totalCount={filteredProducts.length}
      />

      {/* 필터 바 */}
      <ProductFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        category={category}
        onCategoryChange={(c) => {
          setCategory(c);
          setCurrentPage(1);
        }}
        stockStatus={stockStatus}
        onStockStatusChange={(s) => {
          setStockStatus(s);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* 상품 테이블 */}
      <ProductTable
        products={pagedProducts}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onEdit={(p) => {
          setEditingProduct(p);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* 페이지네이션 및 일괄 작업 바 */}
      <ProductPagination
        currentPage={validPage}
        totalPages={totalPages}
        selectedCount={selectedIds.length}
        onPageChange={setCurrentPage}
        onBulkEdit={handleBulkEdit}
        onBulkDelete={handleBulkDelete}
      />

      {/* 등록/수정 모달 */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}

