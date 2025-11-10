/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import Step1 from '../../components/SignUp/Step1';
import Step2 from '../../components/SignUp/Step2';
import Step3 from '../../components/SignUp/Step3';
import Modal from '../../components/Modal';

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
    const [role, setRole] = useState('');
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showCompleteModal, setShowCompleteModal] = useState(false);

    useEffect(() => {
    if (currentStep === 2) {
        validateStep(2)
    }
}, [name, email, pw, pw2, phone, currentStep]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const t = setTimeout(() => setVisible(true), 30);
        return () => {
            document.body.style.overflow = 'auto';
            clearTimeout(t);
        };
    }, []);

    const validateStep = (step: Step) => {
        const newErrors: Record<string, string> = {};
        if (step === 2) {
        if (!name.trim()) {
            newErrors.name = '이름을 입력해주세요.';
        } else if (!/^[A-Za-z가-힣]+$/.test(name)) {
            newErrors.name = '이름은 영문 또는 한글만 입력 가능합니다.';
        }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                newErrors.email = '올바른 이메일 주소 형식이 아닙니다.';
            if (pw.length < 8) newErrors.pw = '8자 이상, 특수문자가 포함된 비밀번호를 입력해주세요.';
            if (pw !== pw2) newErrors.pw2 = '비밀번호가 일치하지 않습니다.';
            if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone))
                newErrors.phone = '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)';
        }
        if (step === 3) {
            if (!school.trim()) newErrors.school = '학교명을 입력해주세요.';
            if (!cohort) newErrors.cohort = '기수를 선택해주세요.';
            if (!part) newErrors.part = '파트를 선택해주세요.';
            if (!role) newErrors.role = '분류를 선택해주세요.';
            if (!agree) newErrors.agree = '이용 약관에 동의해주세요.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) setCurrentStep((prev) => (prev < 3 ? (prev + 1) as Step : prev));
    };

    const handlePrev = () => setCurrentStep((prev) => (prev > 1 ? (prev - 1) as Step : prev));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(3)) setShowCompleteModal(true);
    };

    const handleCloseModal = () => {
        setShowCompleteModal(false);
        alert('회원가입이 완료되었습니다!');
    };

    const isStep2Disabled =
        !touched ||
        !name.trim() ||
        !/^[A-Za-z가-힣]+$/.test(name) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        pw.length < 8 ||
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
                        role={role}
                        agree={agree}
                        setSchool={setSchool}
                        setCohort={setCohort}
                        setPart={setPart}
                        setRole={setRole}
                        setAgree={setAgree}
                        errors={errors}
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
            {showCompleteModal && (
                <Modal
                    type="default"
                    title="회원가입 완료 🎉"
                    message= {
                    <>
                    회원가입이 정상적으로 완료되었습니다.{"\n"}
                    관리자의 승인 후 로그인 가능합니다.
                    </>}
                    buttonText="확인"
                    onClose={handleCloseModal}
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
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(22px);
    opacity: ${visible ? 1 : 0};
    transform: ${visible ? 'translateY(0)' : 'translateY(10px)'};
    transition: opacity 0.6s ease, transform 0.6s ease;
    ${step === 2 ? 'overflow-y: auto; scroll-behavior: smooth;' : ''}
`;
