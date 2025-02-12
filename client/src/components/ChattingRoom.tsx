import styled from 'styled-components';
import Modal from './Modal';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { getSocket } from '../sockets/socket';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userDataState, participantState } from '../recoil/auth/atom';
import {
  getMsgListAxios,
  setChatMessageAxios,
  setDeleteMessageAxios,
} from '../api/chatting';
import { amPmformat } from '../utils';
import { useForm } from 'react-hook-form';
import ContextMenu from '../components/ContextMenu';
import { useInView } from 'react-intersection-observer';

const Container = styled.div`
  background-color: #bacee0;
  height: 100%;
`;
const CloseBtn = styled.i`
  display: flex;
  justify-content: right;
  padding: 10px 10px 0 0;
  font-size: 0.8rem;
  color: #9e9e9e;
`;
const ChattingInfo = styled.div`
  padding: 0 15px 8px;
`;
const ChattingBox = styled.ul`
  overflow-y: scroll;
  overflow-x: hidden;
  margin-left: -17px;
  padding: 0px 12px 12px 32px;
  height: 300px;
  margin-right: 3px;
  &::-webkit-scrollbar {
    width: 10px; /* 세로 스크롤바 폭 */
    margin: 10px;
  }

  /* 스크롤바 막대 */
  &::-webkit-scrollbar-thumb {
    background-color: #2929293d; /* 스크롤바 막대 색상 */
    border-radius: 12px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #18181865;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0); /* 스크롤바 뒷 배경을 투명 처리한다 */
  }
`;
const AudienceInfo = styled.div`
  display: flex;
  align-items: center;
`;
const RoomNameBox = styled.div`
  & > span {
    font-size: 0.9rem;
  }
`;
const ParticipantBox = styled.div`
  font-size: 0.7rem;
  margin-top: 5px;
`;

const ImgBox = styled.div<{ $length: number }>`
  width: 40px;
  height: 40px;
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
        width: 24px;
        height: 24px;
        object-fit: cover;
        border-radius: 10px;
      }
      & > img:last-child {
        position:absolute;
        outline: 1px solid #ffffff0;
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
        outline:1px solid #fff;
       }
       & > img:nth-child(2) {
        position:absolute;
        bottom:2px;
        left:2px;
        z-index:1;
       }
       & > img:last-child {
        position:absolute;
        outline:1px solid #fff;
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

const DateList = styled.li`
  font-size: 0.6rem;
  margin: 25px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    background-color: #58585816;
    width: fit-content;
    padding: 6px 15px;
    border-radius: 20px;
    color: #00000092;
  }
`;

const ChattingList = styled.li`
  display: flex;
  margin-top: 10px;
  align-items: center;
  flex-grow: 1;
  & > img {
    width: 35px;
    height: 35px;
    margin-right: 7px;
    border: 1px solid #e9e9e9;
    object-fit: cover;
    border-radius: 13px;
  }
`;
const RightBox = styled.div`
  & > div {
    font-size: 0.8rem;
  }
`;
const Message = styled.div`
  margin-top: 3px;
  position: relative;
  /* margin: 50px; */
  padding: 6px;
  border-radius: 2px;
  line-height: 0.8rem;
  max-width: 80%;
`;
const ReadBox = styled.div``;
const Time = styled.div`
  font-size: 0.6rem;
  color: #30353a;
`;
const Read = styled.div`
  color: #fff280;
  font-size: 0.5rem;
  margin-bottom: 2px;
`;
const MsgBox = styled.div`
  display: flex;
  align-items: end;
  ${Message} {
    background: #ffffff;
    margin-right: 3px;
  }
  ${Message}:after {
    border-top: 5px solid #ffffff;
    border-left: 5px solid transparent;
    border-right: 0px solid transparent;
    border-bottom: 0px solid transparent;
    content: '';
    position: absolute;
    top: 3px;
    left: -4px;
  }
