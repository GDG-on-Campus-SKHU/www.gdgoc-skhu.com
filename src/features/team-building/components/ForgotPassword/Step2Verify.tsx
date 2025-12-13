/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { verifyEmailCode } from '@/lib/auth.api';
import { css } from '@emotion/react';

import { typography } from '../../../../styles/constants/text';
import {
  authStepDesc,
  authStepSection,
  authStepTitle,
  primaryBtn,
} from '../../../../styles/GlobalStyle/AuthStyle';
import Button from '../Button';
import FieldOfAuth from '../FieldOfAuth';

interface Props {
  email: string;
  code: string;
  setCode: (v: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Verify({ email, code, setCode, onNext, onPrev }: Props) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) return;

    try {
      setLoading(true);
      await verifyEmailCode(email, code);
      onNext();
    } catch (err: any) {
      setError(err.response?.data || '인증번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} css={authStepSection}>
      <h2 css={[typography.h2Bold, authStepTitle]}>비밀번호 재설정</h2>
      <p css={[typography.b4, authStepDesc]}>
        인증번호가 발송되었습니다.
        <br />
        받은 메일함을 확인해주세요.
      </p>

      <FieldOfAuth
        placeholder="인증번호 6자리 입력"
        value={code}
        onChange={e => setCode(e.target.value)}
        error={!!error}
        errorMessage={error}
      />

      <div css={buttonBox}>
        <div css={leftBtn}>
          <Button variant="secondary" title="이전" onClick={onPrev} />
        </div>

        <button
          type="submit"
          css={[primaryBtn({ disabled: code.length !== 6 || loading }), rightBtn]}
          disabled={code.length !== 6 || loading}
        >
          다음
        </button>
      </div>
    </form>
  );
}

const buttonBox = css`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  width: 100%;
  align-items: stretch;
`;

const leftBtn = css`
  flex: 1;
  display: flex;

  & > button {
    height: 100%;
  }
`;

const rightBtn = css`
  flex: 2;
`;
