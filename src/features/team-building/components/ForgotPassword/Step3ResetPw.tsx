/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import { colors } from '../../../../styles/constants/colors';
import { typography } from '../../../../styles/constants/text';
import {
    primaryBtn,
    authStepSection,
    authStepTitle,
    authStepDesc,
} from '../../../../styles/GlobalStyle/AuthStyle';
import Button2 from '../Button2';
import FieldOfSignUp from '../FieldOfSignUp';
import Modal from '../Modal';

interface Props {
    email: string;
    onPrev: () => void;
    onComplete: () => void;
}

export default function Step3ResetPw({ email, onPrev, onComplete }: Props) {
    const router = useRouter();
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (pw.length < 8 || !/[!@#$%^&*]/.test(pw))
            return setError('8자 이상, 특수문자가 포함된 비밀번호를 입력해주세요.');
        if (pw !== pw2) return setError('비밀번호가 일치하지 않습니다.');

        if (pw === '12341234!') {
            setShowModal(true);
            return;
        }

        setError('비밀번호 변경 중 오류가 발생했습니다.');
    };

    const handleModalClose = () => {
        setShowModal(false);
        router.push('/login');
    };

    return (
        <>
            <form onSubmit={handleSubmit} css={authStepSection}>
                <h2 css={[typography.h2Bold, authStepTitle]}>비밀번호 재설정</h2>
                <p css={[typography.b4, authStepDesc]}>
                    새로운 비밀번호를 설정해주세요.
                </p>

                <div css={fieldBox}>
                    <FieldOfSignUp
                        label="새 비밀번호"
                        type="password"
                        placeholder="새로운 비밀번호를 입력해주세요."
                        value={pw}
                        onChange={e => setPw(e.target.value)}
                        error={!!error}
                    />
                    <p css={subText}>8자리 이상, 특수문자 포함</p>
                </div>

                <div css={fieldBox}>
                    <FieldOfSignUp
                        label="새 비밀번호 확인"
                        type="password"
                        placeholder="새로운 비밀번호를 다시 입력해주세요."
                        value={pw2}
                        onChange={e => setPw2(e.target.value)}
                        error={!!error}
                        errorMessage={error}
                    />
                </div>

                <div css={buttonBox}>
                    <Button2 title="이전" onClick={onPrev} />
                    <button
                        css={primaryBtn({ disabled: !pw || !pw2 })}
                        disabled={!pw || !pw2}
                        type="submit"
                    >
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

const fieldBox = css`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const subText = css`
    font-size: 12px;
    color: ${colors.grayscale[600]};
    margin-top: -10px;
    margin-bottom: 22px;
`;

const buttonBox = css`
    display: flex;
    gap: 12px;
    margin-top: 20px;
`;
