import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import { EnrollmentPriority, MemberSentApplyCard } from '../../types/applyStatusData';
import { Part } from '../../types/gallery';
import MyApplyStatusBadge from './ApplyStatusBadge';

function partToLabel(part: Part) {
  switch (part) {
    case 'PM':
      return '기획';
    case 'DESIGN':
      return '디자인';
    case 'WEB':
      return '프론트엔드 (웹)';
    case 'MOBILE':
      return '모바일';
    case 'BACKEND':
      return '백엔드';
    case 'AI':
      return 'AI/ML';
    default:
      return String(part);
  }
}

type AppliedVariantProps = {
  variant: 'applied';
  data: MemberSentApplyCard;
  /** "지원 취소" */
  onCancel?: (card: MemberSentApplyCard) => void;

  onClick?: () => void;
};

type EmptyVariantProps = {
  variant: 'empty';
  priority: EnrollmentPriority;
  /* 결과 발표 전 / 후 */
  emptyType?: 'apply' | 'result';
  onClickApply?: () => void;

  onClick?: () => void;
};

type MyApplyCardProps = AppliedVariantProps | EmptyVariantProps;

export default function MyApplyCard(props: MyApplyCardProps) {
  if (props.variant === 'empty') {
    const { priority, emptyType = 'apply', onClickApply, onClick } = props;

    // 결과 발표 후: 클릭 불가, 회색 배경
    if (emptyType === 'result') {
      return (
        <article css={emptyResultCardCss}>
          <span>{priority}지망에 지원하지 않았어요.</span>
        </article>
      );
    }

    // 결과 발표 전: 지원 유도 카드 (기존 UI)
    return (
      <article
        css={emptyCardCss}
        onClick={() => {
          onClick?.();
          onClickApply?.();
        }}
      >
        <span>+</span>
        <span>{priority}지망 아이디어에 지원해보세요!</span>
      </article>
    );
  }

  const { data, onCancel, onClick } = props;
  const isPending = data.status === 'WAITING';

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPending) return;
    onCancel?.(data);
  };

  return (
    <article css={cardCss} onClick={onClick}>
      {/* 상단: 지망 뱃지 + 상태 뱃지 */}
      <header css={cardHeaderCss}>
        <span css={priorityTagCss}>{data.priority}지망</span>
        <MyApplyStatusBadge status={data.status} />
      </header>

      {/* 중간: 프로젝트 이름 + 한줄소개 */}
      <div css={cardBodyCss}>
        <h3 css={titleCss}>{data.projectName}</h3>
        <p css={oneLinerCss}>{data.oneLiner}</p>
      </div>

      {/* 하단: 지원 파트 / 지원자 수 / 지원 취소 */}
      <footer css={cardFooterCss}>
        <div css={footerInfoRowCss}>
          <span css={footerLabelCss}>지원 파트 :</span>
          <span css={footerTextCss}>{partToLabel(data.enrollmentPart)}</span>
        </div>
        <div css={footerInfoRowCss}>
          <span css={footerLabelCss}>지원자 수 :</span>
          <span css={footerFixedCss}>
            <span css={footerTextCss}>
              {data.applicantCount} / {data.maxMemberCountOfPart}
            </span>
            {''}명 지원
          </span>
        </div>

        {isPending && (
          <button type="button" css={cancelBtnCss} onClick={handleCancel}>
            지원 취소
          </button>
        )}
      </footer>
    </article>
  );
}

const cardCss = css`
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${colors.grayscale[500]};
  background-color: ${colors.white};
  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
`;

const cardHeaderCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const priorityTagCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 3px 8px;
  border-radius: 8px;
  border: 1px solid ${colors.grayscale[500]};
  background-color: ${colors.white};

  font-size: 18px;
  font-weight: 500;
  line-height: 28.8px;
  color: ${colors.grayscale[1000]};
`;

const cardBodyCss = css`
  display: flex;
  flex-direction: column;
  padding: 20px 0 19px;
`;

const titleCss = css`
  font-size: 24px;
  font-weight: 700;
  line-height: 37px;
`;

const oneLinerCss = css`
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  color: ${colors.grayscale[600]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const cardFooterCss = css`
  display: flex;
  align-items: center;
  padding-top: 20px;
  line-height: 32px;
  border-top: 1px solid ${colors.grayscale[500]};
`;

const footerInfoRowCss = css`
  font-size: 20px;
  font-weight: 500;
  margin-right: 40px;
  color: ${colors.grayscale[1000]};
`;

const footerLabelCss = css`
  margin-right: 5px;
`;

const footerTextCss = css`
  font-weight: 700;
  color: ${colors.primary[600]};
`;

const footerFixedCss = css`
  color: ${colors.primary[600]};
`;

const cancelBtnCss = css`
  font-size: 20px;
  font-weight: 500;
  color: ${colors.grayscale[500]};
  cursor: pointer;
  margin-bottom: 1px;
  margin-left: auto;

  &:hover {
    text-decoration: underline;
  }
`;

const emptyCardCss = css`
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${colors.grayscale[500]};
  background-color: ${colors.white};
  font-size: 24px;
  font-weight: 500;
  color: ${colors.primary[1000]};
  line-height: 38.4px;

  min-height: 239px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;

  cursor: pointer;
`;

const emptyResultCardCss = css`
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${colors.grayscale[500]};
  background-color: ${colors.grayscale[200]};
  min-height: 239px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  font-weight: 400;
  line-height: 38.4px;
  color: ${colors.grayscale[500]};
`;
