/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import Step1Email from '../../components/ForgotPassword/Step1Email';
import Step2Verify from '../../components/ForgotPassword/Step2Verify';
import Step3ResetPw from '../../components/ForgotPassword/Step3ResetPw';

export type Step = 1 | 2 | 3;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    const handleNext = () => setStep(prev => (prev < 3 ? (prev + 1) as Step : prev));
    const handlePrev = () => setStep(prev => (prev > 1 ? (prev - 1) as Step : prev));

    const handleComplete = () => router.push('/login');

    return (
        <main css={mainCss}>
            {step === 1 && <Step1Email email={email} setEmail={setEmail} onNext={handleNext} />}
            {step === 2 && (
                <Step2Verify
                    email={email}
                    code={code}
                    setCode={setCode}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            )}
            {step === 3 && (
                <Step3ResetPw
                    email={email}
                    onPrev={handlePrev}
                    onComplete={handleComplete}
                />
            )}
        </main>
    );
}

const mainCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    min-height: 100vh;
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(22px);
`;
