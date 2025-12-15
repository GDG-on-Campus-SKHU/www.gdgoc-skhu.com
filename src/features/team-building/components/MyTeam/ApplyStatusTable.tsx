import Image from 'next/image';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import externalIcon from '../../assets/external.svg';
import type { ApplyStatusRow } from '../../types/applyStatusData';
import Button from '../Button';
import ButtonRed from '../ButtonRed';

type ApplyStatusTableProps = {
  rows: ApplyStatusRow[];
  onAccept: (enrollmentId: number) => void;
  onReject: (enrollmentId: number) => void;
  scheduleEnded: boolean;

  isDetermining?: boolean;
  pendingEnrollmentId?: number | null;
};

export default function ApplyStatusTable({
  rows,
  onAccept,
  onReject,
  scheduleEnded,
  isDetermining = false,
  pendingEnrollmentId = null,
}: ApplyStatusTableProps) {
  return (
    <div css={tableOuterCss}>
      <table css={tableCss}>
        <thead>
          <tr>
            <th css={[thCss, colPriorityCss, thPriorityAlignCss]}>지망</th>
            <th css={[thCss, colNameCss]}>이름</th>
            <th css={[thCss, colPartCss]}>파트</th>
            <th css={[thCss, colSchoolCss]}>학교</th>
            <th css={[thCss, colStatusCss, thStatusAlignCss]}>상태</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <ApplyStatusRow
              key={row.id}
              row={row}
              onAccept={onAccept}
              onReject={onReject}
              scheduleEnded={scheduleEnded}
              isDetermining={isDetermining}
              pending={pendingEnrollmentId === row.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --------- ApplyStatusRow --------- */

type ApplyStatusRowProps = {
  row: ApplyStatusRow;
  onAccept: (enrollmentId: number) => void;
  onReject: (enrollmentId: number) => void;
  scheduleEnded: boolean;

  isDetermining: boolean;
  pending: boolean;
};

function ApplyStatusRow({
  row,
  onAccept,
  onReject,
  scheduleEnded,
  isDetermining,
  pending,
}: ApplyStatusRowProps) {
  const enrollmentId = row.id;

  // 버튼 비활성화 규칙
  const isWaiting = row.status === 'WAITING';
  const showButtons = row.status === 'WAITING' || row.status === 'EXPIRED';
  const acceptDisabled = scheduleEnded || !isWaiting || !row.enrollmentAcceptable || isDetermining;
  const rejectDisabled = scheduleEnded || !isWaiting || isDetermining;

  return (
    <tr css={trCss}>
      {/* 지망 */}
      <td css={[cellCss, colPriorityCss]}>{row.priorityLabel}</td>

      {/* 이름 + external 아이콘 */}
      <td css={[cellCss, colNameCss]}>
        <div css={nameButtonCss}>
          <span>{row.name}</span>
          <span css={nameIconWrapCss}>
            <Image src={externalIcon} alt="프로필 보기" width={9} height={9} />
          </span>
        </div>
      </td>

      {/* 파트 */}
      <td css={[cellCss, colPartCss]}>{row.partLabel}</td>

      {/* 학교 */}
      <td css={[cellCss, colSchoolCss]}>{row.school}</td>

      {/* 상태 */}
      <td css={[cellCss, colStatusCss, cellStatusAlignCss]}>
        <div css={statusCellInnerCss}>
          {showButtons && (
            <div css={statusBtnGroupCss}>
              <Button
                type="button"
                variant="secondary"
                title={pending ? '처리 중...' : '수락'}
                disabled={acceptDisabled}
                onClick={() => !acceptDisabled && onAccept(enrollmentId)}
                style={{
                  height: '45px',
                  fontSize: '18px',
                  fontWeight: '500',
                  lineHeight: '28.8px',
                }}
              />
              <ButtonRed
                type="button"
                title={pending ? '처리 중...' : '거절'}
                disabled={rejectDisabled}
                onClick={() => !rejectDisabled && onReject(enrollmentId)}
                style={{
                  height: '45px',
                }}
              />
            </div>
          )}

          {row.status === 'ACCEPTED' && <span css={acceptedTextCss}>수락 완료</span>}
          {row.status === 'REJECTED' && <span css={rejectedTextCss}>거절 완료</span>}
        </div>
      </td>
    </tr>
  );
}

const tableOuterCss = css`
  width: 100%;
  overflow: hidden;
`;

const tableCss = css`
  width: 100%;
  border-collapse: collapse;
`;

const thCss = css`
  padding: 8px 29px;
  background-color: ${colors.grayscale[200]};
  font-size: 18px;
  font-weight: 500;
  line-height: 28.8px;
  text-align: left;
  color: ${colors.grayscale[600]};
`;

const colPriorityCss = css`
  width: 140px;
`;
const colNameCss = css`
  width: 190px;
`;
const colPartCss = css`
  width: 260px;
`;
const colSchoolCss = css`
  width: 260px;
`;
const colStatusCss = css`
  width: 150px;
`;

const thPriorityAlignCss = css`
  text-align: left;
  padding: 0 35px;
`;

const thStatusAlignCss = css`
  text-align: left;
  padding-left: 86px;
`;

const trCss = css`
  border-bottom: 1px solid ${colors.grayscale[200]};
`;

const cellCss = css`
  padding: 18px 0;
  padding-left: 27px;
  padding-right: 15px;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  color: ${colors.grayscale[1000]};
  vertical-align: middle;
`;

const cellStatusAlignCss = css`
  text-align: center;
`;

const nameButtonCss = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  border: none;
  background: transparent;
  padding: 0;

  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: ${colors.primary[600]};
  }
`;

const nameIconWrapCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const statusCellInnerCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 45px;
`;

const statusBtnGroupCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 132px;
`;

const acceptedTextCss = css`
  font-size: 18px;
  font-weight: 700;
  line-height: 28.8px;
  color: ${colors.primary[600]};
`;

const rejectedTextCss = css`
  font-size: 18px;
  font-weight: 700;
  line-height: 28.8px;
  color: ${colors.grayscale[500]};
`;
