import {
  IconFish,
  IconMeat,
  IconMushroom,
  IconCarrot,
  IconApple,
  IconPepper,
  IconPlant2,
  IconEgg,
  IconBowl,
} from '@tabler/icons-vue'

// 재료명에 키워드가 포함되면 해당 아이콘을 사용. 위에서부터 먼저 매칭되는 것 채택.
const ICON_RULES = [
  { icon: IconFish,     keywords: ['고등어', '갈치', '멸치', '조기', '삼치', '생선', '오징어', '새우', '바지락', '굴', '전복', '문어', '게'] },
  { icon: IconMeat,     keywords: ['돼지', '소고기', '한우', '닭', '오리', '고기', '삼겹', '갈비'] },
  { icon: IconMushroom, keywords: ['버섯', '표고', '느타리', '팽이', '송이'] },
  { icon: IconCarrot,   keywords: ['당근', '우엉', '무', '연근', '감자', '고구마', '토란'] },
  { icon: IconApple,    keywords: ['홍시', '감', '사과', '배', '포도', '딸기', '귤', '토마토', '과일'] },
  { icon: IconPepper,   keywords: ['고추', '마늘', '생강', '파', '양파'] },
  { icon: IconPlant2,   keywords: ['깻잎', '시금치', '배추', '상추', '나물', '부추', '미나리', '쑥', '청경채', '채소'] },
  { icon: IconEgg,      keywords: ['계란', '달걀', '두부', '콩'] },
]

const DEFAULT_ICON = IconBowl

// 재료명 → Tabler 아이콘 컴포넌트
export function ingIcon(name) {
  if (!name) return DEFAULT_ICON
  const rule = ICON_RULES.find((r) => r.keywords.some((k) => name.includes(k)))
  return rule ? rule.icon : DEFAULT_ICON
}

// 쉼표 구분 문자열 → 재료 배열
export function parseIngredients(str) {
  if (!str) return []
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}