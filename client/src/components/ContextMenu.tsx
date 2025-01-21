import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

type ContextMenuOption = {
  label: string;
  onClick: () => void;
};

type ContextMenuProps = {
  top: number;
  left: number;
  options: ContextMenuOption[];
  onClose: () => void;
};

const MenuContainer = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  z-index: 1000;
  padding: 2px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 150px;
  border: 1px solid #b3b3b3;
`;

const MenuItem = styled.div`
  padding: 7px;
  font-size: 0.65rem;
  margin: 0 -10px;
  cursor: pointer;
  &:hover {
    background-color: #dddddd;
  }
`;

function ContextMenu({ top, left, options, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 외부 클릭 감지하여 메뉴 닫기
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      onClose(); // 메뉴 닫기
    }
  };

  useEffect(() => {
    setIsMounted(true);

    // 컴포넌트 마운트 시 클릭 이벤트 리스너 추가
    document.addEventListener('click', handleClickOutside);

    return () => {
      // 컴포넌트 언마운트 시 클릭 이벤트 리스너 제거
      setIsMounted(false);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      // 메뉴가 열려 있을 때만 'contextmenu' 이벤트 리스너 추가
      document.addEventListener('contextmenu', handleClickOutside);
    } else {
      document.removeEventListener('contextmenu', handleClickOutside);
    }

    return () => {
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [isMounted]); // isMounted 상태가 변경될 때마다 실행

  return (
    <MenuContainer ref={menuRef} top={top} left={left}>
      {options.map((option, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            option.onClick();
            onClose(); // 메뉴 선택 후 닫기
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </MenuContainer>
  );
}

export default ContextMenu;
