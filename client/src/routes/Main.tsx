import styled from 'styled-components';
import SideMenu from '../components/SideMenu';
import { Routes, Route } from 'react-router-dom';
import Friends from './Friends';
import ChatList from './ChatList';
import Banner from '../components/Banner';
import { useEffect, useState } from 'react';
import { getSocket } from '../sockets/socket';
import { getReadNotCountAxios } from '../api/chatting';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../recoil/auth/atom';
import { IUserAtom } from '../types';
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
  const [socket, setSocket] = useState<any>();
  const [readNotCount, setReadNotCount] = useState<number>(0); // 메시지 읽지 않은 수
  const user = useRecoilValue<IUserAtom>(userDataState);

  if (socket) {
    socket.on('receive_msg', () => {
      console.log('Main receive_msg');
      setTimeout(getReadNotCount, 100);
    });

    socket.on('read_count_apply', () => {
      setTimeout(getReadNotCount, 100);
    });
  }

  useEffect(() => {
    if (!socket) {
      const socketInstance = getSocket(); // 처음에만 생성
      setSocket(socketInstance);
    }

    getReadNotCount();
  }, []);

  async function getReadNotCount() {
    const result = await getReadNotCountAxios(user.user_id);
    setReadNotCount(Number(result.data.total_read_n_count));
  }

  return (
    <MainContainer>
      <Inner>
        <SideMenu readNotCount={readNotCount}></SideMenu>
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
