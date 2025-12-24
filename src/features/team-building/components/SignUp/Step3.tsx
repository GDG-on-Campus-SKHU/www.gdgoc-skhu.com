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
import TermsContent from './TermsContent';

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
    const errors: Record<string, string> = {};
    if (!cohort) setCohort('25-26');
    if (!part) setPart('BACKEND');
    if (!role) setRole('MEMBER');
    if (orgType === 'internal') setSchool('성공회대학교');
    if (orgType !== 'internal') {
      if (!school.trim()) errors.school = '학교명을 입력해주세요.';
      else if (!school.includes('대학교')) errors.school = "학교명에 '대학교'가 포함되어야 합니다.";
    }
    if (!cohort) errors.cohort = '기수를 선택해주세요.';
    if (!part) errors.part = '파트를 선택해주세요.';
    if (!role) errors.role = '분류를 선택해주세요.';

    setLocalErrors(errors);
  }, [orgType, school, cohort, part, role, setSchool, setCohort, setPart, setRole]);

  useEffect(() => {
    if (showTermsModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTermsModal]);

  const isDisabled = Object.keys(localErrors).length > 0 || !agree;

  return (
    <>
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
              placeholder={orgType === 'internal' ? '성공회대학교' : '예: 성신여자대학교'}
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
                options={['25-26', '24-25', '23-24', '22-23']}
                value={[cohort]}
                onChange={([v]) => setCohort(v)}
              />
              {!!localErrors.cohort && <p css={errorText}>{localErrors.cohort}</p>}
            </div>

            <div css={formGroup}>
              <label css={labelCss}>파트</label>
              <SelectBoxBasic
                options={['PM', 'DESIGN', 'WEB', 'MOBILE', 'BACKEND', 'AI']}
                value={[part]}
                onChange={([v]) => setPart(v)}
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

          <div css={agreeRow}>
            <div css={agreeCheck(agree)} onClick={() => setAgree(!agree)}>
              {agree && '✓'}
            </div>
            <button type="button" css={agreeBtn} onClick={() => setShowTermsModal(true)}>
              이용 약관 및 개인정보 처리 방침
            </button>
          </div>

          <div css={buttonBox}>
            <Button variant="secondary" title="이전" onClick={onPrev} />
            <Button type="submit" title="완료" disabled={isDisabled} />
          </div>
        </form>
      </section>

      {showTermsModal && (
        <Modal
          type="scroll"
          titleNode={
            <div css={modalHeader}>
              <span>GDGoC SKHU 서비스 이용약관</span>
              <button css={closeBtn} onClick={() => setShowTermsModal(false)}>
                <img src="/close.svg" alt="close" />
              </button>
            </div>
          }
          message={<TermsContent />}
          onClose={() => setShowTermsModal(false)}
          customTitleAlign="left"
          buttonText=""
        />
      )}
    </>
  );
}

/* ---------- styles ---------- */

const closeBtn = css`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  img {
    width: 20px;
    height: 20px;
    display: block;
  }
`;

const modalHeader = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const sectionCss = css`
  width: 420px;
  background: ${colors.white};
  border-radius: 8px;
  padding: 36px 36px 48px;
  margin-top: 10px;
`;

const stepCountCss = css`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.grayscale[600]};
`;

const formBox = css`
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-top: 8px;
`;

const formGroup = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  margin-bottom: 6px;
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
`;

const agreeRow = css`
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
`;

const agreeCheck = (checked: boolean) => css`
  width: 20px;
  height: 20px;
  background: ${checked ? colors.primary[600] : colors.grayscale[300]};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid ${checked ? colors.primary[600] : colors.grayscale[400]};
  cursor: pointer;
`;

const agreeBtn = css`
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
`;

const errorText = css`
  color: ${colors.point.red};
  font-size: 13px;
  margin-top: 6px;
`;

const buttonBox = css`
  display: flex;
  width: 100%;
  gap: 12px;

  & > button:first-of-type {
    flex: 1;
  }

  & > button:last-of-type {
    flex: 2;
  }
`;
