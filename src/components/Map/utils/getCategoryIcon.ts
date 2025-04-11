export const getCategoryIcon = (
  category?: string,
  categoryGroupCode?: string
): string => {
  if (!category) {
    return categoryGroupCode === 'FD6'
      ? '/Icons/fooddefault.webp'
      : '';
  }

  // ✅ 레벨 3 (우선순위 가장 높음)
  const level3Icons: { [key: string]: string } = {
    조개: 'shell.webp',
    냉면: 'noodle.webp',
    떡: 'mochi.webp',
    돈까스: 'tonkatsu.webp',
    국수: 'noodle2.webp',
    닭: 'chicken.webp',
    피자: 'pizza.webp',
    초밥: 'onigiri.webp',
    햄버거: 'hamburger.webp',
    치킨: 'friedchicken.webp',
    보쌈: 'bossam.webp',
    샌드위치: 'sandwich.webp',
  };

  for (const keyword in level3Icons) {
    if (category.includes(keyword)) {
      return `/Icons/${level3Icons[keyword]}`;
    }
  }

  // ✅ 레벨 2 (중간 우선순위)
  const level2Icons: { [key: string]: string } = {
    고기: 'meat.webp',
    육류: 'meat.webp',
    생선: 'fish.webp',
    샤브샤브: 'shabu.webp',
    제과: 'bread.webp',
    베이커리: 'bread.webp',
    뷔페: 'buffet.webp',
    패스트푸드: 'fastfood.webp',
    분식: 'tteokbokki.webp',
    술집: 'beer.webp',
    인도: 'india.webp',
  };

  for (const keyword in level2Icons) {
    if (category.includes(keyword)) {
      return `/Icons/${level2Icons[keyword]}`;
    }
  }

  // ✅ 레벨 1 (낮은 우선순위)
  const level1Icons: { [key: string]: string } = {
    한식: 'korea.webp',
    일식: 'japan.webp',
    중식: 'china.webp',
    이탈리안: 'italy.webp',
    베트남: 'vietnam.webp',
    멕시칸: 'mexico.webp',
    양식: 'western.webp',
  };

  for (const keyword in level1Icons) {
    if (category.includes(keyword)) {
      return `/Icons/${level1Icons[keyword]}`;
    }
  }

  return categoryGroupCode === 'FD6'
    ? '/Icons/fooddefault.webp'
    : '';
};
