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
`;

const Content = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 80%;
  min-height: 50%;
  max-height: 80%;
  background-color: #ffffff;
  box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.5);
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
