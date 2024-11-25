import { Router } from 'express';
import { getChattingList } from '../controllers/chattingController';

const chattingRouter = Router();

// 채팅방 리스트 조회 요청 처리
chattingRouter.post('/getChattingList', getChattingList);

export default chattingRouter;
