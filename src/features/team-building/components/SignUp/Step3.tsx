/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import FieldOfSignUp from '../FieldOfSignUp';
import SelectBoxBasic from '../SelectBoxBasic';
import Button2 from '../Button2';
import { primaryBtn, step1Desc } from '../../../../styles/GlobalStyle/SignUpStyle';
import { typography } from '../../../../styles/constants/text';
import { colors } from '../../../../styles/constants/colors';
import Modal from '../Modal';
import type { Step } from '../../../team-building/pages/SignUp/index';

interface Step3Props {
    orgType: 'internal' | 'external' | '';
    school: string;
    cohort: string;
    part: string;
    role: string;
    agree: boolean;
    setSchool: (v: string) => void;
    setCohort: (v: string) => void;
    setPart: (v: string) => void;
    setRole: (v: string) => void;
    setAgree: (v: boolean) => void;
    errors: Record<string, string>;
    onPrev: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function Step3({
    orgType,
    school,
    cohort,
    part,
    role,
    agree,
    setSchool,
    setCohort,
    setPart,
    setRole,
    setAgree,
    errors,
    onPrev,
    onSubmit,
}: Step3Props) {
    const [showModal, setShowModal] = useState(false);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!cohort) setCohort('25-26');
        if (!part) setPart('BE');
    }, []);

    const handleShowTerms = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const termsContent = `
Google Developer Groups on Campus(GDGoC)의 서비스 이용약관 및 개인정보 처리방침

1. 개인정보의 수집 및 이용 목적
- 회원 가입 및 관리
- GDGoC 프로그램 운영 및 참가자 관리
- 행사/활동 안내 및 공지 전달

2. 수집하는 항목
- 이름, 이메일, 전화번호, 학교명, 역할 등

3. 개인정보의 보유 및 이용기간
- 회원 탈퇴 시 즉시 파기
- 단, 법적 의무 이행을 위해 필요한 경우 관련 법령에 따라 보관

4. 동의 철회
- 회원은 언제든지 개인정보 수집 및 이용에 대한 동의를 철회할 수 있습니다.
`;

    useEffect(() => {
        const newErrors: Record<string, string> = {};

        if (orgType !== 'internal') {
            if (!school.trim()) {
                newErrors.school = '학교명을 입력해주세요.';
            } else if (!/^[A-Za-z가-힣]+$/.test(school)) {
                newErrors.school = '학교명은 영문 또는 한글만 입력 가능합니다.';
            }
        }

        if (!cohort) newErrors.cohort = '기수를 선택해주세요.';
        if (!part) newErrors.part = '파트를 선택해주세요.';
        if (!role) newErrors.role = '분류를 선택해주세요.';
        if (!agree) newErrors.agree = '약관에 동의해주세요.';

        setLocalErrors(newErrors);
    }, [school, cohort, part, role, agree, orgType]);

    const isDisabled = Object.keys(localErrors).length > 0;

    return (
        <section css={sectionCss}>
            <header css={headerCss}>
                <h2 css={[typography.h2Bold, titleCss]}>회원가입</h2>
                <span css={stepCountCss}>2/2</span>
            </header>

            <p css={[typography.b4, step1Desc]}>동아리 정보를 입력해주세요.</p>

            <form css={formBox} onSubmit={onSubmit}>
                <div css={fieldBox}>
                    <label css={labelThin}>학교</label>
                    <div css={inputSpacingTight}>
                        <FieldOfSignUp
                            label=""
                            placeholder={orgType === 'internal' ? '성공회대학교' : '예: 숙명여자대학교'}
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            disabled={orgType === 'internal'}
                            error={!!localErrors.school}
                            errorMessage={localErrors.school}
                        />
                    </div>
                </div>

                <div css={twoColumnBox}>
                    <div css={fieldBox}>
                        <label css={labelCss}>기수</label>
                        <div css={inputSpacing}>
                            <SelectBoxBasic
                                options={['25-26', '24-25', '23-24', '22-23', 'Other']}
                                placeholder="25-26"
                                onChange={([value]) => setCohort(value)}
                            />
                        </div>
                        {!!localErrors.cohort && <p css={errorText}>{localErrors.cohort}</p>}
                    </div>

                    <div css={fieldBox}>
                        <label css={labelCss}>파트</label>
                        <div css={inputSpacing}>
                            <SelectBoxBasic
                                options={['BE', 'FE', 'PM', 'Design', 'AI/ML']}
                                placeholder="BE"
                                onChange={([value]) => setPart(value)}
                            />
                        </div>
                        {!!localErrors.part && <p css={errorText}>{localErrors.part}</p>}
                    </div>
                </div>

                <div css={radioBox}>
                    <label css={labelCss}>분류</label>
                    <div css={radioGroup}>
                        {['Member', 'Core', 'Organizer'].map((r) => (
                            <label key={r} css={radioLabel}>
                                <input
                                    type="radio"
                                    checked={role === r}
                                    onChange={() => setRole(r)}
                                    css={radioInput(role === r)}
                                />
                                <span css={radioText}>{r}</span>
                            </label>
                        ))}
                    </div>
                    {!!localErrors.role && <p css={errorText}>{localErrors.role}</p>}
                </div>

                <div css={agreeBox}>
                    <div css={agreeRow}>
                        <div css={agreeCheck(agree)} onClick={() => setAgree(!agree)}>
                            {agree && '✓'}
                        </div>
                        <button type="button" css={agreeBtn} onClick={handleShowTerms}>
                            이용 약관 및 개인정보 처리 방침
                        </button>
                    </div>
                    {!!localErrors.agree && <p css={errorText}>{localErrors.agree}</p>}
                </div>

                <div css={buttonBox}>
                    <Button2 title="이전" onClick={onPrev} />
                    <button css={primaryBtn({ disabled: isDisabled })} disabled={isDisabled}>
                        완료
                    </button>
                </div>
            </form>

            {showModal && (
    <Modal
        type="scroll"
        title="이용 약관 및 개인정보 처리 방침"
        message={
            <div css={css`text-align: left; white-space: pre-line;`}>
                {termsContent}
            </div>
        }
        buttonText="확인"
        onClose={handleCloseModal}
        customTitleAlign="left"
    />
)}


        </section>
    );
}

