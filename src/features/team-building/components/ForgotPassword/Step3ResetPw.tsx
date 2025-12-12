/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { resetPassword } from '@/lib/auth.api';
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
import Modal from '../Modal';

interface Props {
  email: string;
  code: string;
  onPrev: () => void;
}

export default function Step3ResetPw({ email, code, onPrev }: Props) {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pw.length < 8 || !/[!@#$%^&*]/.test(pw)) {
      setError('8자 이상, 특수문자를 포함한 비밀번호를 입력해주세요.');
      return;
    }

    if (pw !== pw2) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, code, pw);
      setShowModal(true);
    } catch (err: any) {
      setError(err.response?.data || '비밀번호 재설정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push('/login');
  };

  return (
    <>
      <form onSubmit={handleSubmit} css={authStepSection}>
        <h2 css={[typography.h2Bold, authStepTitle]}>비밀번호 재설정</h2>
        <p css={[typography.b4, authStepDesc]}>새로운 비밀번호를 설정해주세요.</p>

        <FieldOfAuth
          label="새 비밀번호"
          type="password"
          placeholder="새로운 비밀번호를 입력해주세요."
          value={pw}
          onChange={e => setPw(e.target.value)}
        />

        <FieldOfAuth
          label="새 비밀번호 확인"
          type="password"
          placeholder="새로운 비밀번호를 다시 입력해주세요."
          value={pw2}
          onChange={e => setPw2(e.target.value)}
        />

        {error && <p css={errorText}>{error}</p>}

        <div css={buttonBox}>
          <Button variant="secondary" title="이전" onClick={onPrev} />
          <button
            css={primaryBtn({ disabled: !pw || !pw2 || loading })}
            disabled={!pw || !pw2 || loading}
            type="submit"
          >
            완료
          </button>
        </div>
      </form>

      {showModal && (
        <Modal
          type="default"
          title="비밀번호 재설정 완료"
          message="비밀번호가 성공적으로 변경되었습니다.\n다시 로그인해주세요."
          buttonText="확인"
          onClose={handleModalClose}
        />
      )}
    </>
  );
}

const buttonBox = css`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const errorText = css`
  color: red;
  font-size: 14px;
  margin-top: 8px;
`;
