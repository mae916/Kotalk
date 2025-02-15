import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useLogout } from '../hooks/useLogout';

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
    height: 50px;
    position: relative;
  }
`;
const BottomMenuBox = styled.li`
  & > ul > li {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
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

function SideMenu({ readNotCount }: { readNotCount: number }) {
  const location = useLocation();
  const isFriendsPage = location.pathname === '/friends';
  const isChatListPage = location.pathname === '/chatList';
  const isMorePage = location.pathname === '/more';
  const logout = useLogout();
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
          <li onClick={logout}>
            <LogoutIcon className="xi-log-out"></LogoutIcon>
          </li>
        </ul>
      </BottomMenuBox>
    </SideMenuContainer>
  );
}

export default SideMenu;
