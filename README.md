# 카카오톡 구현하기

- react와 ts 학습과 백엔드를 직접 구축 해보고 싶은 마음과 socket.io에 대한 흥미로 이 프로젝트를 시작하게 되었습니다.
- 실제 카카오톡을 실행해보며 실제 구현 불가한 부분은 커스터마이징하고 모두 스스로 제작하였습니다.

## 시작 가이드

### 설치 및 실행

- 프론트엔드 실행

  ```
  $npm run start
  ```

- 백엔드 실행

  ```
  $npm run dev
  ```

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
