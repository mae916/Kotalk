import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getChattingListAxios } from '../api/chatting';
import { userDataState } from '../recoil/auth/atom';
import { useRecoilValue } from 'recoil';
import { IUserAtom } from '../types';

const Container = styled.div``;
const TitleBox = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  margin: 0 18px 10px 0;
`;
const TopMenu = styled.ul`
  display: flex;
  & i {
    font-size: 1.1rem;
    color: #9d9d9d;
  }
  & > li:first-child i {
    margin-right: 10px;
  }
`;
const ContentBox = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  margin-left: -17px;
  padding-left: 17px;
  height: 514px;

  &::-webkit-scrollbar {
    width: 14px; /* 세로 스크롤바 폭 */
  }

  /* 스크롤바 막대 */
  &::-webkit-scrollbar-thumb {
    background-color: #cccccc; /* 스크롤바 막대 색상 */
    border-radius: 12px;
    border: 3px solid #ffffff;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #7f7f7f;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0); /* 스크롤바 뒷 배경을 투명 처리한다 */
  }
`;

function ChatList() {
  const user = useRecoilValue<IUserAtom>(userDataState);
  const [chattings, setChattings] = useState([]);
  useEffect(() => {
    (async () => {
      await getChattingList();
    })();
  }, []);

  async function getChattingList() {
    try {
      const { data } = await getChattingListAxios(user.user_id);
      setChattings(data);
    } catch (error) {
      console.error('채팅 리스트 조회 실패:', error);
    }
  }

  return (
    <Container>
      <TitleBox>
        <h1>채팅</h1>
        <TopMenu>
          <li>
            <i className="xi-search"></i>
          </li>
          <li>
            <i className="xi-message-o"></i>
          </li>
        </TopMenu>
      </TitleBox>
      <ContentBox></ContentBox>
    </Container>
  );
}

export default ChatList;
