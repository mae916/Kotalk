import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  getChattingListAxios,
  leaveRoomAxios,
  getReadNotMsgListAxios,
} from '../api/chatting';
import { userState, participantState } from '../recoil/auth/atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IUserAtom, ChatRoom } from '../types';
import ChattingRoom from '../components/ChattingRoom';
import { handleClick } from '../utils';
import ContextMenu from '../components/ContextMenu';
import { useLocation } from 'react-router-dom';

const Container = styled.div``;
const TitleBox = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 18px 15px 0;
`;
const TopMenu = styled.ul`
  display: flex;
  & i {
    font-size: 1.3rem;
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
  /* height: 508px; */

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
const Title = styled.div`
  display: flex;
`;
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

const Me = styled.div`
  background-color: #4a525c;
  color: #fff;
  border-radius: 50%;
  width: 0.7rem;
  height: 0.7rem;
  font-size: 0.55rem;
  font-weight: bold;
  text-align: center;
  line-height: 0.7rem;
  margin-right: 4px;
`;

function ChatList({ socket }: { socket: any }) {
  console.log('ChatList 렌더링');
  const user = useRecoilValue<IUserAtom>(userState);
  const setParticipant = useSetRecoilState<ChatRoom>(participantState);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>();

  let selectedId = 0;

  useEffect(() => {
    getChattingList();

    if (socket) {
      socket.on('receive_msg', () => setTimeout(getChattingList, 500));
      socket.on('read_count_apply', () => setTimeout(getReadNotMsgList, 500));

      return () => {
        socket.off('receive_msg', getChattingList);
        socket.off('read_count_apply', getReadNotMsgList);
      };
    }
  }, []);

  async function getChattingList() {
    console.log('chartList getChattingList', user.user_id);
    const { data } = await getChattingListAxios(user.user_id);

    if (data && JSON.stringify(data) !== JSON.stringify(rooms)) {
      //기존 rooms와 값이 다를때만 setRooms 호출(불필요한 재렌더링 줄이기)
      setRooms(data);
      console.log('data', data);
    }
  }

  async function getReadNotMsgList() {
    console.log('chartList getReadNotMsgList', user.user_id);
    const { data } = await getReadNotMsgListAxios(user.user_id);
    console.log('rooms', rooms);

    setRooms((prevRooms) => {
      const newRooms = prevRooms.map((room) => {
        const matched = data.find((item: any) => item.room_id === room.room_id);
        return {
          ...room,
          read_n_count: matched ? matched.read_n_count : 0,
        };
      });

      return newRooms;
    });
  }
  function handleOpenModal(modalType: string) {
    setOpenModal(modalType); // 특정 모달 열기
  }

  function handleCloseModal() {
    setOpenModal(null);
  }

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

  function handleContextMenu(event: React.MouseEvent<HTMLElement>, room: any) {
    event.preventDefault();

    setSelectedRoom(room);

    const { clientX, clientY } = event; // 화면에서 클릭된 좌표

    // 부모 요소를 기준으로 메뉴 위치 보정
    setContextMenuPosition({
      top: clientY,
      left: clientX,
    });

    setIsContextMenuOpen(true);
  }

  async function leaveRoom() {
    await leaveRoomAxios(selectedRoom?.room_id, user.user_id);
    getChattingList();
  }

  const contextMenuOptions = [
    {
      label: '채팅방 나가기',
      onClick: leaveRoom,
    },
  ];

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
        {rooms?.map((room) => (
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
            onContextMenu={(event) => handleContextMenu(event, room)}
          >
            <ImgBox $length={room.images.length}>
              {room.images.map((img, i) => (
                <img key={i} src={img} alt="" />
              ))}
            </ImgBox>
            <TextBox>
              <LeftBox>
                <Title>
                  {room.type == 'alone' && <Me>나</Me>}
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
                <LastMsgDate>{room.last_message_date}</LastMsgDate>
                <ReadNotCount $isCount={room.read_n_count ? true : false}>
                  {room.read_n_count}
                </ReadNotCount>
              </DateBox>
            </TextBox>
          </RoomList>
        ))}
      </ContentBox>
      {isContextMenuOpen && (
        <ContextMenu
          top={contextMenuPosition.top}
          left={contextMenuPosition.left}
          options={contextMenuOptions}
          onClose={() => setIsContextMenuOpen(false)}
        />
      )}
      {openModal === 'room' && (
        <ChattingRoom
          handleCloseModal={handleCloseModal}
          socket={socket}
        ></ChattingRoom>
      )}
    </Container>
  );
}

export default ChatList;
