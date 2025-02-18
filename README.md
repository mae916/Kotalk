## 카카오톡 클론 프로젝트

> **React + TypeScript + Socket.IO + Express 기반의 실시간 채팅 서비스**

### 🎯 프로젝트 목표

- React와 TypeScript 학습
- 백엔드 구축 및 배포 경험
- Socket.IO를 활용한 실시간 기능 구현

### 📌 주요 기능

- 로그인 & 회원가입
- 친구 찾기 및 추가
- 개인채팅 & 나와의 채팅
- 메시지 읽음 처리
- 메시지 삭제
- 프로필 사진 & 배경 변경

### ✅ 기술적 특징

- **Socket.IO**: 실시간 채팅 구현
- **JWT**: 사용자 인증 및 보안 처리
- **Recoil**: 상태 관리
- **AWS + Docker + Nginx**: 배포 환경 구성

<br/>

**현재 진행 상태:** 기능 추가 + 디버깅 중

<br>

## 🚀 배포 링크

🔗 **[https://katalk.jinproject.xyz/login](https://katalk.jinproject.xyz/login)**

### 테스트 계정

- **아이디1:** `test​@naver.com` / **비밀번호:** `1234`
- **아이디2:** `test2​@naver.com` / **비밀번호:** `1234`

<br>

## 🛠 기술 스택

<div align="center">
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=white">
  <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white">
  <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/aws-ff9900?style=for-the-badge&logo=aws&logoColor=black">
  <img src="https://img.shields.io/badge/docker-1d63ed?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/nginx-009900?style=for-the-badge&logo=nginx&logoColor=white">
  <img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black">
</div>

<br>

## 📖 프로젝트 구조

<details>
<summary><b>📁 디렉토리 구조 보기</b></summary>

```plaintext
📦 kakao-talk
 ┣ 📂 client
 ┃ ┣ 📂 public
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 api (API 요청)
 ┃ ┃ ┣ 📂 assets (이미지, 아이콘)
 ┃ ┃ ┣ 📂 components (UI 컴포넌트)
 ┃ ┃ ┣ 📂 recoil (상태 관리)
 ┃ ┃ ┣ 📂 routes (페이지 라우팅)
 ┃ ┃ ┣ 📂 sockets (소켓 통신)
 ┃ ┃ ┣ 📂 utils (유틸 함수)
 ┃ ┃ ┗ 📜 App.tsx (메인 앱)
 ┣ 📂 server
 ┃ ┣ 📂 config (설정 파일)
 ┃ ┣ 📂 controllers (비즈니스 로직)
 ┃ ┣ 📂 migrations (DB 마이그레이션)
 ┃ ┣ 📂 models (DB 모델)
 ┃ ┣ 📂 routes (API 엔드포인트)
 ┃ ┣ 📂 sockets (소켓 이벤트 핸들러)
 ┃ ┣ 📂 utils (공통 유틸 함수)
 ┃ ┗ 📜 server.js (서버 실행 파일)
 ┗ 📜 README.md
```

</details>

<br>

## 🛠 시작 가이드

### 📌 요구사항

- **Node.js**: `16.20.2`
- **Npm**: `8.19.4`

### 🚀 설치 및 실행

#### **프론트엔드 실행**

```bash
$ cd client
$ npm i
$ npm run start
```

#### **백엔드 실행**

```bash
$ cd server
$ npm i
$ npm run dev
```

<br>

## 📌 데이터베이스 ERD

- **📊 ERD (ERD Cloud):** [🔗 ERD 보기](https://www.erdcloud.com/d/rFyZbfuc4uZFQDGys)
