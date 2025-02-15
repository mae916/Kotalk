import { Router } from 'express';
import {
  getChattingList,
  createPersonalRoom,
  getChatRoomInfo,
  getMsgList,
  setChatMessage,
  getReadNotCount,
  setDeleteMessage,
  createAloneRoom,
} from '../controllers/chattingController';

const chattingRouter = Router();

// 채팅방 리스트 조회 요청 처리
chattingRouter.post('/getChattingList', getChattingList);

//채팅방 정보 조회 요청 처리
chattingRouter.post('/getChatRoomInfo', getChatRoomInfo);

//개인 채팅방 생성 및 채팅방 id 조회 요청 처리
chattingRouter.post('/createPersonalRoom', createPersonalRoom);

//나와의 채팅방 생성 및 채팅방 id 조회 요청 처리
chattingRouter.post('/createAloneRoom', createAloneRoom);

//메시지 리스트 조회
chattingRouter.get('/getMsgList', getMsgList);

chattingRouter.post('/setChatMessage', setChatMessage);

chattingRouter.post('/getReadNotCount', getReadNotCount);

chattingRouter.post('/setDeleteMessage', setDeleteMessage);

export default chattingRouter;
