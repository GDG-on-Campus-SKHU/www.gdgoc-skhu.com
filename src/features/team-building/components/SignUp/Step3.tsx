/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants/colors';
import { typography } from '../../../../styles/constants/text';
import { headerCss, step1Desc, titleCss } from '../../../../styles/GlobalStyle/AuthStyle';
import Button from '../Button';
import FieldOfSignUp from '../FieldOfSignUp';
import Modal from '../Modal';
import SelectBoxBasic from '../SelectBoxBasic';

type PositionType = 'MEMBER' | 'CORE' | 'ORGANIZER';

interface Step3Props {
  orgType: 'internal' | 'external' | '';
  school: string;
  cohort: string;
  part: string;
  role: PositionType;
  agree: boolean;
  setSchool: (v: string) => void;
  setCohort: (v: string) => void;
  setPart: (v: string) => void;
  setRole: (v: PositionType) => void;
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
  onSubmit,
}: Step3Props) {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (orgType === 'internal') setSchool('성공회대학교');
    if (!cohort) setCohort('22-23');
    if (!part) setPart('PM');
    if (!role) setRole('MEMBER');
  }, [orgType, cohort, part, role, setSchool, setCohort, setPart, setRole]);

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (orgType !== 'internal' && !school.trim()) newErrors.school = '학교명을 입력해주세요.';
    if (!cohort) newErrors.cohort = '기수를 선택해주세요.';
    if (!part) newErrors.part = '파트를 선택해주세요.';
    if (!role) newErrors.role = '분류를 선택해주세요.';
    if (!agree) newErrors.agree = '약관에 동의해주세요.';

    setLocalErrors(newErrors);
  }, [school, cohort, part, role, agree, orgType]);

  const isDisabled = Object.keys(localErrors).length > 0;

  const termsContent = `
Google Developer Groups on Campus(GDGoC)의 서비스 이용약관 및 개인정보 처리방침

1. 개인정보의 수집 및 이용 목적
- 회원 가입 및 관리
- GDGoC 프로그램 운영 및 참가자 관리
- 행사 및 활동 안내, 공지 전달

2. 수집하는 개인정보 항목
- 이름, 이메일, 전화번호, 학교명, 역할 등 회원가입 시 입력한 정보

3. 개인정보의 보유 및 이용 기간
- 회원 탈퇴 시 즉시 파기
- 단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 기간 동안 보관

4. 개인정보 제공 및 위탁
- 원칙적으로 외부에 제공하지 않으며, 서비스 운영에 필요한 경우에 한해 최소한으로 위탁

5. 동의 거부 권리 및 불이익
- 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으나,
  동의하지 않을 경우 회원가입 및 서비스 이용이 제한될 수 있음

6. 동의 철회
- 회원은 언제든지 개인정보 처리에 대한 동의를 철회할 수 있음
`;

  return (
    <section css={sectionCss}>
      <header css={headerCss}>
        <h2 css={[typography.h2Bold, titleCss]}>회원가입</h2>
        <span css={stepCountCss}>2/2</span>
      </header>

      <p css={[typography.b4, step1Desc]}>동아리 정보를 입력해주세요.</p>

      <form css={formBox} onSubmit={onSubmit}>
        <div css={formGroup}>
          <label css={labelCss}>학교</label>
          <FieldOfSignUp
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
              options={['22-23', '23-24', '24-25', '25-26']}
              placeholder="22-23"
              onChange={([value]) => setCohort(value)}
            />
            {!!localErrors.cohort && <p css={errorText}>{localErrors.cohort}</p>}
          </div>

          <div css={formGroup}>
            <label css={labelCss}>파트</label>
            <SelectBoxBasic
              options={['PM', 'DESIGN', 'WEB', 'MOBILE', 'BACKEND', 'AI']}
              placeholder="PM"
              onChange={([value]) => setPart(value)}
            />
            {!!localErrors.part && <p css={errorText}>{localErrors.part}</p>}
          </div>
        </div>

        <div css={formGroup}>
          <label css={labelCss}>분류</label>
          <div css={radioGroup}>
            {(['MEMBER', 'CORE', 'ORGANIZER'] as PositionType[]).map(r => (
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
            <button type="button" css={agreeBtn} onClick={() => setShowTermsModal(true)}>
              이용 약관 및 개인정보 처리 방침
            </button>
          </div>
          {!!localErrors.agree && <p css={errorText}>{localErrors.agree}</p>}
        </div>

        <div css={buttonBox}>
          <div css={leftBtn}>
            <Button variant="secondary" title="이전" onClick={onPrev} />
          </div>

          <div css={rightBtn}>
            <Button type="submit" title="완료" disabled={isDisabled} />
          </div>
        </div>
      </form>

      {showTermsModal && (
        <Modal
          type="scroll"
          title="이용 약관 및 개인정보 처리방침"
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
          onClose={() => setShowTermsModal(false)}
          customTitleAlign="left"
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
  box-shadow: inset 0 0 0
    ${checked ? `6px ${colors.primary[600]}` : `1.5px ${colors.grayscale[400]}`};
  cursor: pointer;
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
  width: 100%;
`;

const leftBtn = css`
  flex: 1;
`;

const rightBtn = css`
  flex: 2;
`;
