/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useState } from 'react';
import { signUp } from '@/lib/auth.api';
import { css } from '@emotion/react';

import Modal from '../../components/Modal';
import Step1 from '../../components/SignUp/Step1';
import Step2 from '../../components/SignUp/Step2';
import Step3 from '../../components/SignUp/Step3';

export type Step = 1 | 2 | 3;

export default function SignUpPage() {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const [orgType, setOrgType] = useState<'internal' | 'external' | ''>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);

  const [school, setSchool] = useState('');
  const [cohort, setCohort] = useState('');
  const [part, setPart] = useState('');
  const [position, setPosition] = useState<'MEMBER' | 'CORE' | 'ORGANIZER'>('MEMBER');
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const validateStep = useCallback(
    (step: Step) => {
      const newErrors: Record<string, string> = {};

      if (step === 2) {
        if (!name.trim()) newErrors.name = '이름을 입력해주세요.';
        else if (!/^[A-Za-z가-힣]+$/.test(name))
          newErrors.name = '이름은 영문 또는 한글만 입력 가능합니다.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          newErrors.email = '이메일 형식이 올바르지 않습니다.';
        if (pw !== pw2) newErrors.pw2 = '비밀번호가 일치하지 않습니다.';
        if (pw.length < 8) {
          newErrors.pw = '비밀번호는 8자 이상이어야 합니다.';
        } else if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) {
          newErrors.pw = '비밀번호는 영문과 숫자 특수문자를 모두 포함해야 합니다.';
        }
        if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone))
          newErrors.phone = '전화번호 형식이 올바르지 않습니다.(예: 010-1234-5678)';
      }

      if (step === 3) {
        if (orgType !== 'internal' && !school.trim()) newErrors.school = '학교를 입력해주세요.';
        if (!cohort) newErrors.cohort = '기수를 선택해주세요.';
        if (!part) newErrors.part = '파트를 선택해주세요.';
        if (!position) newErrors.position = '분류를 선택해주세요.';
        if (!agree) newErrors.agree = '약관에 동의해주세요.';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [name, email, pw, pw2, phone, school, cohort, part, position, agree, orgType]
  );

  useEffect(() => {
    if (currentStep === 2 && touched) {
      validateStep(2);
    }
  }, [name, email, pw, pw2, phone, touched, currentStep, validateStep]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => setVisible(true), 30);
    return () => {
      document.body.style.overflow = 'auto';
      clearTimeout(t);
    };
  }, []);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => (prev < 3 ? ((prev + 1) as Step) : prev));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const userRole = orgType === 'internal' ? 'ROLE_SKHU_MEMBER' : 'ROLE_OTHERS';
    const finalSchool = orgType === 'internal' ? '성공회대학교' : school;

    try {
      await signUp({
        name,
        email,
        password: pw,
        passwordConfirm: pw2,
        number: phone,
        school: finalSchool,
        generation: cohort,
        part,
        position,
        role: userRole,
      });

      setShowCompleteModal(true);
    } catch (err: any) {
      if (err.response?.data === '이미 가입된 이메일입니다.') {
        setShowDuplicateModal(true);
        return;
      }
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  const isStep2Disabled =
    !name.trim() ||
    !/^[A-Za-z가-힣]+$/.test(name) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(pw) ||
    pw !== pw2 ||
    !/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            visible={visible}
            step={currentStep}
            orgType={orgType}
            setOrgType={setOrgType}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2
            visible={visible}
            step={currentStep}
            name={name}
            email={email}
            pw={pw}
            pw2={pw2}
            phone={phone}
            setName={setName}
            setEmail={setEmail}
            setPw={setPw}
            setPw2={setPw2}
            setPhone={setPhone}
            errors={errors}
            onNext={handleNext}
            onPrev={handlePrev}
            touched={touched}
            setTouched={setTouched}
            currentStep={currentStep}
            isDisabled={isStep2Disabled}
          />
        );
      case 3:
        return (
          <Step3
            orgType={orgType}
            school={school}
            cohort={cohort}
            part={part}
            role={position}
            agree={agree}
            setSchool={setSchool}
            setCohort={setCohort}
            setPart={setPart}
            setRole={setPosition}
            setAgree={setAgree}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main css={mainCss(visible, currentStep)}>
      {renderStep()}

      {showDuplicateModal && (
        <Modal
          title="회원가입 불가"
          message="이미 가입된 이메일입니다."
          buttonText="확인"
          onClose={() => setShowDuplicateModal(false)}
        />
      )}

      {showCompleteModal && (
        <Modal
          title="회원가입 완료 🎉"
          message={'회원가입이 완료되었습니다.\n관리자 승인 후 로그인이 가능합니다.'}
          buttonText="확인"
          onClose={() => (window.location.href = '/login')}
        />
      )}
    </main>
  );
}

const mainCss = (visible: boolean, step: Step) => css`
  display: flex;
  justify-content: center;
  ${step === 2 ? '' : 'align-items: center;'}
  width: 100vw;
  min-height: 100vh;
  backdrop-filter: blur(22px);
  opacity: ${visible ? 1 : 0};
  transform: ${visible ? 'translateY(0)' : 'translateY(10px)'};
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
`;
