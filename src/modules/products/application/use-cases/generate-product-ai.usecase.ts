import {
  ProductAiDescriptionRequestDto,
  ProductAiDescriptionResponseDto,
  ProductAiSeoTagsRequestDto,
  ProductAiSeoTagsResponseDto,
} from '../dto/product.dto';

export class GenerateProductAiUseCase {
  async generateDescription(request: ProductAiDescriptionRequestDto): Promise<ProductAiDescriptionResponseDto> {
    const { productName, category = '일반', features = [] } = request;
    const name = productName.trim() || '프리미엄 신상품';

    const featureText = features.length > 0 
      ? `\n\n[주요 특징 및 포인트]\n${features.map((f) => `• ${f}`).join('\n')}`
      : '';

    let template = '';
    if (category.includes('의류') || category.includes('패션')) {
      template = `[FABRIC & DETAIL]
${name}은(는) 최고급 소재와 세심한 테일러링 기법으로 정교하게 제작되었습니다.
탁월한 착용감과 단정한 실루엣을 자랑하며, 일상과 격식 있는 자리 모두에 완벽하게 어우러집니다.
내구성과 경량성을 모두 갖추어 사계절 내내 편안하게 착용하실 수 있습니다.${featureText}

[스타일링 팁 & 취급 주의사항]
• 베이직 슬랙스나 데님과 함께 매치하면 세련된 룩을 완성할 수 있습니다.
• 원단의 본래 감촉을 오래 유지하기 위해 첫 세탁은 드라이클리닝을 권장합니다.`;
    } else if (category.includes('전자') || category.includes('디지털')) {
      template = `[INNOVATION & PERFORMANCE]
${name}은(는) 혁신적인 기술력과 인체공학적 디자인이 결합된 고성능 스마트 디바이스입니다.
압도적인 성능과 안정적인 배터리 효율로 당신의 일상과 업무 효율을 극대화해 드립니다.${featureText}

[안내 사항]
• KC 안전 인증 완료 제품으로 안심하고 사용하실 수 있습니다.
• 본 제품은 1년간 무상 품질 보증 서비스를 제공합니다.`;
    } else if (category.includes('식품')) {
      template = `[FRESH & NATURE]
산지의 신선함을 그대로 식탁까지 전달하는 ${name}입니다.
엄격한 위생 관리와 철저한 품질 선별 과정을 거쳐 안심하고 드실 수 있습니다.${featureText}

[보관 및 섭취 안내]
• 수령 즉시 냉장 또는 직사광선을 피해 서늘한 곳에 보관해 주세요.`;
    } else {
      template = `[PRODUCT OVERVIEW]
${name}은(는) 사용자의 편의와 품질을 최우선으로 고려하여 기획된 프리미엄 제품입니다.
정교한 마감과 우수한 내구성으로 오랫동안 만족스럽게 사용하실 수 있습니다.${featureText}

[안내 사항]
• 제품 관련 문의는 고객센터 1:1 상담을 통해 신속하게 처리해 드립니다.`;
    }

    return { description: template };
  }

  async recommendSeoTags(request: ProductAiSeoTagsRequestDto): Promise<ProductAiSeoTagsResponseDto> {
    const { productName, category = '전체' } = request;
    const name = productName.toLowerCase();
    const tags = new Set<string>();

    // 기본 카테고리 기반 태그
    if (category.includes('의류') || category.includes('패션')) {
      tags.add('#의류');
      tags.add('#데일리룩');
      tags.add('#스타일링');
    } else if (category.includes('전자')) {
      tags.add('#전자제품');
      tags.add('#스마트기기');
      tags.add('#테크');
    } else if (category.includes('식품')) {
      tags.add('#신선식품');
      tags.add('#프리미엄푸드');
      tags.add('#건강식단');
    } else {
      tags.add('#인기상품');
      tags.add('#추천아이템');
    }

    // 제품명 기반 키워드 추출
    const keywords = [
      { pattern: /울|wool/i, tag: '#울' },
      { pattern: /블레이저|blazer/i, tag: '#블레이저' },
      { pattern: /자켓|jacket/i, tag: '#자켓' },
      { pattern: /코트|coat/i, tag: '#코트' },
      { pattern: /아우터|outer/i, tag: '#아우터' },
      { pattern: /셔츠|shirt/i, tag: '#셔츠' },
      { pattern: /팬츠|바지|pants/i, tag: '#팬츠' },
      { pattern: /노트북|laptop/i, tag: '#노트북' },
      { pattern: /헤드폰|이어폰|audio/i, tag: '#헤드폰' },
      { pattern: /키보드|keyboard/i, tag: '#키보드' },
      { pattern: /모니터|monitor/i, tag: '#모니터' },
      { pattern: /프리미엄|premium/i, tag: '#프리미엄' },
    ];

    for (const item of keywords) {
      if (item.pattern.test(name)) {
        tags.add(item.tag);
      }
    }

    if (tags.size < 3) {
      tags.add('#베스트셀러');
      tags.add('#신상품');
      tags.add('#CommerceHub');
    }

    return { tags: Array.from(tags) };
  }
}

