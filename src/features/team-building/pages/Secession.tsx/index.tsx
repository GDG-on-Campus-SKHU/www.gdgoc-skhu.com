import { useState } from 'react';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import Button from '../../components/Button';
import SecessionPopup from '../../components/Profile/SecessionPopup';

export default function SecessionPage() {
  const [click, setClick] = useState(false);
  const [visible, setVisible] = useState(false);
  const toggle = () => setClick(prev => !prev);
  const visibleToggle = () => setVisible(prev => !prev);
  return (
    <main css={mainCss}>
      {visible && <SecessionPopup />}
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'center',
        }}
      >
        <img width={'25%'} src="/icon/redflag.svg" alt="경고" />
        <h1 css={titleCss}>탈퇴하기 전에 확인해주세요.</h1>
        <h2 css={subtitleCss}>
          탈퇴 후에는 다시 복구할 수 없습니다. <br />
          단, 프로젝트 갤러리나 활동 기록에는 이름이 그대로 남습니다.
          <br />
          이는 프로젝트 참여 이력 보존을 위한 것으로,
          <br />
          프로필 정보나 연락처 등 개인 정보는 완전히 삭제됩니다.
          <br />
        </h2>
      </div>

      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
        }}
      >
        <img
          src={click ? '/checkboxedit.svg' : '/checkbox.svg'}
          alt="체크"
          onClick={toggle}
          style={{ cursor: 'pointer' }}
        />
        <p
          css={[
            subtitleCss,
            {
              color: `${colors.grayscale[1000]}`,
            },
          ]}
        >
          안내사항을 확인했습니다.
        </p>
      </div>

      <div css={{ width: '190px' }} onClick={() => visibleToggle()}>
        <Button title="탈퇴하기" disabled={!click} variant="secondary" />
      </div>
    </main>
  );
}

//layout
const mainCss = css`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  flex-direction: column;
  gap: 4rem;
`;

//font
const titleCss = css`
  margin-top: 30px;
  font-size: 50px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  text-align: center;
  color: ${colors.grayscale[1000]};
`;
const subtitleCss = css`
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
  text-align: center;
  color: ${colors.grayscale[700]};
`;
