export interface DetailCategoryOption {
  value: string;
  label: string;
}

export interface SubCategoryOption {
  value: string;
  label: string;
  detailCategories: DetailCategoryOption[];
}

export interface MainCategoryOption {
  value: string;
  label: string;
  subCategories: SubCategoryOption[];
}

export const CATEGORY_HIERARCHY: Record<string, MainCategoryOption> = {
  '의류': {
    value: '의류',
    label: '패션의류/잡화',
    subCategories: [
      {
        value: '남성 아우터',
        label: '남성 아우터',
        detailCategories: [
          { value: '미니멀 테일러드 재킷', label: '미니멀 테일러드 재킷' },
          { value: '싱글 코트', label: '프리미엄 싱글 코트' },
          { value: '캐주얼 점퍼', label: '캐주얼 점퍼/패딩' },
        ],
      },
      {
        value: '여성 아우터',
        label: '여성 아우터',
        detailCategories: [
          { value: '트렌치 코트', label: '오버핏 트렌치 코트' },
          { value: '울 핸드메이드 코트', label: '울 핸드메이드 코트' },
          { value: '숏 패딩', label: '숏 패딩/다운' },
        ],
      },
      {
        value: '상의',
        label: '상의/니트',
        detailCategories: [
          { value: '캐시미어 니트', label: '캐시미어 크루넥 니트' },
          { value: '오버핏 맨투맨', label: '헤비웨이트 맨투맨' },
          { value: '옥스퍼드 셔츠', label: '클래식 옥스퍼드 셔츠' },
        ],
      },
      {
        value: '하의',
        label: '팬츠/슬랙스',
        detailCategories: [
          { value: '와이드 슬랙스', label: '원턱 와이드 슬랙스' },
          { value: '테이퍼드 데님', label: '셀비지 테이퍼드 데님' },
          { value: '치노 팬츠', label: '스트레이트 치노 팬츠' },
        ],
      },
    ],
  },
  '전자제품': {
    value: '전자제품',
    label: '디지털/가전',
    subCategories: [
      {
        value: '컴퓨터/노트북',
        label: '컴퓨터/노트북',
        detailCategories: [
          { value: '울트라 슬림 노트북', label: '울트라 슬림 16인치 노트북' },
          { value: '게이밍 랩탑', label: '고성능 게이밍 랩탑' },
          { value: '데스크톱 본체', label: '커스텀 데스크톱 PC' },
        ],
      },
      {
        value: '모바일/태블릿',
        label: '모바일/태블릿',
        detailCategories: [
          { value: '플래그십 스마트폰', label: '플래그십 스마트폰' },
          { value: '태블릿 PC', label: '12.9인치 태블릿 PC' },
          { value: '스마트워치', label: '스마트워치 & 밴드' },
        ],
      },
      {
        value: '음향가전',
        label: '음향가전',
        detailCategories: [
          { value: '노이즈캔슬링 헤드폰', label: '무선 노이즈캔슬링 헤드폰' },
          { value: '무선 블루투스 이어폰', label: '완전무선 이어폰' },
          { value: '블루투스 스피커', label: '포터블 블루투스 스피커' },
        ],
      },
      {
        value: '주변기기',
        label: '주변기기',
        detailCategories: [
          { value: '기계식 키보드', label: '무접점/기계식 게이밍 키보드' },
          { value: '무선 마우스', label: '무선 인체공학 마우스' },
          { value: '4K 모니터', label: '27인치 4K UHD 모니터' },
        ],
      },
    ],
  },
  '식품': {
    value: '식품',
    label: '식품/신선',
    subCategories: [
      {
        value: '신선식품',
        label: '신선식품',
        detailCategories: [
          { value: '유기농 꿀사과', label: '청송 프리미엄 GAP 꿀사과' },
          { value: '1++ 한우 정육', label: '1++ 등급 한우 안심 스테이크' },
          { value: '친환경 채소', label: '무농약 친환경 샐러드 채소' },
        ],
      },
      {
        value: '가공식품',
        label: '가공식품',
        detailCategories: [
          { value: '간편조리 밀키트', label: '셰프 시그니처 밀키트' },
          { value: '수제 델리/햄', label: '수제 훈제 소시지 & 베이컨' },
          { value: '프리미엄 소스', label: '엑스트라 버진 올리브오일' },
        ],
      },
      {
        value: '건강식품',
        label: '건강식품',
        detailCategories: [
          { value: '홍삼 진액', label: '6년근 고려홍삼 농축액' },
          { value: '종합 비타민', label: '활력 멀티비타민 & 미네랄' },
          { value: '유산균', label: '100억 생유산균 프로바이오틱스' },
        ],
      },
      {
        value: '음료/다과',
        label: '음료/다과',
        detailCategories: [
          { value: '스페셜티 원두', label: '에티오피아 예가체프 스페셜티' },
          { value: '유기농 차', label: '제주 유기농 녹차/홍차' },
          { value: '수제 베이커리', label: '프랑스산 발효버터 구움과자' },
        ],
      },
    ],
  },
  '기타': {
    value: '기타',
    label: '기타/생활',
    subCategories: [
      {
        value: '리빙/인테리어',
        label: '리빙/인테리어',
        detailCategories: [
          { value: '호텔식 침구 세트', label: '60수 순면 호텔식 침구' },
          { value: '감성 무드등', label: '미니멀 LED 감성 무드등' },
          { value: '아로마 디퓨저', label: '천연 에센셜 오일 디퓨저' },
        ],
      },
      {
        value: '주방/생활',
        label: '주방/생활',
        detailCategories: [
          { value: '도자기 식기', label: '모던 핸드메이드 도자기 2인 세트' },
          { value: '밀폐 보관용기', label: '내열유리 밀폐용기 세트' },
          { value: '친환경 주방세제', label: '1종 친환경 주방세제' },
        ],
      },
      {
        value: '뷰티/케어',
        label: '뷰티/케어',
        detailCategories: [
          { value: '수분 스킨케어', label: '히알루론산 수분 크림' },
          { value: '유기농 샴푸', label: '탈모 완화 카페인 샴푸' },
          { value: '바디 케어', label: '퍼퓸 바디워시 & 로션' },
        ],
      },
      {
        value: '반려동물',
        label: '반려동물',
        detailCategories: [
          { value: '반려견 사료', label: '그레인프리 프리미엄 독 사료' },
          { value: '동결건조 간식', label: '100% 연어 동결건조 트릿' },
          { value: '위생/배변용품', label: '초강력 흡수 배변패드' },
        ],
      },
    ],
  },
};

