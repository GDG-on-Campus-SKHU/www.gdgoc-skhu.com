import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { getAdminProjects } from '../../../../lib/adminIdea.api';
import {
  ArrowIcon,
  ContentContainer,
  DateItemCell,
  Description,
  HeaderCell,
  Heading,
  PageButton,
  PageInsertNum,
  PageNumberGroup,
  Pagination,
  PJEnd,
  PJItemEnd,
  PJItemName,
  PJItemStart,
  PJName,
  PJNameItemCell,
  PJStart,
  TableBody,
  TableCard,
  TableHeader,
  TableRow,
  Title,
} from '../../styles/AdminIdeaProject';

type ProjectRow = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
};

const ITEMS_PER_PAGE = 5;

export default function AdminIdeaProject() {
  const router = useRouter();

  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAdminProjects({
          page: page - 1,
          size: ITEMS_PER_PAGE,
          sortBy: 'id',
          order: 'ASC',
        });

        const { projects, pageInfo } = res.data;

        setRows(
          projects.map(project => ({
            id: project.projectId,
            name: project.projectName,
            startDate: project.startAt ? project.startAt.slice(0, 10).replaceAll('-', '.') : '—',
            endDate: project.endAt ? project.endAt.slice(0, 10).replaceAll('-', '.') : '—',
          }))
        );

        setTotalPages(pageInfo.totalPages);
      } catch (error) {
        console.error('프로젝트 조회 실패', error);
      }
    };

    fetchProjects();
  }, [page]);

  return (
    <ContentContainer>
      <Heading>
        <Title>아이디어 관리</Title>
        <Description>역대 프로젝트에 게시된 아이디어 리스트를 관리할 수 있습니다.</Description>
      </Heading>

      <TableCard>
        <TableHeader>
          <PJName>
            <HeaderCell>프로젝트명</HeaderCell>
          </PJName>
          <PJStart>
            <HeaderCell>시작일</HeaderCell>
          </PJStart>
          <PJEnd>
            <HeaderCell>종료일</HeaderCell>
          </PJEnd>
        </TableHeader>

        <TableBody>
          {rows.map(row => (
            <TableRow
              key={row.id}
              role="button"
              tabIndex={0}
              onClick={() =>
                router.push({
                  pathname: '/AdminIdeaIdea',
                  query: { projectId: row.id },
                })
              }
            >
              <PJItemName>
                <PJNameItemCell title={row.name}>{row.name}</PJNameItemCell>
              </PJItemName>
              <PJItemStart>
                <DateItemCell>{row.startDate}</DateItemCell>
              </PJItemStart>
              <PJItemEnd>
                <DateItemCell>{row.endDate}</DateItemCell>
              </PJItemEnd>
            </TableRow>
          ))}
        </TableBody>
      </TableCard>

      <Pagination>
        <PageButton $isArrow onClick={() => setPage(p => Math.max(1, p - 1))}>
          <ArrowIcon $direction="left" />
        </PageButton>

        <PageNumberGroup>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageInsertNum key={i + 1} $active={page === i + 1} onClick={() => setPage(i + 1)}>
              {i + 1}
            </PageInsertNum>
          ))}
        </PageNumberGroup>

        <PageButton $isArrow onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
          <ArrowIcon $direction="right" />
        </PageButton>
      </Pagination>
    </ContentContainer>
  );
}
