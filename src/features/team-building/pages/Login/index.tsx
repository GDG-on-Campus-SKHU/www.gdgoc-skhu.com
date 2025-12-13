/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { login } from '@/lib/auth.api';
import { useAuthStore } from '@/lib/authStore';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants/colors';
import { typography } from '../../../../styles/constants/text';
import Button from '../../../team-building/components/Button';
import FieldOfLogin from '../../../team-building/components/FieldOfLogin';
import Modal from '../../../team-building/components/Modal';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'pending' | 'banned' | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setTimeout(() => setVisible(true), 30);
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      const res = await login(email, password);
      const { accessToken, email: userEmail, name, role } = res.data;
      setAuth({ accessToken, email: userEmail, name, role });
      router.push('/home');
    } catch (err: any) {
      const msg = err.response?.data;

      if (err.response?.status === 400 && msg === '관리자 승인 대기 중입니다.') {
        setModalType('pending');
        setShowModal(true);
        return;
      }

      if (err.response?.status === 403 || msg === '로그인 제한된 계정입니다.') {
        setModalType('banned');
        setShowModal(true);
        return;
      }

      setError(msg || '이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <main css={mainCss(visible)}>
      <LoginForm
        email={email}
        password={password}
        error={error}
        onEmailChange={e => setEmail(e.target.value)}
        onPasswordChange={e => setPassword(e.target.value)}
        onSubmit={handleSubmit}
      />

      {showModal && (
        <Modal
          title={modalType === 'pending' ? '승인 대기 중' : '로그인 제한'}
          message={
            modalType === 'pending'
              ? '아직 관리자의 승인이 되지 않았습니다.\n관리자의 승인 후 로그인 가능합니다.'
              : '현재 로그인이 제한된 계정입니다.\n관리자에게 문의해주세요.'
          }
          subText={modalType === 'banned' ? 'gdsc@gmail.com' : undefined}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}

interface LoginFormProps {
  email: string;
  password: string;
  error: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function LoginForm({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} css={formCss}>
      <h1 css={[typography.h2Bold, titleCss]}>로그인</h1>

      <div css={fieldGroupCss}>
        <FieldOfLogin
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
          hasError={!!error}
        />
        <FieldOfLogin
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          hasError={!!error}
        />
        <div css={helperRowCss}>
          <p css={errorCss}>{error}</p>
          <Link href="/forgot-password" css={forgotPasswordCss}>
            비밀번호 찾기
          </Link>
        </div>
      </div>

      <div css={buttonGroupCss}>
        <Button type="submit" title="로그인" />
        <Link href="/signup">
          <Button variant="secondary" title="회원가입" />
        </Link>
      </div>
    </form>
  );
}

const mainCss = (visible: boolean) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(22px);
  opacity: ${visible ? 1 : 0};
  transform: ${visible ? 'translateY(0)' : 'translateY(10px)'};
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
`;

const formCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 40px;
  border-radius: 12px;
  background: ${colors.white};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
`;

const titleCss = css`
  margin-bottom: 23px;
  text-align: center;
`;

const fieldGroupCss = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const helperRowCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;

const errorCss = css`
  color: ${colors.point.red};
  font-size: 14px;
`;

const forgotPasswordCss = css`
  font-size: 13px;
  color: ${colors.grayscale[700]};
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  &:hover {
    color: ${colors.grayscale[900]};
  }
`;

const buttonGroupCss = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  width: 100%;
  margin-top: 36px;
`;
