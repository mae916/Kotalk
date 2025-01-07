import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { IUser } from '../types';
import { loginAxios } from '../api/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userDataState } from '../recoil/auth/atom';
import { getSocket } from '../sockets/socket';
import { useEffect, useState } from 'react';

const LoginContainer = styled.div`
  position: relative;
  padding: 10px;
  background-color: #fee500;
  height: 100%;
`;
const Header = styled.div`
  display: flex;
  justify-content: right;
  & > i:first-child {
    margin-right: 8px;
  }
  & i {
    font-size: 0.8rem;
  }
`;
const LogoBox = styled.div`
  text-align: center;
  margin: 50px 0 30px;
  & > i {
    font-size: 7rem;
    color: #423630;
  }
`;
const FormBox = styled.section`
  width: 70%;
  margin: 0 auto;
  & * {
    font-size: 1rem;
  }
  & > form {
    display: flex;
    flex-direction: column;
  }
  & input {
    border: 1px solid #e4ce00;
    height: 40px;
    padding: 10px;
  }
  & input[type='text'] {
    border-bottom: 01px solid #f5f5f5;
  }
  & input[type='password'] {
    border-top: 0;
  }
`;
const SubmitBtn = styled.button`
  color: #f5f5f5;
  background-color: #423630;
  height: 40px;
  border-radius: 3px;
  margin-top: 5px;
  &:disabled {
    color: #adadad;
    border: 1px solid #e4ce00;
    background-color: #f6f6f6;
  }
`;
const Line = styled.div`
  position: relative;
  margin-top: 20px;
  text-align: center;
  font-size: 0.8rem;
  &:before,
  &:after {
    position: absolute;
    content: '';
    display: block;
    width: 40%;
    height: 1px;
    background-color: #f1d900;
    top: 5px;
  }
  &:before {
    left: 3px;
  }
  &:after {
    right: 3px;
  }
`;
const SnsLogin = styled.ul``;
const AutoLogin = styled.div`
  display: flex;
  align-items: center;
  & > input[type='radio'] {
    margin: 0;
    margin-right: 5px;
    width: 1rem;
  }
  & span {
    font-size: 0.8rem;
  }
`;
const JoinBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translate(-50%, 0%);
  color: #625800;
  width: 100%;
`;

const VerticalLine = styled.div`
  margin: 0 7px 0 10px;
  font-size: 0.65rem;
`;

function Login() {
  const setUserData = useSetRecoilState(userDataState);
  const [socket, setSocket] = useState<any>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<IUser>();

  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);
  }, []);

  async function loginHandler(data: any) {
    const datas = await loginAxios(data);
    setUserData(datas.data);
    socket.emit('login_user', datas.data.user_id);
    navigate('/friends');
  }

  return (
    <LoginContainer>
      <Header>
        <i className="xi-minus-thin"></i>
        <i className="xi-close-thin"></i>
      </Header>
      <LogoBox>
        <i className="xi-kakaotalk"></i>
      </LogoBox>
      <FormBox>
        <form onSubmit={handleSubmit(loginHandler)}>
          <input
            {...register('user_email', {
              required: true,
              validate: (value) => (value.trim().length >= 1 ? true : false),
            })}
            type="text"
            placeholder="이메일계정"
          />
          <input
            {...register('password', {
              required: true,
              validate: (value) => (value.trim().length >= 1 ? true : false),
            })}
            type="password"
            placeholder="비밀번호"
          />

          <SubmitBtn disabled={!isValid}>로그인</SubmitBtn>
        </form>
        <Line>또는</Line>
        <SnsLogin>
          <li></li>
        </SnsLogin>
        <AutoLogin>
          <input type="radio" />
          <span>자동로그인</span>
        </AutoLogin>
      </FormBox>
      <JoinBox>
        <div>
          <Link to="/join">회원가입하기</Link>
        </div>
        <VerticalLine>|</VerticalLine>
        <div>계정 / 비밀번호 찾기</div>
      </JoinBox>
    </LoginContainer>
  );
}

export default Login;
