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
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    title: string;
    message: string;
    onClose: () => void;
  } | null>(null);

  const isValidPassword = (value: string) => value.length >= 8 && /[!@#$%^&*]/.test(value);

  const passwordRuleError =
    pw !== '' && !isValidPassword(pw) ? '8자 이상, 특수문자가 포함된 비밀번호를 입력해주세요.' : '';

  const passwordMatchError =
    pw2 !== '' && isValidPassword(pw) && pw !== pw2 ? '비밀번호가 일치하지 않습니다.' : '';

  const isSubmitDisabled = !pw || !pw2 || !isValidPassword(pw) || pw !== pw2 || loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    try {
      setLoading(true);
      await resetPassword(email, code, pw);
      setModal({
        title: '비밀번호 재설정 완료',
        message: '비밀번호가 성공적으로 변경되었습니다.\n다시 로그인해주세요.',
        onClose: () => {
          setModal(null);
          router.push('/login');
        },
      });
    } catch (err: any) {
      const status = err?.response?.status;
      setModal({
        title: '비밀번호 재설정 실패',
        message:
          status === 400
            ? '인증번호가 만료되었거나 유효하지 않습니다.\n다시 시도해주세요.'
            : '알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
        onClose: () => setModal(null),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} css={authStepSection}>
        <h2 css={[typography.h2Bold, authStepTitle]}>비밀번호 재설정</h2>
        <p css={[typography.b4, authStepDesc]}>새로운 비밀번호를 설정해주세요.</p>

        <div css={fieldBlockWithGap}>
          <FieldOfAuth
            label="새 비밀번호"
            type="password"
            placeholder="8자 이상, 특수문자 포함"
            value={pw}
            onChange={e => setPw(e.target.value)}
            error={pw !== '' && !isValidPassword(pw)}
          />
          {passwordRuleError && <p css={errorText}>{passwordRuleError}</p>}
        </div>

        <div css={fieldBlock}>
          <FieldOfAuth
            label="새 비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요."
            value={pw2}
            onChange={e => setPw2(e.target.value)}
            error={pw2 !== '' && isValidPassword(pw) && pw !== pw2}
          />
          {passwordMatchError && <p css={errorText}>{passwordMatchError}</p>}
        </div>

        {error && <p css={errorText}>{error}</p>}

        <div css={buttonBox}>
          <div css={leftBtn}>
            <Button variant="secondary" title="이전" onClick={onPrev} />
          </div>

          <button
            type="submit"
            css={[primaryBtn({ disabled: isSubmitDisabled }), rightBtn]}
            disabled={isSubmitDisabled}
          >
            완료
          </button>
        </div>
      </form>

      {modal && (
        <Modal
          type="default"
          title={modal.title}
          message={modal.message}
          buttonText="확인"
          onClose={modal.onClose}
        />
      )}
    </>
  );
}

const fieldBlock = css`
  margin-bottom: 4px;
`;

const fieldBlockWithGap = css`
  margin-bottom: 16px;
`;

const errorText = css`
  color: #ea4335;
  font-size: 13px;
  margin-top: -6px;
  line-height: 1.4;
`;

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

const errorText = css`
  color: red;
  font-size: 14px;
  margin-top: 8px;
`;