`;
const MyMsgBox = styled.div`
  width: 100%;
  font-size: 0.8rem;
  display: flex;
  justify-content: right;
  align-items: end;
  ${Message} {
    background: #ffeb33;
    margin-left: 3px;
  }
  ${Message}:after {
    border-top: 5px solid #ffeb33;
    border-left: 0px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 0px solid transparent;
    content: '';
    position: absolute;
    top: 3px;
    right: -4px;
  }
  ${Read} {
    text-align: right;
  }
`;

const DelMsg = styled.span`
  color: #998d1f;
  font-size: 0.6rem;
  vertical-align: middle;
  & > i {
    margin-right: 2px;
    font-size: 0.85rem;
    line-height: 0.6rem;
    vertical-align: middle;
  }
`;
const ChattingBtnBox = styled.div``;
const ChatFormBox = styled.form`
  width: 100%;
  background-color: #fff;
  height: 110px;
  padding: 10px 0;
  text-align: right;
  & > textarea {
    width: 100%;
    border: 0;
    height: 70%;
    resize: none;
    padding: 0 5px 0 10px;
    font-size: 0.8rem;
  }
  & > textarea:focus-visible {
    border: 0;
    outline: 0;
  }
`;
const SubmitBtn = styled.button`
  border: 0;
  background-color: #fee500;
  color: #423630;
  padding: 5px 10px 6px;
  font-size: 0.5rem;
  margin: 3px 7px;
  border-radius: 2px;
  &:disabled {
    color: #adadad;
    background-color: #f6f6f6;
  }
