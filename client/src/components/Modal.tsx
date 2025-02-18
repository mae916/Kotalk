import styled from 'styled-components';
import { IModal } from '../types';

import ReactDOM from 'react-dom';

const ModalContainer = styled.div`
  background: #afafaf8d;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
`;

const Content = styled.div`
  z-index: 10;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 50%;
  height: 80%;
  background-color: #ffffff;
  box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    width: 80%;
    height: 80%;
  }

  @media (min-width: 1000px) {
    width: 70%;
  }

  /* 1200px 이상일 때 (일반 모니터 사이즈 기준) */
  @media (min-width: 1200px) {
    width: 30%;
  }
`;

function Modal({ children }: IModal) {
  return ReactDOM.createPortal(
    <ModalContainer>
      <Content>{children}</Content>
    </ModalContainer>,
    document.getElementById('modal-root') as HTMLElement
  );
}
export default Modal;
