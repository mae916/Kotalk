import { Router } from 'express';
import {
  addFriend,
  searchUser,
  getFriendInfo,
  getFriendsList,
} from '../controllers/friendsController';

const friendsRouter = Router();

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

// 친구추가 요청 처리
friendsRouter.post('/addFriend', addFriend);

//유저 찾기
friendsRouter.get('/searchUser', searchUser);

//친구 정보 조회
friendsRouter.post('/getFriendInfo', getFriendInfo);

//친구 리스트 조회
friendsRouter.post('/getFriendsList', getFriendsList);

export default friendsRouter;
