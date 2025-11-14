/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useRouter } from 'next/router';
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
  onPrev: () => void;
  onComplete: () => void;
}

export default function Step3ResetPw({ email: _email, onPrev, onComplete: _ }: Props) {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [formatError, setFormatError] = useState('');
  const [mismatchError, setMismatchError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormatError('');
    setMismatchError('');

    let hasError = false;

    if (pw.length < 8 || !/[!@#$%^&*]/.test(pw)) {
      setFormatError('8자 이상, 특수문자가 포함된 비밀번호를 입력해주세요.');
      hasError = true;
    }

    if (pw !== pw2) {
      setMismatchError('비밀번호가 일치하지 않습니다.');
      hasError = true;
    }

    if (hasError) return;

    if (pw === '12341234!') {
      setShowModal(true);
      return;
    }

    setFormatError('비밀번호 변경 중 오류가 발생했습니다.');
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
          error={!!formatError}
          errorMessage={formatError}
          helperText="8자리 이상, 특수문자 포함"
        />

        <FieldOfAuth
          label="새 비밀번호 확인"
          type="password"
          placeholder="새로운 비밀번호를 다시 입력해주세요."
          value={pw2}
          onChange={e => setPw2(e.target.value)}
          error={!!mismatchError}
          errorMessage={mismatchError}
        />

        <div css={buttonBox}>
          <Button variant="secondary" title="이전" onClick={onPrev} />
          <button css={primaryBtn({ disabled: !pw || !pw2 })} disabled={!pw || !pw2} type="submit">
            완료
          </button>
        </div>
      </form>

      {showModal && (
        <Modal
          type="default"
          title="비밀번호 재설정 완료"
          message={`비밀번호 재설정이 완료되었습니다.\n새롭게 로그인해주세요.`}
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
