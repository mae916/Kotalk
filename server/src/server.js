import http from 'http';
import https from 'https';
import fs from 'fs';
import express from 'express';
import { Server } from 'socket.io';
import authRouter from './routes/auth';
import friendsRouter from './routes/friends';
import uploadRouter from './routes/upload';
import profileRouter from './routes/profile';
import initSocket from './sockets/socket';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { swaggerUi, specs } from './swagger/swagger';
// import dotenv from 'dotenv';
import path from 'path';
import chattingRouter from './routes/chatting';

// // dotenv 설정
// dotenv.config({
//   path: process.env.NODE_ENV === 'production' ? './.env.prod' : './.env.dev',
// });

let server;
let port;
const app = express();

if (process.env.NODE_ENV === 'production') {
  server = http.createServer(app); // HTTP 서버
  port = 8000;
} else {
  // 개발 환경에서 HTTPS 서버
  // const sslOptions = {
  //   key: fs.readFileSync(path.resolve(__dirname, '../../cert.key')),
  //   cert: fs.readFileSync(path.resolve(__dirname, '../../cert.crt')),
  // };
  // server = https.createServer(sslOptions, app); // HTTPS 서버 생성
  server = http.createServer(app); // HTTP 서버
  port = 4000;
  // CORS 설정
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
}

const io = new Server(server, {
  path: '/api/socket.io',
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

const apiRouter = express.Router();

// 쿠키 파싱 미들웨어 사용
app.use(cookieParser());

// API 문서화
apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// JSON 파싱 미들웨어
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 정적 파일 경로 설정
apiRouter.use('/assets', express.static(path.join(__dirname, '../assets')));
apiRouter.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 라우터 설정
apiRouter.use('/auth', authRouter);
apiRouter.use('/friends', friendsRouter);
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/chatting', chattingRouter);

// API 경로 등록
app.use('/api', apiRouter);

// 소켓 초기화
initSocket(io);

// 서버 시작
server.listen(port, () => {
  console.log(`Server running at http:${process.env.DEV_SERVER_HOST}/`);
});
