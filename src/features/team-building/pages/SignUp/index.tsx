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

  const [school, setSchool] = useState('');
  const [cohort, setCohort] = useState('');
  const [part, setPart] = useState('');
  const [position, setPosition] = useState<'MEMBER' | 'CORE' | 'ORGANIZER'>('MEMBER');
  const [agree, setAgree] = useState(false);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateType, setDuplicateType] = useState<'email' | 'phone' | null>(null);

  const validateStep3 = useCallback(() => {
    const errors: Record<string, string> = {};

    if (orgType !== 'internal' && !school.trim()) errors.school = '학교를 입력해주세요.';
    if (!cohort) errors.cohort = '기수를 선택해주세요.';
    if (!part) errors.part = '파트를 선택해주세요.';
    if (!position) errors.position = '분류를 선택해주세요.';
    if (!agree) errors.agree = '약관에 동의해주세요.';

    return Object.keys(errors).length === 0;
  }, [orgType, school, cohort, part, position, agree]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => setVisible(true), 30);
    return () => {
      document.body.style.overflow = 'auto';
      clearTimeout(t);
    };
  }, []);

  const handleNext = () => {
    setCurrentStep(prev => (prev < 3 ? ((prev + 1) as Step) : prev));
  };

  const handlePrev = () => {
    setCurrentStep(prev => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

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
      const message = err.response?.data;

      if (message === '이미 가입된 이메일입니다.') {
        setDuplicateType('email');
        setShowDuplicateModal(true);
        return;
      }

      if (message === '이미 가입된 전화번호입니다.') {
        setDuplicateType('phone');
        setShowDuplicateModal(true);
        return;
      }

      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

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
            onNext={handleNext}
            onPrev={handlePrev}
            currentStep={currentStep}
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
          message={
            duplicateType === 'email' ? '이미 가입된 이메일입니다.' : '이미 가입된 전화번호입니다.'
          }
          buttonText="확인"
          onClose={() => {
            setShowDuplicateModal(false);
            setDuplicateType(null);
            setCurrentStep(2);
          }}
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
