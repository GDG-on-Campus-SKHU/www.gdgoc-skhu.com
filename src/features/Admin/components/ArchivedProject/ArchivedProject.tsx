import { css } from '@emotion/react';
import type { NextPage } from 'next';
import ArchivedTable, { type ColumnDef } from './ArchivedProjectTable';
import { useRouter } from 'next/navigation';

type ArchivedProjectListRow = {
  id: number;
  projectName: string;
  startedAt: string;
  endedAt: string;
};

const MOCK: ArchivedProjectListRow[] = [
  { id: 1, projectName: '그로우톤', startedAt: '2025.01.29', endedAt: '2025.03.01' },
  {
    id: 2,
    projectName: '청신X숙명X성공회 SSS프로젝트',
    startedAt: '2025.01.02',
    endedAt: '2025.01.23',
  },
];

const columns: Array<ColumnDef<ArchivedProjectListRow>> = [
  { header: '프로젝트명', key: 'projectName', width: 640 },
  { header: '시작일', key: 'startedAt', width: 220 },
  { header: '종료일', key: 'endedAt', width: 180 },
];

const ArchivedProject: NextPage = () => {
  const router = useRouter();

  const handleRowClick = (row: ArchivedProjectListRow) => {
    router.push(`/admin-project/AdminArchivedProject/${row.id}`);
    console.log('go detail:', row.id);
  };

  return (
    <div css={pageCss}>
      <div css={titleBlockCss}>
        <h1 css={pageTitleCss}>프로젝트 관리</h1>
        <p css={pageDescCss}>역대 프로젝트의 일정, 참여자, 팀 조건을 관리할 수 있습니다.</p>
      </div>

      <h2 css={sectionTitleCss}>종료된 프로젝트</h2>

      <ArchivedTable
        columns={columns}
        rows={MOCK}
        getRowKey={row => row.id}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default ArchivedProject;

const pageCss = css`
  width: 100%;
  padding: 0 20px;
`;

const titleBlockCss = css`
  margin-bottom: 36px;
`;

const pageTitleCss = css`
  margin: 0;
  font-size: 36px;
  font-family: Pretendard;
  font-weight: 700;
  line-height: 57.6px;
  word-wrap: break-word;
`;

const pageDescCss = css`
  margin: 10px 0 0;
  font-size: 20px;
  font-family: Pretendard;
  font-weight: 500;
  word-wrap: break-word;
  color: #6b7280;
`;

const sectionTitleCss = css`
  margin: 65px 0 14px;
  font-size: 24px;
  font-weight: 700;
  line-height: 38.4px;
  word-wrap: break-word;
`;
