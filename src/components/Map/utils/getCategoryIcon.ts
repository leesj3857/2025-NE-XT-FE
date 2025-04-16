export const getCategoryIcon = (
  category?: string,
  categoryGroupCode?: string
): string => {
  if (!category) {
    return categoryGroupCode === 'FD6'
      ? '/Icons/food/fooddefault.webp'
      : categoryGroupCode === 'AT4'
        ? '/Icons/sight/sightdefault.webp'
        : '';
  }

  // 🍽️ FD6: 맛집 전용 아이콘 (레벨 3 > 2 > 1)
  const foodIcons = {
    level3: {
      조개: 'shell.webp',
      냉면: 'noodle.webp',
      떡볶이: 'tteokbokki.webp',
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
      태국: 'thailand.webp',
      튀르키예: 'turkey.webp',
    },
    level2: {
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
      탕: 'tang.webp',
    },
    level1: {
      한식: 'korea.webp',
      일식: 'japan.webp',
      중식: 'china.webp',
      이탈리안: 'italy.webp',
      베트남: 'vietnam.webp',
      멕시칸: 'mexico.webp',
      양식: 'western.webp',
    }
  };

  if (categoryGroupCode === 'FD6') {
    for (const level of ['level3', 'level2', 'level1']) {
      const icons = (foodIcons as any)[level];
      for (const keyword in icons) {
        if (category.includes(keyword)) {
          return `/Icons/food/${icons[keyword]}`;
        }
      }
    }
    return '/Icons/food/fooddefault.webp';
  }

  // 🗺️ AT4: 볼거리 전용 아이콘
  const sightIcons: { [key: string]: string } = {
    산책: 'trail.webp',
    전망대: 'tower.webp',
    놀이공원: 'amusement.webp',
    테마파크: 'amusement.webp',
    호수: 'lake.webp',
    카페: 'cafe.webp',
    온천: 'hot.webp',
    도보: 'trail.webp',
    거리: 'street.webp',
    도자기: 'porcelain.webp',
    도예촌: 'porcelain.webp',
    숲: 'forest.webp',
    산: 'mountain.webp',
    동물원: 'zoo.webp',
    식물원: 'plant.webp',
    계곡: 'landscape.webp',
    천문대: 'heliostat.webp',
    저수지: 'waterstore.webp',
    공원: 'park.webp',
    유원지: 'park.webp',
  };

  if (categoryGroupCode === 'AT4') {
    for (const keyword in sightIcons) {
      if (category.includes(keyword)) {
        return `/Icons/sight/${sightIcons[keyword]}`;
      }
    }
    return '/Icons/sight/defaultsight.webp';
  }

  // 기본값 (예외 케이스)
  return '';
};
