/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { css } from '@emotion/react';
import FieldOfSignUp from '../FieldOfSignUp';
import Button2 from '../Button2';
import {
    primaryBtn,
    authStepSection,
    authStepTitle,
    authStepDesc,
} from '../../../../styles/GlobalStyle/AuthStyle';
import { typography } from '../../../../styles/constants/text';

interface Step1EmailProps {
    email: string;
    setEmail: (v: string) => void;
    onNext: () => void;
}

export default function Step1Email({ email, setEmail, onNext }: Step1EmailProps) {
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return setError('올바른 이메일 형식이 아닙니다.');
        }

        if (email === 'test@gdgoc.com') {
            onNext();
            return;
        }

        setError('존재하지 않는 이메일 주소입니다.');
    };

    return (
        <form css={authStepSection} onSubmit={handleSubmit}>
            <h2 css={[typography.h2Bold, authStepTitle]}>비밀번호 재설정</h2>
            <p css={[typography.b4, authStepDesc]}>
                가입 당시 입력한 이메일 주소를 입력해주세요.
            </p>

            <FieldOfSignUp
                placeholder="이메일 주소를 입력해주세요."
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={!!error}
                errorMessage={error}
            />

            <div css={buttonBox}>
                <Button2 title="이전" onClick={() => history.back()} />
                <button
                    css={primaryBtn({ disabled: !email.trim() })}
                    disabled={!email.trim()}
                    type="submit"
                >
                    다음
                </button>
            </div>
        </form>
    );
}

const buttonBox = css`
    display: flex;
    gap: 12px;
    margin-top: 16px;
`;
