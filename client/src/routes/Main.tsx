import styled from 'styled-components';
import SideMenu from '../components/SideMenu';
import { Routes, Route } from 'react-router-dom';
import Friends from './Friends';
import ChatList from './ChatList';
import Banner from '../components/Banner';

const MainContainer = styled.div``;

const Inner = styled.div`
  display: grid;
  grid-template-columns: 58px 1fr;
`;
const ContentBox = styled.div``;
const CloseBox = styled.div`
  display: flex;
  justify-content: right;
  margin: 10px 10px 15px;
  & > i:first-child {
    margin-right: 8px;
  }
  & i {
    font-size: 0.6rem;
  }
`;
const RouteBox = styled.div`
  padding: 0 1px 0 17px;
`;

function Main() {
  return (
    <MainContainer>
      <Inner>
        <SideMenu></SideMenu>
        <ContentBox>
          <CloseBox>
            <i className="xi-minus-thin"></i>
            <i className="xi-close-thin"></i>
          </CloseBox>
          <RouteBox>
            <Routes>
              <Route path="friends" element={<Friends />} />
              <Route path="chatList" element={<ChatList />} />
            </Routes>
          </RouteBox>
        </ContentBox>
      </Inner>
      <Banner></Banner>
    </MainContainer>
  );
}

export default Main;
