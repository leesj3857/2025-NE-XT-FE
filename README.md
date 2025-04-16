# 🇰🇷 KOREAT

**KOREAT**는 한국을 방문하는 외국인 여행자들을 위한 맛집 및 볼거리 정보를 제공하는 서비스입니다.  
현지인 리뷰, 메뉴, 가격, 사진까지 한눈에 확인할 수 있도록 구성되었습니다.

---

## 🚀 현재 개발 현황

- 🔍 **장소 키워드 및 지도 좌표 기반 검색 / 표시 기능 구현**
- 📌 **선택된 장소는 네이버 지도를 통해 마커로 시각화**
- 🚗 **차를 이용한 경로 및 시간 계산 기능 구현**
- 🌐 **카테고리 및 주소 영문 변환 기능 구현**

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

- ![Naver Map](https://img.shields.io/badge/Naver%20Map-2DB400?style=for-the-badge&logoColor=white): **지도 시각화**
- ![Kakao Local API](https://img.shields.io/badge/Kakao%20Local%20API-FFCD00?style=for-the-badge&logo=kakaotalk&logoColor=000000): **장소 검색 및 길찾기**
- ![DeepL](https://img.shields.io/badge/DeepL%20API-0E76A8?style=for-the-badge&logo=deepl&logoColor=white): **다국어 번역**
- ![Perplexity](https://img.shields.io/badge/Perplexity%20API-7E3FF2?style=for-the-badge): **웹 정보 검색**

---

## ⚙️ 프로젝트 실행 방법

### 1. `.env` 파일 생성

```env
VITE_KAKAO_JS_KEY=
VITE_KAKAO_REST_API_KEY=
VITE_NAVER_CLIENT_ID=
VITE_NAVER_CLIENT_SECRET=
VITE_ADDRESS_KEY=
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

- 📝 장소 요약 상세보기 기능
- 🔐 로그인 및 장소 저장 기능

---

# 🇺🇸 KOREAT

**KOREAT** is a service that provides food and sightseeing recommendations for foreign travelers visiting Korea.  
It allows users to view local reviews, menus, prices, and photos all in one place.

---

## 🚀 Current Development Status

- 🔍 **Implemented place search and map display using keywords and coordinates**
- 📌 **Visualized selected places using markers on Naver Map**
- 🚗 **Implemented route and travel time calculation by car**
- 🌐 **Converted categories and addresses into English**

---

## 🛠️ Technology Stack

### 📚 Frontend

- React, TypeScript, React Router, Redux, TanStack Query, Axios

### 💄 Styling

- Tailwind CSS

### 📦 Bundling

- Vite

### 🗺 Maps & APIs

- Naver Map: **Map visualization**
- Kakao Local API: **Place search and directions**
- DeepL API: **Multilingual translation**
- Perplexity API: **Web information search**

---

## ⚙️ How to Run the Project

### 1. Create `.env` file

```env
VITE_KAKAO_JS_KEY=
VITE_KAKAO_REST_API_KEY=
VITE_NAVER_CLIENT_ID=
VITE_NAVER_CLIENT_SECRET=
VITE_ADDRESS_KEY=
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

---

## 📷 Upcoming Features

- 📝 Place summary and detail view
- 🔐 Login and place saving