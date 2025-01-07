import styled from 'styled-components';
import SideMenu from '../components/SideMenu';
import { Routes, Route } from 'react-router-dom';
import Friends from './Friends';
import ChatList from './ChatList';
import Banner from '../components/Banner';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { participantState } from '../recoil/auth/atom';
import { getSocket } from '../sockets/socket';

const MainContainer = styled.div``;

const Inner = styled.div`
  display: grid;
  grid-template-columns: 58px 1fr;
`;
const ContentBox = styled.div``;
const CloseBox = styled.div`
  display: flex;
  justify-content: right;
  margin: 10px 10px 15px;
  & > i:first-child {
    margin-right: 8px;
  }
  & i {
    font-size: 0.6rem;
  }
`;
const RouteBox = styled.div`
  padding: 0 1px 0 17px;
`;

function Main() {
  const [socket, setSocket] = useState<any>(null);
  const [participant, setParticipant] = useRecoilState(participantState);
  const [localMsg, setLocalMsg] = useState<any>([]);
  const [msgList, setMsgList] = useState<any>([]);

  function addMessage(user: any, roomId:number, message: any) {
    console.log('addMessage',user);
    const obj = {
      message: message,
      send_date: new Date().toISOString(),
      del_yn: 'n',
      room_id: roomId,
      user_id: user.user_id,
      profile_img_url: user.profile_img_url,
      user_name: user.user_name,
    };
    console.log('obj', obj);
    setLocalMsg((prev: any[] = []) => [...prev, { ...obj }]);
    setMsgList((prev: any[] = []) => {
      const data = [...prev, { ...obj }];
      console.log('data', data);
      return data;
    });
  }

  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);

    return () => {
      if (socket) {
        socket.off('receive_msg', addMessage);
      }
    };
  }, []);

  useEffect(() => {
    if (socket && participant) {
      // 채팅방 입장
      // socket.emit('enter_personal_room', roomTitle, participant.ids);
      //메시지 받기
      socket.on('receive_msg', addMessage);

      // 기존 이벤트 리스너 제거
      return () => {
        socket.off('receive_msg', addMessage);
      };
    }
  }, [socket]);

  return (
    <MainContainer>
      <Inner>
        <SideMenu></SideMenu>
        <ContentBox>
          <CloseBox>
            <i className="xi-minus-thin"></i>
            <i className="xi-close-thin"></i>
          </CloseBox>
          <RouteBox>
            <Routes>
              <Route path="friends" element={<Friends />} />
              <Route path="chatList" element={<ChatList />} />
            </Routes>
          </RouteBox>
        </ContentBox>
      </Inner>
      <Banner></Banner>
    </MainContainer>
  );
}

export default Main;
