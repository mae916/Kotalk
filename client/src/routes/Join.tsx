import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { IUser } from '../types';
import { joinAxios, emailCheckAxios } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 10px;
  background-color: #ededed;
  height: 100%;
`;

const LogoBox = styled.div`
  cursor: pointer;
  text-align: center;
  margin: 10px;
  & > i {
    font-size: 7rem;
    color: #423630;
  }
`;

const ContentBox = styled.div`
  margin: 0 50px;
  & > form {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    label {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      font-size: 0.9rem;
      input {
        border: 1px solid #e0e0e0;
        height: 35px;
        padding: 10px;
        margin-top: 4px;
        font-size: 0.8rem;
      }
    }
  }
`;

const SubmitBtn = styled.button`
  color: #423630;
  background-color: #fae100;
  height: 45px;
  border-radius: 3px;
  margin-top: 50px;
  font-size: 0.9rem;
  border: 0;
`;

const ErrorMsg = styled.span`
  font-size: 0.65rem;
  color: #8d8d8d;
  margin-top: 5px;
`;

function Join() {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    watch,
  } = useForm<IUser>();
  const navigate = useNavigate();

  async function joinHandler(data: any) {
    await joinAxios(data);
    alert('회원가입이 완료 되었습니다🎉');
    goLogin();
  }

  async function checkEmailHandler(value: string) {
    const message = emailCheckAxios(value);
    return message;
  }

  function goLogin() {
    navigate('/login');
  }
  return (
    <Container>
      <LogoBox onClick={goLogin}>
        <i className="xi-kakaotalk"></i>
      </LogoBox>
      <ContentBox>
        <form onSubmit={handleSubmit(joinHandler)}>
          <label>
            <span>이메일 계정</span>
            <input
              {...register('user_email', {
                required: '이메일 계정을 입력하세요.',
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: '이메일 형식이 아닙니다.',
                },
                validate: { checkEmailHandler },
              })}
              type="text"
            />
            <ErrorMsg>{errors.user_email?.message}</ErrorMsg>
          </label>
          <label>
            <span>비밀번호</span>
            <input
              {...register('password', {
                required: '비밀번호를 입력하세요.',
                minLength: {
                  value: 4,
                  message: '비밀번호는 4자 이상이여야 합니다,',
                },
              })}
              type="password"
            />
            <ErrorMsg>{errors.password?.message}</ErrorMsg>
          </label>
          <label>
            <span>비밀번호 재확인</span>
            <input
              {...register('password2', {
                required: '비밀번호를 다시 입력하세요.',
                validate: (value) =>
                  value === watch('password') ||
                  '비밀번호가 일치하지 않습니다.',
              })}
              type="password"
            />
            <ErrorMsg>{errors.password2?.message}</ErrorMsg>
          </label>
          <label>
            <span>이름</span>
            <input
              {...register('user_name', {
                required: '이름을 입력하세요.',
              })}
              type="text"
            />
            <ErrorMsg>{errors.user_name?.message}</ErrorMsg>
          </label>
          <SubmitBtn>회원가입</SubmitBtn>
        </form>
      </ContentBox>
    </Container>
  );
}

export default Join;
