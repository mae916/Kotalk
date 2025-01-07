import { Router } from 'express';
import {
  getChattingList,
  createPersonalRoom,
  getChatRoomInfo,
  getMsgList,
  setChatMessage,
} from '../controllers/chattingController';

const chattingRouter = Router();

// 채팅방 리스트 조회 요청 처리
chattingRouter.post('/getChattingList', getChattingList);

//채팅방 정보 조회 요청 처리
chattingRouter.post('/getChatRoomInfo', getChatRoomInfo);

//채팅방 생성 및 채팅방 id 조회 요청 처리
chattingRouter.post('/createPersonalRoom', createPersonalRoom);

//메시지 리스트 조회
chattingRouter.post('/getMsgList', getMsgList);

chattingRouter.post('/setChatMessage', setChatMessage);

export default chattingRouter;
