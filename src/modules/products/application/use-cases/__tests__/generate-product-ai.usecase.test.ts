import { describe, it, expect } from 'vitest';
import { GenerateProductAiUseCase } from '../generate-product-ai.usecase';

describe('GenerateProductAiUseCase (Unit Test)', () => {
  const useCase = new GenerateProductAiUseCase();

  it('상품명과 카테고리를 기반으로 매력적인 마케팅 상품 설명을 생성한다', async () => {
    const result = await useCase.generateDescription({
      productName: '울 블렌드 프리미엄 싱글 브레스트 블레이저',
      category: '의류',
      features: ['호주산 메리노 울', '세미 오버핏', '투버튼 싱글'],
    });

    expect(result.description).toBeDefined();
    expect(result.description.length).toBeGreaterThan(20);
    expect(result.description).toContain('울 블렌드 프리미엄 싱글 브레스트 블레이저');
  });

  it('상품명에 맞춰 추천 SEO 검색 태그 목록을 반환한다', async () => {
    const result = await useCase.recommendSeoTags({
      productName: '울 블렌드 프리미엄 싱글 브레스트 블레이저',
      category: '의류',
    });

    expect(result.tags).toBeInstanceOf(Array);
    expect(result.tags.length).toBeGreaterThanOrEqual(3);
    // 추천 태그 중에 제품명 관련 키워드 포함 확인
    const tagString = result.tags.join(' ');
    expect(tagString).toMatch(/블레이저|자켓|아우터|울|의류/);
  });

  it('빈 상품명이 입력되면 기본 설명 및 표준 카테고리 태그를 반환한다', async () => {
    const descResult = await useCase.generateDescription({
      productName: '',
      category: '전자제품',
    });
    expect(descResult.description).toBeTruthy();

    const tagResult = await useCase.recommendSeoTags({
      productName: '',
      category: '전자제품',
    });
    expect(tagResult.tags.length).toBeGreaterThan(0);
  });

  it('식품 카테고리 상품 설명 및 추천 태그를 생성한다', async () => {
    const descResult = await useCase.generateDescription({
      productName: '유기농 청송 사과 5kg',
      category: '식품',
    });
    expect(descResult.description).toContain('산지의 신선함');

    const tagResult = await useCase.recommendSeoTags({
      productName: '유기농 사과',
      category: '식품',
    });
    expect(tagResult.tags).toContain('#신선식품');
  });

  it('기타 카테고리 상품 설명 및 추천 태그를 생성한다', async () => {
    const descResult = await useCase.generateDescription({
      productName: '다목적 수납함',
      category: '생활잡화',
    });
    expect(descResult.description).toContain('PRODUCT OVERVIEW');

    const tagResult = await useCase.recommendSeoTags({
      productName: '수납함',
      category: '생활',
    });
    expect(tagResult.tags).toContain('#인기상품');
  });
});
