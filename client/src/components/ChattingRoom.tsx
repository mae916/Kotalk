import styled from 'styled-components';
import Modal from './Modal';
import { useEffect, useState } from 'react';
import { getSocket } from '../sockets/socket';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userDataState, participantState } from '../recoil/auth/atom';
import { getMsgListAxios, setChatMessageAxios } from '../api/chatting';
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
const ChattingInfo = styled.div``;
const ChattingBox = styled.ul``;
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
const AudienceInfo = styled.div``;
const Participant = styled.div``;
const ChattingBtnBox = styled.div``;
const ChatFormBox = styled.form``;

type ChattingRoomProps = {
  friendId?: number | null;
  handleCloseModal: () => void;
};

function ChattingRoom({ handleCloseModal }: ChattingRoomProps) {
  const user = useRecoilValue(userDataState);
  const [participant, setParticipant] = useRecoilState(participantState);
  const [dbMsg, setDbMsg] = useState<any>([]);
  const [localMsg, setLocalMsg] = useState<any>([]);
  const [msgList, setMsgList] = useState<any>([]);
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [focus, setFocus] = useState<boolean>(true);
  const [roomName, setRoomName] = useState<string>('');

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
      const roomTitle = `${participant.room_name}_${participant.room_id}`;
      setRoomName(roomTitle);

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

  useEffect(() => {
    getChattingList();
  }, []);

  async function getChattingList() {
    const data = await getMsgListAxios(participant.room_id);
    console.log('메시지 리스트', data);
    setDbMsg(data.result);
    setMsgList(data.result);
  }

  function addMessage(user: any, roomId:number, message: any) {
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
  function chatSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (roomName && socket) {
      socket.emit('send_msg', user, roomName, message);
      setMessage('');
    } else {
      console.error('소켓연결 실패');
    }
  }

  function chatChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const {
      currentTarget: { value },
    } = event;

    setMessage(value);
  }

  function leaveRoom() {
    //대화 내용 저장
    setChatMessageAxios(localMsg);
    setLocalMsg([]);

    if (socket && roomName) {
      socket.emit('leave_room', roomName);
    } else {
      console.error('소켓연결 실패');
    }

    handleCloseModal();
  }

  //채팅창 포커스 여부(읽었는지 여부)
  function handleFocus() {
    setFocus(true);
  }
  function handleBlur() {
    setFocus(false);
  }
  window.addEventListener('focus', handleFocus);
  window.addEventListener('blur', handleBlur);

  return (
    <Modal>
      <Container>
        <CloseBtn className="xi-close" onClick={leaveRoom}></CloseBtn>
        <ChattingInfo>
          <AudienceInfo>
            <ImgBox $length={participant.images.length}>
              {participant.images.map((img, i) => (
                <img key={i} src={img} alt="" />
              ))}
            </ImgBox>
            <Participant>{participant.room_name}</Participant>
          </AudienceInfo>
          <ChattingBtnBox></ChattingBtnBox>
        </ChattingInfo>
        <ChattingBox>
          {msgList?.map((msg: any, i: number) => (
            <li key={i}>
              <div>{msg.message}</div>
              <div>{msg.user_name}</div>
            </li>
          ))}
        </ChattingBox>
        {focus}
        <ChatFormBox onSubmit={chatSubmitHandler}>
          <input
            type="text"
            placeholder="메시지 입력"
            onChange={chatChangeHandler}
            value={message}
          />
        </ChatFormBox>
      </Container>
    </Modal>
  );
}

export default ChattingRoom;
