import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants/colors';
import { typography } from '../../../../styles/constants/text';
import { primaryBtn, step1Desc } from '../../../../styles/GlobalStyle/SignUpStyle';
import type { Step } from '../../../team-building/pages/SignUp/index';
import Button2 from '../Button2';
import FieldOfSignUp from '../FieldOfSignUp';

interface Step2Props {
  visible: boolean;
  step: Step;
  name: string;
  email: string;
  pw: string;
  pw2: string;
  phone: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPw: (v: string) => void;
  setPw2: (v: string) => void;
  setPhone: (v: string) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrev: () => void;
  touched: boolean;
  setTouched: (v: boolean) => void;
  currentStep: Step;
  isDisabled: boolean;
}

export default function Step2({
  visible,
  step,
  name,
  email,
  pw,
  pw2,
  phone,
  setName,
  setEmail,
  setPw,
  setPw2,
  setPhone,
  errors,
  onNext,
  onPrev,
  touched,
  setTouched,
  currentStep,
  isDisabled,
}: Step2Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.body.style.overflow = currentStep === 2 ? 'auto' : 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [currentStep]);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 1000);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  return (
    <section css={sectionCss(visible, step, isMobile)}>
      <header css={headerCss}>
        <h2 css={[typography.h2Bold, titleCss]}>회원가입</h2>
        <span css={stepCountCss}>1/2</span>
      </header>

      <p css={[typography.b4, step1Desc]}>가입 정보를 입력해주세요.</p>

      <div css={formBox}>
        <FieldOfSignUp
          label="이름"
          placeholder="이름을 입력해주세요."
          value={name}
          onChange={e => {
            if (!touched) setTouched(true);
            setName(e.target.value);
          }}
          error={touched && !!errors.name}
          errorMessage={touched ? errors.name : ''}
        />

        <FieldOfSignUp
          label="이메일"
          placeholder="이메일 주소를 입력해주세요."
          value={email}
          onChange={e => {
            if (!touched) setTouched(true);
            setEmail(e.target.value);
          }}
          error={touched && !!errors.email}
          errorMessage={
            touched ? errors.email : '주로 사용하는 연락 가능한 이메일 주소를 작성해주세요.'
          }
        />

        <FieldOfSignUp
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={pw}
          onChange={e => {
            if (!touched) setTouched(true);
            setPw(e.target.value);
          }}
          error={touched && !!errors.pw}
          errorMessage={touched ? errors.pw || '8자리 이상, 특수문자 포함' : ''}
        />

        <FieldOfSignUp
          label="비밀번호 재입력"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요."
          value={pw2}
          onChange={e => {
            if (!touched) setTouched(true);
            setPw2(e.target.value);
          }}
          error={touched && !!errors.pw2}
          errorMessage={touched ? errors.pw2 || '' : ''}
        />

        <FieldOfSignUp
          label="전화번호"
          placeholder="- 포함 전화번호 입력"
          value={phone}
          onChange={e => {
            if (!touched) setTouched(true);
            setPhone(e.target.value);
          }}
          error={touched && !!errors.phone}
          errorMessage={touched ? errors.phone || '' : ''}
        />
      </div>

      <div css={buttonBox}>
        <Button2 title="이전" onClick={onPrev} />
        <button css={primaryBtn({ disabled: isDisabled })} onClick={onNext} disabled={isDisabled}>
          다음
        </button>
      </div>
    </section>
  );
}

const headerCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const titleCss = css`
  color: ${colors.black};
  font-size: 28px;
  font-weight: 700;
`;

const stepCountCss = css`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.grayscale[600]};
`;

const formBox = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 32px;
`;

const buttonBox = css`
  display: flex;
  gap: 12px;
`;

export const sectionCss = (visible: boolean, step: Step, isMobile: boolean) => css`
  width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.08);
  padding: 36px 36px 48px;
  margin-top: ${step === 2 ? (isMobile ? '130px' : '110px') : '0'};
  margin-bottom: ${step === 2 ? (isMobile ? '330px' : '160px') : '0'};
  transform: ${visible ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 4px;
  min-height: fit-content;
  height: auto;
  max-width: 90vw;
`;
