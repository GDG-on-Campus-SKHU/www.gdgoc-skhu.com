import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AdminProject, getAdminProjectIdeas, getAdminProjects } from '@/lib/adminIdea.api';

import {
  ArrowIcon,
  Content,
  ContentBody,
  ContentContainer,
  DateInfoRow,
  Description,
  Heading,
  IDBodyCell,
  IdBodyCTNR,
  IDCNTR,
  IdeaNameHeaderCell,
  IdHeaderCell,
  InfoRow,
  NameBodyCell,
  NameBodyCTNR,
  NameCNTR,
  NameInfoRow,
  PageButton,
  PageInsertNum,
  PageNumberGroup,
  Pagination,
  StatusBodyCell,
  StatusBodyCTNR,
  StatusCNTR,
  StatusHeaderCell,
  TableBodyLayout,
  TableBodyWrapper,
  TableHeaderRow,
  TableWrapper,
  Title,
  WriterBodyCell,
  WriterBodyCTNR,
  WriterCNTR,
  WriterHeaderCell,
} from '../../styles/AdminIdeaIdea';

type IdeaRow = {
  id: number;
  title: string;
  author: string;
  status: string;
};

const ITEMS_PER_PAGE = 20;

const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  return iso.split('T')[0].replace(/-/g, '.');
};

export default function AdminIdeaIdea() {
  const router = useRouter();
  const { projectId } = router.query;

  const [project, setProject] = useState<AdminProject | null>(null);
  const [ideas, setIdeas] = useState<IdeaRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /** 프로젝트 메타 정보 조회 */
  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const res = await getAdminProjects({
          page: 0,
          size: 50,
        });

        const found = res.data.projects.find(p => p.projectId === Number(projectId));

        setProject(found ?? null);
      } catch (e) {
        console.error('프로젝트 정보 조회 실패', e);
      }
    };

    fetchProject();
  }, [projectId]);

  /** 아이디어 목록 조회 */
  useEffect(() => {
    if (!projectId) return;

    const fetchIdeas = async () => {
      try {
        const res = await getAdminProjectIdeas({
          projectId: Number(projectId),
          page: page - 1,
          size: ITEMS_PER_PAGE,
        });

        const mapped: IdeaRow[] = res.data.ideas.map(idea => {
          let status = '모집 중';

          if (idea.deleted) {
            status = '모집 중단';
          } else if (idea.currentMemberCount >= idea.maxMemberCount) {
            status = '모집 완료';
          }

          return {
            id: idea.ideaId,
            title: idea.title,
            author: idea.authorName ?? '작성자', // 백엔드 지원 전 임시
            status,
          };
        });

        setIdeas(mapped);
        setTotalPages(res.data.pageInfo.totalPages);
      } catch (e) {
        console.error('아이디어 목록 조회 실패', e);
      }
    };

    fetchIdeas();
  }, [projectId, page]);

  const handleRowClick = (row: IdeaRow) => {
    router.push({
      pathname: '/AdminIdeaDetail',
      query: {
        projectId,
        id: row.id,
      },
    });
  };

  return (
    <Content>
      <ContentContainer>
        <Heading>
          <Title>아이디어 관리</Title>
          <Description>선택한 프로젝트에 등록된 아이디어 목록입니다.</Description>
        </Heading>

        <ContentBody>
          <InfoRow>
            <NameInfoRow>{project ? project.projectName : '프로젝트명'}</NameInfoRow>
            <DateInfoRow>
              {project ? `${formatDate(project.startAt)} ~ ${formatDate(project.endAt)}` : '— ~ —'}
            </DateInfoRow>
          </InfoRow>

          <TableWrapper>
            <TableHeaderRow>
              <IDCNTR>
                <IdHeaderCell>ID</IdHeaderCell>
              </IDCNTR>
              <NameCNTR>
                <IdeaNameHeaderCell>아이디어명</IdeaNameHeaderCell>
              </NameCNTR>
              <WriterCNTR>
                <WriterHeaderCell>작성자</WriterHeaderCell>
              </WriterCNTR>
              <StatusCNTR>
                <StatusHeaderCell>모집 상태</StatusHeaderCell>
              </StatusCNTR>
            </TableHeaderRow>

            <TableBodyWrapper>
              {ideas.map(row => (
                <TableBodyLayout
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRowClick(row)}
                >
                  <IdBodyCTNR>
                    <IDBodyCell>{row.id}</IDBodyCell>
                  </IdBodyCTNR>
                  <NameBodyCTNR>
                    <NameBodyCell title={row.title}>{row.title}</NameBodyCell>
                  </NameBodyCTNR>
                  <WriterBodyCTNR>
                    <WriterBodyCell $muted>{row.author}</WriterBodyCell>
                  </WriterBodyCTNR>
                  <StatusBodyCTNR>
                    <StatusBodyCell>{row.status}</StatusBodyCell>
                  </StatusBodyCTNR>
                </TableBodyLayout>
              ))}
            </TableBodyWrapper>
          </TableWrapper>

          <Pagination>
            <PageButton
              $isArrow
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ArrowIcon $direction="left" />
            </PageButton>

            <PageNumberGroup>
              {Array.from({ length: totalPages }, (_, i) => {
                const p = i + 1;
                return (
                  <PageInsertNum key={p} $active={p === page} onClick={() => setPage(p)}>
                    {p}
                  </PageInsertNum>
                );
              })}
            </PageNumberGroup>

            <PageButton
              $isArrow
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ArrowIcon $direction="right" />
            </PageButton>
          </Pagination>
        </ContentBody>
      </ContentContainer>
    </Content>
  );
}
