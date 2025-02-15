import styled from 'styled-components';
import Modal from './Modal';
import { searchUserAxios, addFriendAxios } from '../api/friends';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/auth/atom';
import { IUserAtom } from '../types';
import { useForm } from 'react-hook-form';

const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CloseBtn = styled.i`
  display: flex;
  justify-content: right;
  margin: 10px 10px 0 0;
  font-size: 0.8rem;
  color: #c6c6c6;
`;
const AddBox = styled.div`
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  & > h2 {
    font-size: 0.9rem;
    color: #2b2b2b;
  }
  & input {
    border: 0;
    border-bottom: 1px solid #eaeaea;
    font-size: 0.8rem;
    margin-top: 30px;
    padding: 10px 2px;
    width: 100%;
  }
`;
const SearchResult = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
const FriendProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  & > img {
    width: 70px;
    height: 70px;
    border-radius: 25px;
    object-fit: cover;
    margin-bottom: 12px;
  }
  & > h3 {
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 6px;
  }
  & > span {
    font-size: 0.8rem;
    color: #a6a6a6;
  }
`;
const AddSubmitBtn = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  & > button {
    cursor: pointer;
    color: #000000;
    background-color: #fee500;
    height: 34px;
    border-radius: 2px;
    margin-top: 5px;
    border: 0;
    font-size: 0.8rem;
    width: 80px;
    &:disabled {
      color: #adadad;
      background-color: #f6f6f6;
    }
  }
`;

const ErrorMsg = styled.span`
  font-size: 0.65rem;
  color: #8d8d8d;
  margin-top: 5px;
`;

const SettingInput = styled.div`
  position: relative;
  & > input {
    border: 0;
    border-bottom: 1px solid #000000;
    color: #000;
    font-size: 0.8rem;
    padding: 7px 1px;
    width: 100%;
  }
  & span {
    position: absolute;
    right: 0px;
    bottom: 7px;
    font-size: 0.77rem;
    color: #949391;
  }
`;

interface AddFriendProps {
  handleCloseModal: () => void;
  getFriendList: () => void;
}

function AddFriend({ handleCloseModal, getFriendList }: AddFriendProps) {
  const user = useRecoilValue<IUserAtom>(userState);
  const [keyword, setKeyword] = useState<string>('');
  const [searchUser, setSearchUser] = useState<any>(null);
  const {
    register,
    formState: { isValid, errors },
    reset,
  } = useForm<any>();

  async function getSearchFriends(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = await searchUserAxios(keyword);
    setSearchUser(data.user);
  }

  function getKeywordHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const {
      currentTarget: { value },
    } = event;
    setKeyword(value);
  }

  async function addFriendHandler() {
    const friendId = searchUser.user_id;
    const userId = user.user_id;
    const friendName = searchUser.user_name;
    await addFriendAxios({ friendId, userId, friendName });
    getFriendList();
    handleCloseModal();
    setSearchUser(null);
    reset();
  }
  return (
    <Modal>
      <AddContainer>
        <CloseBtn
          className="xi-close"
          onClick={() => handleCloseModal()}
        ></CloseBtn>
        <AddBox>
          <h2>친구 추가</h2>
          <form onSubmit={getSearchFriends}>
            <SettingInput>
              <input
                {...register('user_email', {
                  required: '친구 이메일 계정을 전체 입력하세요.',
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: '이메일 형식이 아닙니다.',
                  },
                })}
                onChange={getKeywordHandler}
                type="text"
                placeholder="친구 이메일 계정"
                maxLength={30}
              />
              <span>{keyword.length}/30</span>
            </SettingInput>
            <ErrorMsg>
              {errors.user_email && String(errors.user_email?.message)}
            </ErrorMsg>
          </form>
          {searchUser && (
            <SearchResult>
              <FriendProfile>
                <img src={searchUser.profile_img_url} alt="" />
                <h3>{searchUser.user_name}</h3>
                <span>{searchUser.state_msg}</span>
              </FriendProfile>
              <AddSubmitBtn>
                <button
                  onClick={addFriendHandler}
                  disabled={!isValid || !searchUser}
                >
                  친구 추가
                </button>
              </AddSubmitBtn>
            </SearchResult>
          )}
        </AddBox>
      </AddContainer>
    </Modal>
  );
}

export default AddFriend;