`;

type ChattingRoomProps = {
  friendId?: number | null;
  handleCloseModal: () => void;
  socket?: any;
};

function ChattingRoom ({ handleCloseModal, socket } : ChattingRoomProps) {
  console.log('ChattingRoom 렌더링');
  const user = useRecoilValue<any>(userDataState);
  const participant = useRecoilValue(participantState);
  const [msgList, setMsgList] = useState<any>([]);
  const roomName = useMemo(
    () => `${participant.room_name}_${participant.room_id}`,
    [participant.room_name, participant.room_id]
  );
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedMsg, setSelectedMsg] = useState<any>({});
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [lastChatId, setLastChatId] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [ref, inView] = useInView();
  const pageSize = 20; // 한 번에 불러올 메시지 수

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<any>();

  const scrollRef = useRef<any>();
  const previousMsgDate = useRef<string | null>(null); // ref로 이전 메시지 날짜를 저장

  useEffect(() => {
    getChattingList();
    handleFocus();
  }, []);

  // useEffect(() => {
  //   // inView 가 true 일때 리스트를 업데이트
  //   if (inView) {
  //     console.log('inview');
  //     getChattingList();
  //   }
  // }, [inView]);

  //스크롤 하단 고정
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgList]);

  useEffect(() => {
    if (socket) {
      socket.removeListener('receive_msg');
      socket.removeListener('read_count_apply');
      
      //메시지 받기
      socket.on('receive_msg', (msgData: any) => {
        console.log('receive_msg');
        addMessage(msgData);
      });

      // 읽은 사람 정보 받아오기
      socket.on('read_count_apply', (userId: number) => {
        console.log('read_count_apply');
        updateReadUser(userId); // 양쪽 참여자 모두 이 함수를 실행 시킴 그래서 두번일어남
      });

      // 삭제된 메시지 정보 받아오기
      // socket.on('del_message_apply', (chatId: number) => {
      //   console.log('del_message_apply');
      //   // getChattingList();
      // });

      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);
    } else {
      console.log('socket 조건충족 안됨');
    }
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  function handleFocus() {
    console.log('socket, roomName', socket, roomName);
    if (socket && roomName) {
      console.log('포커스 인');
      setVisible(true);
      socket.emit('read_message', participant.room_id, roomName, user.user_id);
      updateReadUser(user.user_id);
    }
  }

  function handleBlur() {
    console.log('포커스 아웃');
    setVisible(false);
  }

  function updateReadUser(readUserId: number) {
    setMsgList((prevMsgList: any) =>
      prevMsgList.map((msg: any) => ({
        ...msg,
        read_not_user: msg.read_not_user.filter(
          (userId: number) => userId !== readUserId
        ),
      }))
    );
  }

  async function getChattingList() {
    console.log('getChattingList');
    if (hasMore) {
      const data = await getMsgListAxios(
        participant.room_id,
        pageSize,
        lastChatId
      );
      if (!data) {
        setHasMore(false);
      } else {
        setMsgList((prevMessages: any) => [...data.result, ...prevMessages]);

        const lastMessage = data.result[0];
        setLastChatId(lastMessage?.chat_id);
      }
    }
  }

  function formattingMsg(author: any, message: string) {
    console.log('visiblevisible', visible);
    const obj = {
      message,
      del_yn: 'n',
      room_id: participant.room_id,
      user_id: author.user_id,
      profile_img_url: author.profile_img_url,
      user_name: author.user_name,
      createdAt: new Date(),
      participant: participant.ids,
      read_not_user: visible
        ? participant.ids.filter(
            (userId: number) =>
              userId !== user.user_id && userId !== author.user_id
          ) // user.user_id를 제외한 요소만 남김
        : participant.ids.filter((userId: number) => userId !== author.user_id),
    };
    console.log('participant', participant);
    console.log('visible', visible);
    console.log('obj', obj);
    console.log('author.user_id', author.user_id);
    return obj;
    // setChatMessageAxios(obj);

    // setMsgList((prev: any[] = []) => {
    //   const data = [...prev, { ...obj }];
    //   return data;
    // });
  }

  function addMessage(msgData:any) {
    setMsgList((prev: any[] = []) => {
      const data = [...prev, { ...msgData }];
      return data;
    });
  }
  const chatSubmitHandler = (data: { message: string }) => {
    if (roomName && socket) {
      const obj = formattingMsg(user, data.message);
      socket.emit('send_msg', roomName, obj); // 메시지 전송
      reset(); // 입력창 초기화
    } else {
      console.error('소켓 연결 실패');
    }
  };
  function leaveRoom() {
    // if (socket && roomName) {
    //   socket.emit('leave_room', roomName);
    // } else {
    //   console.error('소켓연결 실패');
    // }

    handleCloseModal();
  }

  function createAtTimeCheck(givenTimeStr: any) {
    const givenTime = new Date(givenTimeStr);
    const currentTime = new Date();

    // 3분을 밀리초로 변환
    const threeMinutesLater = new Date(givenTime.getTime() + 3 * 60 * 1000);

    // 주어진 시간이 현재 시간으로부터 3분 후인지 비교
    console.log('threeMinutesLater', threeMinutesLater);
    console.log('currentTime', currentTime);
    return currentTime <= threeMinutesLater;
  }

  function handleContextMenu(event: React.MouseEvent<HTMLLIElement>, msg: any) {
    event.preventDefault();
    const isThreeMinutes = createAtTimeCheck(msg.createdAt);
    console.log('isThreeMinutes', isThreeMinutes);

    if (msg.user_id == user.user_id && isThreeMinutes && msg.del_yn == 'n') {
      //본인이 쓴 메시지고, 작성후 3분이내이고, 삭제된적 없는 메시지일때
      const { clientX, clientY } = event; // 화면에서 클릭된 좌표

      // 부모 요소를 기준으로 메뉴 위치 보정
      setContextMenuPosition({
        top: clientY - 130,
        left: clientX - 380,
      });

      setIsContextMenuOpen(true);
      setSelectedMsg(msg);
    }
  }
  async function deleteMessage() {
    const { data: chat_id } = await setDeleteMessageAxios(selectedMsg);
    // getChattingList();
    socket.emit('del_message', roomName, chat_id);
  }

  function formattedDate(currentMsg: any) {
    const currentDate = new Date(currentMsg.createdAt);
    const currentYMD = `${currentDate.getFullYear()}년 ${
      currentDate.getMonth() + 1
    }월 ${currentDate.getDate()}일`;

    // 요일 배열 (0: 일요일, 1: 월요일, ...)
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const currentDay = daysOfWeek[currentDate.getDay()];

    const fullDate = `${currentYMD} ${currentDay}요일`; // 날짜와 요일을 함께 표시

    // 날짜가 변경되었을 경우에만 출력
    if (previousMsgDate.current !== fullDate) {
      previousMsgDate.current = fullDate; // 날짜를 업데이트
      return fullDate;
    }
    return null; // 날짜가 같으면 null 반환
  }

  const contextMenuOptions = [
    {
      label: '모든 대화상대에게서 삭제',
      onClick: deleteMessage,
    },
  ];

  return (
    <Modal>
      <Container>
        <CloseBtn>
          <i className="xi-close" onClick={leaveRoom}></i>
        </CloseBtn>
        <ChattingInfo>
          <AudienceInfo>
            <ImgBox $length={participant.images.length}>
              {participant.images.map((img, i) => (
                <img key={i} src={img} alt="" />
              ))}
            </ImgBox>
            <RoomNameBox>
              <span>{participant.room_name}</span>
              <ParticipantBox>
                <i className="xi-user"></i>
                <span>{participant.ids.length}</span>
              </ParticipantBox>
            </RoomNameBox>
          </AudienceInfo>
          <ChattingBtnBox></ChattingBtnBox>
        </ChattingInfo>
        <ChattingBox ref={scrollRef}>
          <li ref={ref}></li>
          {msgList?.map((msg: any, i: number) => {
            const dateToShow = formattedDate(msg);
            return (
              <div key={i}>
                {dateToShow && (
                  <DateList>
                    <div>{dateToShow}</div>
                  </DateList>
                )}
                <ChattingList
                  
                  onContextMenu={(event) => handleContextMenu(event, msg)}
                >
                  {user.user_id === msg.user_id ? (
                    <MyMsgBox>
                      <ReadBox>
                        <Read>
                          {msg.read_not_user.length > 0 &&
                            msg.read_not_user.length}
                        </Read>
                        <Time>{amPmformat(msg.createdAt)}</Time>
                      </ReadBox>
                      <Message>
                        {msg.del_yn == 'n' ? (
                          msg.message
                        ) : (
                          <DelMsg>
                            <i className="xi-error"></i>삭제된 메시지입니다.
                          </DelMsg>
                        )}
                      </Message>
                    </MyMsgBox>
                  ) : (
                    <>
                      <img src={msg.profile_img_url} alt="" />
                      <RightBox>
                        <div>{msg.user_name}</div>
                        <MsgBox>
                          <Message>
                            {msg.del_yn == 'n' ? (
                              msg.message
                            ) : (
                              <DelMsg>
                                <i className="xi-error"></i>삭제된 메시지입니다.
                              </DelMsg>
                            )}
                          </Message>
                          <ReadBox>
                            <Read>
                              {msg.read_not_user.length > 0 &&
                                msg.read_not_user.length}
                            </Read>
                            <Time>{amPmformat(msg.createdAt)}</Time>
                          </ReadBox>
                        </MsgBox>
                      </RightBox>
                    </>
                  )}
                </ChattingList>
              </div>
            );
          })}
          {isContextMenuOpen && (
            <ContextMenu
              top={contextMenuPosition.top}
              left={contextMenuPosition.left}
              options={contextMenuOptions}
              onClose={() => setIsContextMenuOpen(false)}
            />
          )}
        </ChattingBox>
        <ChatFormBox onSubmit={handleSubmit(chatSubmitHandler)}>
          <textarea
            {...register('message', {
              required: true,
              validate: (value) => (value.trim().length >= 1 ? true : false),
            })}
            placeholder="메시지 입력"
            // onChange={chatChangeHandler}
            // value={message}
          />
          <SubmitBtn disabled={!isValid}>전송</SubmitBtn>
        </ChatFormBox>
      </Container>
    </Modal>
  );
}

export default ChattingRoom;
