import https from 'https';
import fs from 'fs';
import express from 'express';
import { join } from 'path';
import { Server } from 'socket.io';
import authRouter from './routes/auth';
import friendsRouter from './routes/friends';
import uploadRouter from './routes/upload';
import profileRouter from './routes/profile';
import initSocket from './sockets/socket';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { swaggerUi, specs } from './swagger/swagger';
import dotenv from 'dotenv';
import path from 'path';
import chattingRouter from './routes/chatting';

dotenv.config();

const app = express();
const port = 4000;

// SSL 인증서 파일 경로
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, '../../cert.key')),
  cert: fs.readFileSync(path.join(__dirname, '../../cert.crt')),
};

const server = https.createServer(sslOptions, app); // HTTPS 서버 생성
const io = new Server(server, {
  cors: {
    // 두번째 인자는 서버 구성 옵션 객체, CORS활성화
    origin: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

// 쿠키 파싱 미들웨어 사용
app.use(cookieParser());

app.use(
  cors({
    origin: 'https://localhost:3000',
    credentials: true,
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Static 파일 경로 설정
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: 유저 계정 관련 api
 */
app.use('/auth', authRouter);

/**
 * @swagger
 * tags:
 *  name: Friend
 *  description: 친구 정보 관련 api
 */
app.use('/friends', friendsRouter);

/**
 * @swagger
 * tags:
 *  name: Upload
 *  description: 업로드 관련 api
 */
app.use('/upload', uploadRouter);

/**
 * @swagger
 * tags:
 *  name: Profile
 *  description: 유저 프로필 관련 api
 */
app.use('/profile', profileRouter);

/**
 * @swagger
 * tags:
 *  name: Chatting
 *  description: 채팅 관련 api
 */
app.use('/chatting', chattingRouter);

app.get('*', function (req, res) {
  res.sendFile(join(__dirname, '../../client/public/index.html'));
});

// 소켓 관련 이벤트 초기화
initSocket(io);

// 서버 시작
server.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});
