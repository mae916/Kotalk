import { Router } from 'express';
import {
  login,
  join,
  getAccessToken,
  getUser,
  verifyAccessToken,
  emailDuplicateCheck,
} from '../controllers/authController';

const authRouter = Router();

/**
 * @swagger
 * /auth/join:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 회원가입
 *     description: 유저 정보를 기반으로 회원가입 처리
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_email:
 *                 type: string
 *                 description: "유저 이메일"
 *                 example: "example@example.com"
 *               password:
 *                 type: string
 *                 description: "유저 비밀번호"
 *                 example: "password123"
 *               user_name:
 *                 type: string
 *                 description: "유저 이름"
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: "회원가입 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "회원가입 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: "엑세스 토큰"
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       description: "리프레시 토큰"
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: "모든 필드를 입력해주세요."
 *       401:
 *         description: "비밀번호가 틀렸습니다."
 *       404:
 *         description: "사용자를 찾을 수 없습니다."
 *       500:
 *         description: "서버 오류가 발생했습니다."
 */

// 회원가입 요청 처리
authRouter.post('/join', join);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 로그인
 *     description: 유저 이메일과 비밀번호로 로그인 처리
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_email:
 *                 type: string
 *                 description: "유저 이메일"
 *                 example: "example@example.com"
 *               password:
 *                 type: string
 *                 description: "유저 비밀번호"
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: "로그인 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "로그인 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: "엑세스 토큰"
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       description: "리프레시 토큰"
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: "이메일 또는 비밀번호가 잘못되었습니다."
 *       500:
 *         description: "서버 오류가 발생했습니다."
 */
authRouter.post('/login', login);

/**
 * @swagger
 * /auth/getAccessToken:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 엑세스 토큰 갱신
 *     description: 리프레시 토큰을 사용하여 새로운 엑세스 토큰을 발급
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: "리프레시 토큰"
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: "엑세스 토큰 갱신 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '토큰 발급 성공'
 *                 data:
 *                   type: object
 *                   properties:
 *                      accessToken:
 *                        type: string
 *                        description: "새로운 엑세스 토큰"
 *                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: "리프레시 토큰이 유효하지 않습니다."
 *       500:
 *         description: "서버 오류가 발생했습니다."
 */
authRouter.post('/getAccessToken', getAccessToken);

authRouter.get('/getUser', verifyAccessToken, getUser);

authRouter.post('/emailCheck', emailDuplicateCheck);

export default authRouter;
