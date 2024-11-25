import styled from 'styled-components';
import Modal from '../components/Modal';
import { useEffect, useState } from 'react';
import { initSocket } from '../sockets/socket';
import { useRecoilValue } from 'recoil';
import { userDataState } from '../recoil/auth/atom';

const CloseBtn = styled.i`
  display: flex;
  justify-content: right;
  margin: 10px 10px 0 0;
  font-size: 0.8rem;
  color: #c6c6c6;
`;
const ChattingInfo = styled.div``;
const ChattingBox = styled.div``;
const AudienceInfo = styled.div``;
const ChattingBtnBox = styled.div``;
const Participant = styled.div``;

type ChattingRoomProps = {
  handleCloseModal: () => void;
  id: number;
};

function ChattingRoom({ id, handleCloseModal }: ChattingRoomProps) {
  const user = useRecoilValue(userDataState);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = initSocket();
      setSocket(newSocket); // 새로 초기화된 소켓을 상태로 설정
    }

    if (socket) {
      const participant = { userId: user.user_id, friendId: id };
      socket.emit('enter_personal_room', participant); // 이벤트 발생
    }
  }, [socket, id, user.user_id]);

  return (
    <Modal>
      <CloseBtn
        className="xi-close"
        onClick={() => handleCloseModal()}
      ></CloseBtn>
      <ChattingInfo>
        <AudienceInfo>
          <img src="" alt="" />
          <Participant>
            <div></div>
            <div></div>
          </Participant>
        </AudienceInfo>
        <ChattingBtnBox></ChattingBtnBox>
      </ChattingInfo>
      <ChattingBox></ChattingBox>
    </Modal>
  );
}

export default ChattingRoom;
