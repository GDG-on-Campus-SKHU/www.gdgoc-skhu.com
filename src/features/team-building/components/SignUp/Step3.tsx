import React, { useState } from 'react';
import FieldOfSignUp from '../FieldOfSignUp';
import SelectBoxBasic from '../SelectBoxBasic';
import Button from '../Button';
import Button2 from '../Button2';
import Modal from '../Modal';

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

    const handleShowTerms = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const termsContent = `
Google Developer Student Clubs(SKHU)의 서비스 이용약관 및 개인정보 처리방침

1. 개인정보의 수집 및 이용 목적
- 회원 가입 및 관리
- GDSC 프로그램 운영 및 참가자 관리
- 행사/활동 안내 및 공지 전달

2. 수집하는 항목
- 이름, 이메일, 전화번호, 학교명, 역할 등

3. 개인정보의 보유 및 이용기간
- 회원 탈퇴 시 즉시 파기
- 단, 법적 의무 이행을 위해 필요한 경우 관련 법령에 따라 보관

4. 동의 철회
- 회원은 언제든지 개인정보 수집 및 이용에 대한 동의를 철회할 수 있습니다.
    `;

    return (
        <>
            <form
                onSubmit={onSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <p
                    style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#7e8590',
                        marginBottom: '24px',
                    }}
                >
                    동아리 정보를 입력해주세요.
                </p>

                {/* 학교 */}
                <div>
                    <label style={{ fontWeight: 700, fontSize: '15px', color: '#111' }}>학교</label>
                    <FieldOfSignUp
                        placeholder={
                            orgType === 'internal' ? '성공회대학교' : '예: 숙명여자대학교'
                        }
                        value={school}
                        onChange={e => setSchool(e.target.value)}
                        disabled={orgType === 'internal'}
                        error={!!errors.school}
                        errorMessage={errors.school}
                    />
                </div>

                {/* 기수 + 파트 */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                    }}
                >
                    <div>
                        <label style={{ fontWeight: 700, fontSize: '15px', color: '#111' }}>기수</label>
                        <SelectBoxBasic
                            options={['25-26', '24-25', '23-24', '22-23', 'Other']}
                            placeholder="선택하세요"
                            onChange={([value]) => setCohort(value)}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 700, fontSize: '15px', color: '#111' }}>파트</label>
                        <SelectBoxBasic
                            options={['BE', 'FE', 'PM', 'AI/ML', 'Design']}
                            placeholder="선택하세요"
                            onChange={([value]) => setPart(value)}
                        />
                    </div>
                </div>

                {/* 분류 */}
                <div>
                    <label style={{ fontWeight: 700, fontSize: '15px', color: '#111' }}>분류</label>
                    <div
                        style={{
                            display: 'flex',
                            gap: '20px',
                            alignItems: 'center',
                            marginTop: '6px',
                        }}
                    >
                        {['Member', 'Core', 'Organizer'].map(r => (
                            <label
                                key={r}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '5px 10px',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s ease',
                                }}
                            >
                                <input
                                    type="radio"
                                    checked={role === r}
                                    onChange={() => setRole(r)}
                                    style={{
                                        position: 'relative',
                                        appearance: 'none',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        boxShadow: `inset 0 0 0 ${
                                            role === r ? '6px #1a73e8' : '1.5px #9f9f9f'
                                        }`,
                                        cursor: 'pointer',
                                        transition:
                                            'box-shadow 150ms cubic-bezier(0.95, 0.15, 0.5, 1.25)',
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        color: '#111',
                                    }}
                                >
                                    {r}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 약관 */}
                <div style={{ marginTop: '8px' }}>
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        <span
                            style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                background: agree ? '#4285F4' : '#E5E7EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease',
                                color: '#fff',
                                fontSize: '13px',
                            }}
                            onClick={() => setAgree(!agree)}
                        >
                            {agree && '✓'}
                        </span>

                        <button
                            type="button"
                            onClick={handleShowTerms}
                            style={{
                                color: '#111',
                                fontWeight: 600,
                                textDecoration: 'underline',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            이용 약관 및 개인정보 처리 방침
                        </button>
                    </label>
                    {!!errors.agree && (
                        <p style={{ color: '#EA4335', fontSize: '13px', marginTop: '4px' }}>
                            {errors.agree}
                        </p>
                    )}
                </div>

                {/* 버튼 */}
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '20px',
                    }}
                >
                    <div style={{ flex: 1 }} onClick={onPrev}>
                        <Button2 title="이전" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Button title="완료" disabled={Object.keys(errors).length > 0} />
                    </div>
                </div>
            </form>

            {/* Modal */}
            {showModal && (
                <Modal
                    type="scroll"
                    title="이용 약관 및 개인정보 처리 방침"
                    message={termsContent}
                    buttonText="확인"
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}
