import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants/colors';
import { typography } from '../../../../styles/constants/text';
import { step1Desc } from '../../../../styles/GlobalStyle/AuthStyle';
import type { Step } from '../../../team-building/pages/SignUp/index';
import Button from '../Button';
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
  onNext: () => void;
  onPrev: () => void;
  currentStep: Step;
}

type TouchedFields = {
  name: boolean;
  email: boolean;
  pw: boolean;
  pw2: boolean;
  phone: boolean;
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

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
  onNext,
  onPrev,
  currentStep,
}: Step2Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    email: false,
    pw: false,
    pw2: false,
    phone: false,
  });

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

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!/^[a-zA-Z가-힣]{2,5}$/.test(name)) {
      newErrors.name = '이름은 2~5자의 한글 또는 영문만 입력 가능합니다.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '이메일 형식이 올바르지 않습니다.';
    }

    if (pw.length < 8) {
      newErrors.pw = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) {
      newErrors.pw = '비밀번호에 특수문자를 포함해야 합니다.';
    }

    if (pw2 && pw !== pw2) {
      newErrors.pw2 = '비밀번호가 일치하지 않습니다.';
    }

    if (!/^010-\d{4}-\d{4}$/.test(phone)) {
      newErrors.phone = '전화번호 형식이 올바르지 않습니다.';
    }

    setErrors(newErrors);
  }, [name, email, pw, pw2, phone]);

  const handleNext = () => {
    setTouched({
      name: true,
      email: true,
      pw: true,
      pw2: true,
      phone: true,
    });

    if (Object.keys(errors).length === 0) {
      onNext();
    }
  };

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
            setTouched(v => ({ ...v, name: true }));
            setName(e.target.value);
          }}
          error={touched.name && !!errors.name}
          errorMessage={touched.name ? errors.name : ''}
        />

        <FieldOfSignUp
          label="이메일"
          placeholder="이메일 주소를 입력해주세요."
          value={email}
          onChange={e => {
            setTouched(v => ({ ...v, email: true }));
            setEmail(e.target.value);
          }}
          error={touched.email && !!errors.email}
          errorMessage={
            touched.email ? errors.email : '주로 사용하는 연락 가능한 이메일 주소를 작성해주세요.'
          }
        />

        <FieldOfSignUp
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={pw}
          onChange={e => {
            setTouched(v => ({ ...v, pw: true }));
            setPw(e.target.value);
          }}
          error={touched.pw && !!errors.pw}
          errorMessage={touched.pw ? errors.pw || '8자리 이상, 특수문자 포함' : ''}
        />

        <FieldOfSignUp
          label="비밀번호 재입력"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요."
          value={pw2}
          onChange={e => {
            setTouched(v => ({ ...v, pw2: true }));
            setPw2(e.target.value);
          }}
          error={touched.pw2 && !!errors.pw2}
          errorMessage={touched.pw2 ? errors.pw2 || '' : ''}
        />

        <FieldOfSignUp
          label="전화번호"
          placeholder="- 포함 전화번호 입력"
          value={phone}
          onChange={e => {
            setTouched(v => ({ ...v, phone: true }));
            setPhone(formatPhone(e.target.value));
          }}
          error={touched.phone && !!errors.phone}
          errorMessage={touched.phone ? errors.phone || '010-1234-5678 형식' : ''}
          hideHelperOnValue
        />
      </div>

      <div css={buttonBox}>
        <div css={leftBtn}>
          <Button variant="secondary" title="이전" onClick={onPrev} />
        </div>

        <div css={rightBtn}>
          <Button title="다음" onClick={handleNext} />
        </div>
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
  margin-bottom: 26px;
`;

const buttonBox = css`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const leftBtn = css`
  flex: 1;
`;

const rightBtn = css`
  flex: 2;
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
  gap: 4px;
  max-width: 90vw;
`;
