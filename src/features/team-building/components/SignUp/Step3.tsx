/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import { colors } from '../../../../styles/constants/colors';
import { typography } from '../../../../styles/constants/text';
import {
  primaryBtn,
  step1Desc,
  headerCss,
  titleCss,
} from '../../../../styles/GlobalStyle/AuthStyle';
import Button2 from '../Button2';
import FieldOfSignUp from '../FieldOfSignUp';
import Modal from '../Modal';
import SelectBoxBasic from '../SelectBoxBasic';

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
  onPrev,
}: Step3Props) {
  const router = useRouter();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!cohort) setCohort('25-26');
    if (!part) setPart('BE');
    if (!role) setRole('Member');
  }, [cohort, part, setCohort, setPart]);

  const handleShowTerms = () => setShowTermsModal(true);
  const handleCloseTerms = () => setShowTermsModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCompleteModal(true);
  };

  const handleComplete = () => {
    setShowCompleteModal(false);
    router.push('/login');
  };

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
      if (!school.trim()) newErrors.school = '학교명을 입력해주세요.';
      else if (!/^[A-Za-z가-힣]+$/.test(school)) newErrors.school = '학교명은 영문 또는 한글만 입력 가능합니다.';
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

      <form css={formBox} onSubmit={handleSubmit}>
        <div css={formGroup}>
          <label css={labelCss}>학교</label>
          <FieldOfSignUp
            label=""
            placeholder={orgType === 'internal' ? '성공회대학교' : '예: 숙명여자대학교'}
            value={school}
            onChange={e => setSchool(e.target.value)}
            disabled={orgType === 'internal'}
            error={!!localErrors.school}
            errorMessage={localErrors.school}
          />
        </div>

        <div css={gridRow}>
          <div css={formGroup}>
            <label css={labelCss}>기수</label>
            <SelectBoxBasic
              options={['25-26', '24-25', '23-24', '22-23', 'Other']}
              placeholder="25-26"
              onChange={([value]) => setCohort(value)}
            />
            {!!localErrors.cohort && <p css={errorText}>{localErrors.cohort}</p>}
          </div>

          <div css={formGroup}>
            <label css={labelCss}>파트</label>
            <SelectBoxBasic
              options={['BE', 'FE', 'PM', 'Design', 'AI/ML']}
              placeholder="BE"
              onChange={([value]) => setPart(value)}
            />
            {!!localErrors.part && <p css={errorText}>{localErrors.part}</p>}
          </div>
        </div>

        <div css={formGroup}>
          <label css={labelCss}>분류</label>
          <div css={radioGroup}>
            {['Member', 'Core', 'Organizer'].map(r => (
              <label key={r} css={radioLabel}>
                <input
                  type="radio"
                  checked={role === r}
                  onChange={() => setRole(r)}
                  css={radioInput(role === r)}
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
          {!!localErrors.role && <p css={errorText}>{localErrors.role}</p>}
        </div>

        <div css={formGroup}>
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

      {showTermsModal && (
        <Modal
          type="scroll"
          title="이용 약관 및 개인정보 처리 방침"
          message={
            <div
              css={css`
                white-space: pre-line;
                text-align: left;
                font-size: 13px;
                color: ${colors.grayscale[700]};
              `}
            >
              {termsContent}
            </div>
          }
          buttonText="확인"
          onClose={handleCloseTerms}
          customTitleAlign="left"
        />
      )}

      {showCompleteModal && (
        <Modal
          type="default"
          title="회원가입 완료 🎉"
          message={`회원가입이 정상적으로 완료되었습니다.\n관리자의 승인 후 로그인 가능합니다.`}
          buttonText="확인"
          onClose={handleComplete}
        />
      )}
    </section>
  );
}

const sectionCss = css`
  width: 420px;
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 8px 36px rgba(0, 0, 0, 0.08);
  padding: 36px 36px 48px;
  margin-top: 120px;
  margin-bottom: 200px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const stepCountCss = css`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.grayscale[600]};
`;

const formBox = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 8px;
`;

const formGroup = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const labelCss = css`
  font-weight: 700;
  font-size: 15px;
  color: ${colors.black};
`;

const gridRow = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const radioGroup = css`
  display: flex;
  gap: 18px;
  margin-top: 4px;
`;

const radioLabel = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: ${colors.black};
`;

const radioInput = (checked: boolean) => css`
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 ${checked ? `6px ${colors.primary[600]}` : `1.5px ${colors.grayscale[400]}`};
  cursor: pointer;
  transition: box-shadow 0.15s ease;
`;

const agreeRow = css`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
`;

const agreeCheck = (checked: boolean) => css`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: ${checked ? colors.primary[600] : colors.grayscale[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s ease;
`;

const agreeBtn = css`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.black};
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
`;

const errorText = css`
  color: ${colors.point.red};
  font-size: 13px;
  margin-top: 6px;
`;

const buttonBox = css`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;
