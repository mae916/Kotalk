import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SideMenuContainer = styled.ul`
  background-color: #ededed;
  padding: 30px 0;
  border-right: 1px solid #dfdfdf;
  & li {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    & i {
      font-size: 1.5rem;
    }
  }
`;

function SideMenu() {
  const location = useLocation();
  const isFriendsPage = location.pathname === '/friends';
  const isChatListPage = location.pathname === '/chatList';
  const isMorePage = location.pathname === '/more';
  return (
    <SideMenuContainer>
      <li>
        <Link
          to={{
            pathname: `/friends`,
          }}
        >
          {isFriendsPage ? (
            <i className="xi-user" style={{ color: '#5f5f5f' }}></i>
          ) : (
            <i className="xi-user" style={{ color: '#c9c9c9' }}></i>
          )}
        </Link>
      </li>
      <li>
        <Link
          to={{
            pathname: `/chatList`,
          }}
        >
          {isChatListPage ? (
            <i className="xi-speech" style={{ color: '#5f5f5f' }}></i>
          ) : (
            <i className="xi-speech" style={{ color: '#c9c9c9' }}></i>
          )}
        </Link>
      </li>
      <li>
        <Link
          to={{
            pathname: `/more`,
          }}
        >
          {isMorePage ? (
            <i className="xi-ellipsis-h" style={{ color: '#5f5f5f' }}></i>
          ) : (
            <i className="xi-ellipsis-h" style={{ color: '#c9c9c9' }}></i>
          )}
        </Link>
      </li>
    </SideMenuContainer>
  );
}

export default SideMenu;
