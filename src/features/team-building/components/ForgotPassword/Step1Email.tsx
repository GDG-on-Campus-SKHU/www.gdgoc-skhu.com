/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { sendEmailCode } from '@/lib/auth.api';
import { css } from '@emotion/react';

import { typography } from '../../../../styles/constants/text';
import {
  authStepDesc,
  authStepSection,
  authStepTitle,
  primaryBtn,
} from '../../../../styles/GlobalStyle/AuthStyle';
import Button from '../Button';
import FieldOfSignUp from '../FieldOfSignUp';

interface Step1EmailProps {
  email: string;
  setEmail: (v: string) => void;
  onNext: () => void;
}

export default function Step1Email({ email, setEmail, onNext }: Step1EmailProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      setLoading(true);
      await sendEmailCode(email);
      onNext();
    } catch (err: any) {
      const msg = err.response?.data;
      setError(msg || '인증번호 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form css={authStepSection} onSubmit={handleSubmit}>
      <h2 css={[typography.h2Bold, authStepTitle]}>비밀번호 재설정</h2>
      <p css={[typography.b4, authStepDesc]}>가입 당시 입력한 이메일 주소를 입력해주세요.</p>

      <FieldOfSignUp
        placeholder="이메일 주소를 입력해주세요."
        value={email}
        onChange={e => setEmail(e.target.value)}
        error={!!error}
        errorMessage={error}
      />

      <div css={buttonBox}>
        <Button variant="secondary" title="이전" onClick={() => history.back()} />
        <button
          css={primaryBtn({ disabled: !email.trim() || loading })}
          disabled={!email.trim() || loading}
          type="submit"
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
  margin-top: 16px;
`;
