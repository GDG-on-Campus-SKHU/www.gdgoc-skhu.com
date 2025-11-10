/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { sectionCss, choiceBtn, primaryBtn, step1Desc } from '../../../../styles/GlobalStyle/SignUpStyle';
import { typography } from '../../../../styles/constants/text';
import { colors } from '../../../../styles/constants/colors';
import type { Step } from '../../../team-building/pages/SignUp/index';

interface Step1Props {
    visible: boolean;
    step: Step;
    orgType: 'internal' | 'external' | '';
    setOrgType: (value: 'internal' | 'external') => void;
    onNext: () => void;
}

export default function Step1({ visible, step, orgType, setOrgType, onNext }: Step1Props) {
    return (
        <section css={sectionCss(visible, step)}>
            <h2 css={[typography.h2Bold, titleCss]}>회원가입</h2>
            <p css={[typography.b4, step1Desc]}>어디에서 활동 중이신가요?</p>

            <div css={buttonBox}>
                <button
                    css={choiceBtn(orgType === 'internal')}
                    onClick={() => setOrgType('internal')}
                >
                    GDGoC SKHU
                </button>
                <button
                    css={choiceBtn(orgType === 'external')}
                    onClick={() => setOrgType('external')}
                >
                    외부 GDGoC
                </button>
            </div>

            <button css={primaryBtn({ disabled: !orgType })} onClick={onNext} disabled={!orgType}>
                다음
            </button>
        </section>
    );
}

const titleCss = css`
    color: ${colors.black};
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 1px;
    padding-top: 10px;
`;

const buttonBox = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
`;
