import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { getArchivedProjects } from '@/lib/adminProject.api';
import { css } from '@emotion/react';

import ArchivedTable, { type ColumnDef } from './ArchivedProjectTable';

type ArchivedProjectListRow = {
  id: number;
  projectName: string;
  startedAt: string;
  endedAt: string;
};

const columns: Array<ColumnDef<ArchivedProjectListRow>> = [
  { header: '프로젝트명', key: 'projectName', width: 640 },
  { header: '시작일', key: 'startedAt', width: 220 },
  { header: '종료일', key: 'endedAt', width: 180 },
];

const formatDate = (value: string) => value.replaceAll('-', '.').slice(0, 10);

const ArchivedProject: NextPage = () => {
  const router = useRouter();
  const [rows, setRows] = useState<ArchivedProjectListRow[]>([]);

  useEffect(() => {
    getArchivedProjects().then(data => {
      setRows(
        data.map(p => ({
          id: p.projectId,
          projectName: p.name,
          startedAt: formatDate(p.startDate),
          endedAt: formatDate(p.endDate),
        }))
      );
    });
  }, []);

  const handleRowClick = (row: ArchivedProjectListRow) => {
    router.push(`/admin-project/AdminArchivedProject/${row.id}`);
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
        rows={rows}
        getRowKey={row => row.id}
        onRowClick={handleRowClick}
        emptyText="종료된 프로젝트가 없습니다."
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
