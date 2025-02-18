import { Router } from 'express';
import {
  getChattingList,
  enterRoom,
  getChatRoomInfo,
  getMsgList,
  getReadNotCount,
  setDeleteMessage,
  getReadNotMsgList,
  // createAloneRoom,
  leaveRoom,
} from '../controllers/chattingController';

const chattingRouter = Router();

// 채팅방 리스트 조회 요청 처리
chattingRouter.post('/getChattingList', getChattingList);

//채팅방 정보 조회 요청 처리
chattingRouter.post('/getChatRoomInfo', getChatRoomInfo);

//개인 채팅방 생성 및 채팅방 id 조회 요청 처리
chattingRouter.post('/enterRoom', enterRoom);

//나와의 채팅방 생성 및 채팅방 id 조회 요청 처리
// chattingRouter.post('/createAloneRoom', createAloneRoom);

//채팅방 나가기
chattingRouter.post('/leaveRoom', leaveRoom);

//메시지 리스트 조회
chattingRouter.get('/getMsgList', getMsgList);

chattingRouter.post('/getReadNotCount', getReadNotCount);

chattingRouter.post('/setDeleteMessage', setDeleteMessage);

chattingRouter.post('/getReadNotMsgList', getReadNotMsgList);

export default chattingRouter;
