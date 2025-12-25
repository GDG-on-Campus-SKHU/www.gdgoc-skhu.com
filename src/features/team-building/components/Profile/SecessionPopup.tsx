import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import Button from '../Button';

interface SecessionPopupProps {
  onConfirm: () => void;
}

export default function SecessionPopup({ onConfirm }: SecessionPopupProps) {
  return (
    <main css={mainCss}>
      <div css={boxCss}>
        <h1 css={titleCss}>탈퇴가 완료되었습니다.</h1>
        <Button title="확인" onClick={onConfirm} />
      </div>
    </main>
  );
}

const mainCss = css`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(4, 4, 5, 0.3);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const boxCss = css`
  width: 500px;
  height: 188px;
  background-color: white;
  padding: 40px 20px 20px 20px;
  border-radius: 12px;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
`;

//font
const titleCss = css`
  color: ${colors.grayscale[1000]};
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  margin-bottom: 40px;
`;
