import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useLogout } from '../hooks/useLogout';
import Modal from 'react-modal';
import { useState } from 'react';

const SideMenuContainer = styled.ul`
  background-color: #ededed;
  padding: 30px 0;
  border-right: 1px solid #dfdfdf;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopMenuBox = styled.li`
  & > ul > li {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
    position: relative;
  }
`;
const BottomMenuBox = styled.li`
  & > ul > li {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
    position: relative;
  }
`;

const Count = styled.div`
  position: absolute;
  right: 5px;
  bottom: 10px;
  background-color: #f4551e;
  color: #fff;
  border-radius: 50%;
  font-size: 0.8rem;
  width: 0.9rem;
  text-align: center;
  padding: 2px 0;
`;

const Icon = styled.i<{ isActive: boolean }>`
  font-size: 1.5rem;
  color: ${({ isActive }) => (isActive ? '#5f5f5f' : '#c9c9c9')};
`;

const LogoutIcon = styled.i`
  font-size: 1.5rem;
  color: #c9c9c9;
  cursor: pointer;
  &:hover {
    color: #5f5f5f;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const ModalBtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 30px;
  width: 100%;

  & > button {
    font-size: 0.9rem;
    padding: 10px 30px;
    cursor: pointer;
    border-radius: 10px;
  }
  & > button:first-child {
    border: 1px solid #e4e4e4;
    color: #423630;
  }

  & > button:last-child {
    color: #423630;
    background-color: #fee500;
  }
`;

function SideMenu({ readNotCount }: { readNotCount: number }) {
  const location = useLocation();
  const isFriendsPage = location.pathname === '/friends';
  const isChatListPage = location.pathname === '/chatList';
  const isMorePage = location.pathname === '/more';
  const logout = useLogout();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const customModalStyles: ReactModal.Styles = {
    overlay: {
      backgroundColor: ' rgba(0, 0, 0, 0.4)',
      width: '100%',
      height: '100vh',
      zIndex: '10',
      position: 'fixed',
      top: '0',
      left: '0',
    },
    content: {
      width: '360px',
      height: '180px',
      zIndex: '150',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '10px',
      boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
      backgroundColor: 'white',
      justifyContent: 'center',
      overflow: 'auto',
    },
  };

  const handleLogout = async () => {
    // 모달을 띄워 사용자에게 확인을 요청
    setIsModalOpen(true);
  };
  const handleLogoutConfirm = async () => {
    logout();
  };

  const handleLogoutCancel = () => {
    setIsModalOpen(false); // 모달을 닫기
  };
  return (
    <SideMenuContainer>
      <TopMenuBox>
        <ul>
          <li>
            <Link
              to={{
                pathname: `/friends`,
              }}
            >
              <Icon isActive={isFriendsPage} className="xi-user"></Icon>
            </Link>
          </li>
          <li>
            <Link
              to={{
                pathname: `/chatList`,
              }}
            >
              <Icon isActive={isChatListPage} className="xi-speech"></Icon>
            </Link>
            {readNotCount > 0 && <Count>{readNotCount}</Count>}
          </li>
          {/* <li>
                <Link
                  to={{
                    pathname: `/more`,
                  }}
                >
                  <Icon isActive={isMorePage} className="xi-ellipsis-h" ></Icon>
                </Link>
              </li> */}
        </ul>
      </TopMenuBox>
      <BottomMenuBox>
        <ul>
          <li onClick={handleLogout}>
            <LogoutIcon className="xi-log-out"></LogoutIcon>
          </li>
        </ul>
      </BottomMenuBox>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleLogoutCancel}
        contentLabel="로그아웃 확인"
        style={customModalStyles}
      >
        <ModalContainer>
          <h2>로그아웃 하시겠습니까?</h2>
          <ModalBtnBox>
            <button onClick={handleLogoutCancel}>취소</button>
            <button onClick={handleLogoutConfirm}>확인</button>
          </ModalBtnBox>
        </ModalContainer>
      </Modal>
    </SideMenuContainer>
  );
}

export default SideMenu;
