import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { participantState, userState } from '../recoil/auth/atom';
import { getUserAxios } from '../api/auth';
import { IUserAtom, ChatRoom } from '../types';
import { getFriendsListAxios } from '../api/friends';
import { handleClick } from '../utils';
import { enterRoomAxios, getChatRoomInfoAxios } from '../api/chatting';
import ChattingRoom from '../components/ChattingRoom';
import Profile from '../components/Profile';
import ProfileSetting from '../components/ProfileSetting';
import AddFriend from '../components/AddFriend';

const Container = styled.div``;
const TitleBox = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 18px 10px 0;
`;
const ContentBox = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  margin-left: -17px;
  padding-left: 17px;
  /* height: 504px; */

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
const AddFriends = styled.li`
  cursor: pointer;
`;
const MyInfo = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  margin-left: -17px;
  padding: 7px 7px 7px 17px;
  flex-grow: 1;
  background-color: #ededed;
  margin: 10px 0 10px -17px;
  background-color: ${(props) =>
    props.$isSelected ? '#ededed' : 'transparent'};
  &:hover {
    background-color: #f5f5f5;
  }
  & > img {
    width: 50px;
    height: 50px;
    border-radius: 20px;
    margin-right: 10px;
    object-fit: cover;
    cursor: pointer;
  }
`;

const UserName = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
`;

const FriendsBox = styled.div`
  padding-top: 15px;
`;

const FriendCount = styled.div`
  color: #7a7a7a;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  & > h2 {
    margin-right: 7px;
  }
  span {
    font-size: 0.65rem;
  }
`;
const FriendListBox = styled.ul``;
const FriendList = styled.li<{ $isSelected: boolean }>`
  margin-left: -17px;
  display: flex;
  align-items: center;
  padding: 7px 7px 7px 17px;
  background-color: ${(props) =>
    props.$isSelected ? '#ededed' : 'transparent'};
  &:hover {
    background-color: #f5f5f5;
  }
  & img {
    width: 50px;
    height: 50px;
    border-radius: 18px;
    object-fit: cover;
    margin-right: 10px;
  }
`;

const StateMsg = styled.div`
  font-size: 0.65rem;
  margin-top: 7px;
`;

const Line = styled.hr`
  width: 98%;
  border: 0px;
  border-top: 1px solid #ededed;
  margin: 0;
`;

function Friends({ socket }: any) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [user, setUser] = useRecoilState<IUserAtom>(userState);
  const [friends, setFriends] = useState<any>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const setParticipant = useSetRecoilState<ChatRoom>(participantState);

  useEffect(() => {
    getUserInfo();
    getFriendList();
  }, []);

  async function getUserInfo() {
    try {
      const { data } = await getUserAxios(user.access_token);
      setUser(data);
    } catch (error) {
      console.error('유저 정보 조회 실패:', error);
    }
  }

  async function getFriendList() {
    try {
      const { data } = await getFriendsListAxios(user.user_id);
      setFriends(data);

    } catch (error) {
      console.error('친구 목록 조회 실패:', error);
    }
  }

  function handleOpenModal(modalType: string) {
    setOpenModal(modalType); // 특정 모달 열기
  }

  function handleCloseModal() {
    setOpenModal(null); // 모든 모달 닫기
  }

  function friendListClick(id: number) {
    setSelectedFriendId(id);
  }
  async function friendListDbClick(friendId: number) {
    const users = [user.user_id, friendId];
    const {
      data: { room_id },
    } = await enterRoomAxios(users);
    const { data: roomInfo } = await getChatRoomInfoAxios(
      user.user_id,
      room_id
    );
    setParticipant(roomInfo);
    handleOpenModal('chatting');
  }

  async function chatToMe() {
    const {
      data: { room_id },
    } = await enterRoomAxios([user.user_id]);

    const { data: roomInfo } = await getChatRoomInfoAxios(
      user.user_id,
      room_id
    );
    setParticipant(roomInfo);
    handleOpenModal('chatting');
  }

  return (
    <Container>
      <TitleBox>
        <h1>친구</h1>
        <TopMenu>
          {/* <li>
            <i className="xi-search"></i>
          </li> */}
          <AddFriends onClick={() => handleOpenModal('addFriend')}>
            <i className="xi-user-plus-o"></i>
          </AddFriends>
        </TopMenu>
      </TitleBox>
      <ContentBox>
        <Line />
        <MyInfo
          $isSelected={selectedFriendId === user.user_id}
          onClick={(e) =>
            handleClick(
              e,
              () => friendListClick(user.user_id),
              () => chatToMe()
            )
          }
        >
          <img
            onClick={() => handleOpenModal('profile')}
            src={user.profile_img_url}
            alt=""
          />
          <div>
            <UserName>{user.user_name}</UserName>
            <StateMsg>{user.state_msg}</StateMsg>
          </div>
        </MyInfo>
        <Line />
        <FriendsBox>
          <FriendCount>
            <h2>친구</h2>
            <span>{friends ? friends.length : 0}</span>
          </FriendCount>
          <FriendListBox>
            {friends?.map((fr: any) => (
              <FriendList
                $isSelected={selectedFriendId === fr.friend_id}
                onClick={(e) =>
                  handleClick(
                    e,
                    () => friendListClick(fr.friend_id),
                    () => friendListDbClick(fr.friend_id)
                  )
                }
                key={fr.id}
              >
                <img
                  onClick={() => handleOpenModal('FriendProfile')}
                  src={fr.profile_img_url}
                  alt=""
                />
                <div>
                  <UserName>{fr.friend_name}</UserName>
                  <StateMsg>{fr.state_msg}</StateMsg>
                </div>
              </FriendList>
            ))}
          </FriendListBox>
        </FriendsBox>
      </ContentBox>

      {/* 친구추가 */}
      {openModal === 'addFriend' && (
        <AddFriend
          handleCloseModal={handleCloseModal}
          getFriendList={getFriendList}
        ></AddFriend>
      )}

      {/* 프로필 상세 */}
      {openModal === 'profile' && (
        <Profile
          handleCloseModal={handleCloseModal}
          handleOpenModal={handleOpenModal}
          chatToMe={chatToMe}
        ></Profile>
      )}

      {/* 프로필 설정 */}
      {openModal === 'profileSetting' && (
        <ProfileSetting
          handleCloseModal={handleCloseModal}
          getUserInfo={getUserInfo}
        ></ProfileSetting>
      )}

      {/* 채팅창 */}
      {openModal === 'chatting' && (
        <ChattingRoom
          handleCloseModal={handleCloseModal}
          socket={socket}
        ></ChattingRoom>
      )}
    </Container>
  );
}

export default Friends;
