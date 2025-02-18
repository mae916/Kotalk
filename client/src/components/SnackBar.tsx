import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  width: 93%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffffe4;
  padding: 7px 10px;
  border-radius: 30px;
  z-index: 10;
  transform: translate(-50%, -50%);
  left: 50%;
  bottom: 25%;
`;
const Participant = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
`;
const Info = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  & > img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;
const Message = styled.span`
  margin-left: 10px;
`;
const Icon = styled.i`
  cursor: pointer;
`;

interface INowMessage {
  createdAt: Date;
  del_yn: 'y' | 'n';
  message: string;
  participant: number[];
  profile_img_url: string;
  read_not_user: number[];
  room_id: number;
  user_id: number;
  user_name: string;
}

// ✅ props를 올바르게 타입 지정
interface SnackBarProps {
  nowMessage: INowMessage;
  closeSnackBar: () => void;
}

function SnackBar({ nowMessage, closeSnackBar }: SnackBarProps) {
  return (
    <Container>
      <Participant>
        <Info>
          <img src={nowMessage.profile_img_url} alt="" />
          <span>{nowMessage.user_name}</span>
        </Info>
        <Message>{nowMessage.message}</Message>
      </Participant>
      <Icon onClick={closeSnackBar} className="xi-angle-down-min"></Icon>
    </Container>
  );
}

export default SnackBar;