const sectionCss = css`
    width: 420px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 36px rgba(0, 0, 0, 0.08);
    padding: 36px 36px 48px;
    margin-top: 120px;
    margin-bottom: 200px;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

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
    gap: 19px;
    margin-top: 8px;
`;

const fieldBox = css`
    display: flex;
    flex-direction: column;
`;

const inputSpacingTight = css`
    margin-top: 4px;
`;

const inputSpacing = css`
    margin-top: 8px;
`;

const twoColumnBox = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
`;

const radioBox = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
`;

const labelCss = css`
    font-weight: 700;
    font-size: 15px;
    color: ${colors.black};
    margin-bottom: 6px;
`;

const labelThin = css`
    font-weight: 700;
    font-size: 15px;
    color: ${colors.black};
    margin-bottom: 4px;
`;

const radioGroup = css`
    display: flex;
    gap: 20px;
    align-items: center;
`;

const radioLabel = css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
`;

const radioInput = (checked: boolean) => css`
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 ${checked ? '6px #1a73e8' : '1.5px #9f9f9f'};
    cursor: pointer;
    transition: box-shadow 0.15s ease;
`;

const radioText = css`
    font-size: 15px;
    font-weight: 500;
    color: ${colors.black};
`;

const agreeBox = css`
    margin-top: 16px;
`;

const agreeRow = css`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const agreeCheck = (agree: boolean) => css`
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background: ${agree ? '#4285F4' : '#E5E7EB'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s ease;
`;

const agreeBtn = css`
    color: ${colors.black};
    font-weight: 400;
    text-decoration: underline;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 15px;
`;

const errorText = css`
    color: #ea4335;
    font-size: 13px;
    margin-top: 10px;
`;

const buttonBox = css`
    display: flex;
    gap: 12px;
    margin-top: 20px;
`;
