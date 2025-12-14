import { useRouter } from 'next/router';
import { css } from '@emotion/react';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main css={wrapper}>
      <div css={card}>
        <h1 css={title}>페이지를 찾을 수 없습니다</h1>
        <p css={desc}>
          요청하신 페이지가 존재하지 않거나
          <br />
          주소가 잘못 입력되었습니다.
        </p>

        <div css={buttonGroup}>
          <button css={button} onClick={() => router.back()}>
            이전 페이지
          </button>
          <button css={button} onClick={() => router.push('/')}>
            홈으로 이동
          </button>
        </div>
      </div>
    </main>
  );
}

const wrapper = css`
  min-height: calc(100vh - 60px - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15vh;
`;

const card = css`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 48px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const title = css`
  font-size: 32px;
  font-weight: 700;
`;

const desc = css`
  margin-top: 12px;
  font-size: 16px;
  color: #555;
  line-height: 1.6;
`;

const buttonGroup = css`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 28px;
`;

const button = css`
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
`;
