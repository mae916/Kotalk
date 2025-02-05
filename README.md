# 카카오톡 구현하기

- react와 ts 학습과 백엔드를 직접 구축 해보고 싶은 마음과 socket.io에 대한 흥미로 이 프로젝트를 시작하게 되었습니다.
- 로그인, 회원가입, 친구추가, 채팅, 메시지 삭제, 프로필 사진 및 배경 바꾸기 등이 가능합니다.
- 시작부터 배포까지 모두 혼자 진행한 프로젝트이고, 현재 기능 추가 + 디버깅 중에 있습니다. 

## 배포 주소
- 아래 주소에서 회원가입 or 아래 테스트 아이디로 사용해 볼 수 있습니다.
- 테스트 아이디1: test@naver.com 비밀번호:1234 / 테스트 아이디2: test2@naver.com 비밀번호:1234
- https://katalk.jinproject.xyz/login

## 시작 가이드

### 요구사항

- Node.js 16.20.2
- Npm 8.19.4

### 설치 및 실행

- 프론트엔드

  ```
  $cd client
  $npm i
  $npm run start
  ```

- 백엔드

  ```
  $cd server
  $npm i
  $npm run dev
  ```

## 기술 스택
<div align=center> 
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> 
  <img src="https://img.shields.io/badge/recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=white">
  <img src="https://img.shields.io/badge/aws-ff9900?style=for-the-badge&logo=aws&logoColor=black">
  <img src="https://img.shields.io/badge/docker-1d63ed?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/nginx-009900?style=for-the-badge&logo=nginx&logoColor=white">
  <img src="https://img.shields.io/badge/styledcomponents-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white">
  <img src="https://img.shields.io/badge/reactquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white">
  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black">
</div>

## ERD (ERD Cloud)
- https://www.erdcloud.com/d/rFyZbfuc4uZFQDGys
  
## API (Swagger)
- https://katalk.jinproject.xyz/api/docs/

## 프로젝트 구조

```plaintext
📦kakao-talk
 ┣ 📂client
 ┃ ┣ 📂public
 ┃ ┃ ┣ 📜favicon.ico
 ┃ ┃ ┣ 📜index.html
 ┃ ┃ ┣ 📜manifest.json
 ┃ ┃ ┗ 📜robots.txt
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┣ 📜auth.ts
 ┃ ┃ ┃ ┣ 📜chatting.ts
 ┃ ┃ ┃ ┣ 📜friends.ts
 ┃ ┃ ┃ ┣ 📜profile.ts
 ┃ ┃ ┃ ┗ 📜upload.ts
 ┃ ┃ ┣ 📂assets
 ┃ ┃ ┃ ┣ 📂banner
 ┃ ┃ ┃ ┃ ┗ 📜banner_1.png
 ┃ ┃ ┃ ┗ 📂images
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜Banner.tsx
 ┃ ┃ ┃ ┣ 📜Modal.tsx
 ┃ ┃ ┃ ┗ 📜SideMenu.tsx
 ┃ ┃ ┣ 📂recoil
 ┃ ┃ ┃ ┗ 📂auth
 ┃ ┃ ┃ ┃ ┗ 📜atom.ts
 ┃ ┃ ┣ 📂routes
 ┃ ┃ ┃ ┣ 📜ChatList.tsx
 ┃ ┃ ┃ ┣ 📜ChattingRoom.tsx
 ┃ ┃ ┃ ┣ 📜Friends.tsx
 ┃ ┃ ┃ ┣ 📜Join.tsx
 ┃ ┃ ┃ ┣ 📜Login.tsx
 ┃ ┃ ┃ ┗ 📜Main.tsx
 ┃ ┃ ┣ 📂sockets
 ┃ ┃ ┃ ┗ 📜socket.ts
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📂utils
 ┃ ┃ ┃ ┗ 📜index.ts
 ┃ ┃ ┣ 📜App.tsx
 ┃ ┃ ┣ 📜babel.config.js
 ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┣ 📜react-app-env.d.ts
 ┃ ┃ ┗ 📜Router.tsx
 ┃ ┣ 📜package-lock.json
 ┃ ┣ 📜package.json
 ┃ ┗ 📜tsconfig.json
 ┣ 📂server
 ┃ ┣ 📂assets
 ┃ ┃ ┗ 📂images
 ┃ ┃ ┃ ┣ 📜bg.png
 ┃ ┃ ┃ ┗ 📜profile.jpg
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┣ 📜config.json
 ┃ ┃ ┃ ┗ 📜mysql.js
 ┃ ┃ ┣ 📂controllers
 ┃ ┃ ┃ ┣ 📜authController.js
 ┃ ┃ ┃ ┣ 📜chattingController.js
 ┃ ┃ ┃ ┣ 📜friendsController.js
 ┃ ┃ ┃ ┣ 📜profileController.js
 ┃ ┃ ┃ ┣ 📜socketController.js
 ┃ ┃ ┃ ┗ 📜uploadController.js
 ┃ ┃ ┣ 📂migrations
 ┃ ┃ ┃ ┣ 📜20241118063328-create-account.js
 ┃ ┃ ┃ ┣ 📜20241118064623-create-profile.js
 ┃ ┃ ┃ ┣ 📜20241118064914-create-chat_participant.js
 ┃ ┃ ┃ ┣ 📜20241118065138-create-chatting-room.js
 ┃ ┃ ┃ ┣ 📜20241118065358-create-chatting.js
 ┃ ┃ ┃ ┣ 📜20241118065510-create-msg-read-user.js
 ┃ ┃ ┃ ┗ 📜20241118065637-create-friends.js
 ┃ ┃ ┣ 📂models
 ┃ ┃ ┃ ┣ 📜Account.js
 ┃ ┃ ┃ ┣ 📜Chatting.js
 ┃ ┃ ┃ ┣ 📜Chatting_room.js
 ┃ ┃ ┃ ┣ 📜Chat_participant.js
 ┃ ┃ ┃ ┣ 📜Friends.js
 ┃ ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┃ ┣ 📜Msg_read_user.js
 ┃ ┃ ┃ ┗ 📜Profile.js
 ┃ ┃ ┣ 📂routes
 ┃ ┃ ┃ ┣ 📜auth.js
 ┃ ┃ ┃ ┣ 📜chatting.js
 ┃ ┃ ┃ ┣ 📜friends.js
 ┃ ┃ ┃ ┣ 📜profile.js
 ┃ ┃ ┃ ┗ 📜upload.js
 ┃ ┃ ┣ 📂seeders
 ┃ ┃ ┣ 📂sockets
 ┃ ┃ ┃ ┗ 📜socket.js
 ┃ ┃ ┣ 📂swagger
 ┃ ┃ ┃ ┗ 📜swagger.js
 ┃ ┃ ┣ 📂utils
 ┃ ┃ ┃ ┣ 📜authUtils.js
 ┃ ┃ ┃ ┗ 📜dateUtil.js
 ┃ ┃ ┗ 📜server.js
 ┃ ┣ 📂uploads
 ┃ ┃ ┗ 📂profile
 ┃ ┣ 📜.env
 ┃ ┣ 📜babel.config.js
 ┃ ┣ 📜nodemon.json
 ┃ ┣ 📜package-lock.json
 ┃ ┗ 📜package.json
 ┣ 📜.gitignore
 ┣ 📜ca.crt
 ┣ 📜ca.key
 ┣ 📜cert.crt
 ┣ 📜cert.key
 ┗ 📜README.md
