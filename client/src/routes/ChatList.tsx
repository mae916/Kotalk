import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getChattingListAxios } from '../api/chatting';
import { userDataState, participantState } from '../recoil/auth/atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IUserAtom, ChatRoom } from '../types';
import ChattingRoom from '../components/ChattingRoom';
import { handleClick } from '../utils';

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
const ContentBox = styled.ul`
  overflow-y: scroll;
  overflow-x: hidden;
  margin-left: -17px;
  padding-left: 17px;
  height: 508px;

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

const RoomList = styled.li<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  width: calc(100% + 17px);
  margin-left: -17px;
  padding: 7px 7px 7px 17px;
  background-color: ${(props) =>
    props.$isSelected ? '#ededed' : 'transparent'};
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ImgBox = styled.div<{ $length: number }>`
  width: 45px;
  height: 45px;
  margin-right: 12px;
  & > img {
    border: 1px solid #e9e9e9;
  }
  /* $length 값에 따라 스타일 조정 */
  ${({ $length }) =>
    $length === 1 &&
    `
    & > img {
      width:100%;
      height:100%;
      object-fit: cover;
      border-radius: 15px;
    }
    `}

  ${({ $length }) =>
    $length === 2 &&
    `
       position: relative;

      & > img {
        width: 27px;
        height: 27px;
        object-fit: cover;
        border-radius: 11px;
      }
      & > img:last-child {
        position:absolute;
        outline:2px solid #fff;
        bottom:2px;
        right:2px;
      }
    `}

  ${({ $length }) =>
    $length === 3 &&
    ` position: relative;

      & > img {
        width: 22px;
        height: 22px;
        object-fit: cover;
        border-radius: 9px;
      }
       & > img:first-child {
        position:absolute;
        top:2px;
        right:13px;
        z-index:3;
        outline:2px solid #fff;
       }
       & > img:nth-child(2) {
        position:absolute;
        bottom:2px;
        left:2px;
        z-index:1;
       }
       & > img:last-child {
        position:absolute;
        outline:2px solid #fff;
        bottom:2px;
        right:2px;
        z-index:2;
       }
    `}

  ${({ $length }) =>
    $length >= 4 &&
    `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap:1px;
      & > img {
        width: 22px;
        height: 22px;
        object-fit: cover;
        border-radius: 9px;
      }
    `}
`;
const TextBox = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
`;
const LeftBox = styled.div``;
const Title = styled.div``;
const Names = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  margin-right: 4px;
`;
const Count = styled.span`
  font-weight: 300;
  font-size: 0.7rem;
  color: #b2b0af;
`;
const LastMsg = styled.span`
  margin-top: 2px;
  font-size: 0.6rem;
  color: #767676;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 0.7rem;
`;
const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: space-between;
`;
const LastMsgDate = styled.span`
  font-size: 0.6rem;
  color: #767676;
`;
const ReadNotCount = styled.div<{ $isCount: boolean }>`
  font-size: 0.7rem;
  border-radius: 50%;
  width: 0.9rem;
  padding: 2px 0;
  text-align: center;
  font-weight: 600;
  color: transparent;
  margin-top: 7px;
  ${({ $isCount }) =>
    $isCount &&
    `
     background-color: #ff7a6b;
     color: #fff;
  `}
`;

function ChatList({ socket }: { socket: any }) {
  console.log('ChatList 렌더링');
  const user = useRecoilValue<IUserAtom>(userDataState);
  const setParticipant = useSetRecoilState<ChatRoom>(participantState);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);

  let selectedId = 0;
  
  useEffect(() => {
    getChattingList();

    if (socket) {
      const getList = () => {
        setTimeout(getChattingList, 200);
      };

      socket.removeListener('receive_msg');
      socket.removeListener('read_count_apply');

      socket.on('receive_msg', getList);
      socket.on('read_count_apply', getList);

      return () => {
        socket.off('receive_msg', getList);
        socket.off('read_count_apply', getList);
      };
    }
  }, []);

  async function getChattingList() {
    try {
      console.log('chartList getChattingList', user.user_id);
      const { data } = await getChattingListAxios(user.user_id);
      
      if (data && JSON.stringify(data) !== JSON.stringify(rooms)) {
        // 기존 rooms와 값이 다를때만 setRooms 호출(불필요한 재렌더링 줄이기)
        setRooms(data);
        console.log('data', data);
      }
    } catch (error) {
      console.error('채팅 리스트 조회 실패:', error);
    }
  }

  function handleOpenModal(modalType: string) {
    setOpenModal(modalType); // 특정 모달 열기
  }

  const handleCloseModal = useCallback(() => {
    setOpenModal(null);
  }, []);

  function roomListClick(id: number) {
    selectedId = id;
  }

  function roomListDbClick(id: number) {
    const selectedRoom = rooms.find((room) => room.room_id === id);
    if (selectedRoom) {
      setParticipant(selectedRoom);
    }
    selectedId = id;
    handleOpenModal('room');
  }

  return (
    <Container>
      <TitleBox>
        <h1>채팅</h1>
        {/* <TopMenu>
          <li>
            <i className="xi-search"></i>
          </li>
          <li>
            <i className="xi-message-o"></i>
          </li>
        </TopMenu> */}
      </TitleBox>
      <ContentBox>
        {rooms.map((room) => (
          <RoomList
            key={room.room_id}
            $isSelected={selectedId === room.room_id}
            onClick={(e) =>
              handleClick(
                e,
                () => roomListClick(room.room_id),
                () => roomListDbClick(room.room_id)
              )
            }
          >
            <ImgBox $length={room.images.length}>
              {room.images.map((img, i) => (
                <img key={i} src={img} alt="" />
              ))}
            </ImgBox>
            <TextBox>
              <LeftBox>
                <Title>
                  <Names>
                    {/* {room.names.map((name, j) =>
                      j >= 0 && j >= room.names.length - 1 ? name : name + ','
                    )} */}
                    {room.room_name}
                  </Names>
                  <Count>
                    {room.images.length > 2 && room.images.length + 1}
                  </Count>
                </Title>
                <LastMsg>{room.last_message}</LastMsg>
              </LeftBox>
              <DateBox>
                <LastMsgDate>{room.last_message_created_at}</LastMsgDate>
                <ReadNotCount $isCount={room.read_n_count ? true : false}>
                  {room.read_n_count}
                </ReadNotCount>
              </DateBox>
            </TextBox>
          </RoomList>
        ))}
      </ContentBox>
      {openModal === 'room' && (
        <ChattingRoom handleCloseModal={handleCloseModal} socket={socket}></ChattingRoom>
      )}
    </Container>
  );
}

export default ChatList;
