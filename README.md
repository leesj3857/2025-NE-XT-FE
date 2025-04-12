# 🇰🇷 KOREAT

**KOREAT**는 한국을 방문하는 외국인 여행자들을 위한 맛집 및 볼거리 정보를 제공하는 서비스입니다.  
현지인 리뷰, 메뉴, 가격, 사진까지 한눈에 확인할 수 있도록 구성되었습니다.

---

## 🚀 현재 개발 현황

🔍 **장소 키워드 기반 검색 및 지도 표시 기능까지 구현 완료**
🔍 **현재 지도의 중심을 기준으로 장소 재검색 기능 구현 완료**
📌 **선택된 장소는 네이버 지도를 통해 마커로 시각화**  
📖 **카카오 API를 활용한 장소 검색 및 정보 조회**

---

## 🛠️ 사용 기술 스택

### 📚 Frontend

- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
- ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
- ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge)
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge)

### 💄 스타일링

- ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 📦 번들링

- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)

### 🗺 지도 및 API

- ![Naver Map](https://img.shields.io/badge/Naver%20Map-2DB400?style=for-the-badge&logoColor=white)
- ![Kakao Local API](https://img.shields.io/badge/Kakao%20Local%20API-FFCD00?style=for-the-badge&logo=kakaotalk&logoColor=000000)

---

## ⚙️ 프로젝트 실행 방법

### 1. `.env` 파일 생성

```env
VITE_KAKAO_REST_API_KEY=발급받은_REST_API_KEY
VITE_KAKAO_JS_KEY=발급받은_JAVASCRIPT_API_KEY
VITE_NAVER_CLIENT_ID=발급받은_NAVER_MAP_CLIENT_ID
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

---

## 📷 향후 추가 기능 (예정)
- 볼거리 아이콘 추가
- 메뉴 및 가격 정보, 이미지, 리뷰 표시
- 🔡 다국어 번역 (EN, CN, JP 등)
- 📸 유저 사진 및 후기 업로드
