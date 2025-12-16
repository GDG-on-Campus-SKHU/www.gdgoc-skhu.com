import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Idea } from '../../store/IdeaStore';
import {
  ArrowIcon,
  Brand,
  BrandContainer,
  BrandName,
  Content,
  ContentContainer,
  DateItemCell,
  Description,
  HeaderCell,
  Heading,
  ImageContainer,
  Nav,
  NavArrow,
  NavButton,
  NavString,
  Page,
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
  ProfileDetails,
  ProfileName,
  ProfileTitle,
  Sidebar,
  TableBody,
  TableCard,
  TableHeader,
  TableRow,
  Title,
} from '../../styles/AdminIdeaProject';

import '../../styles/AdminIdeaDetail';

type IdeaRow = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

type AdminIdeaProps = {
  ideas?: Array<Idea | IdeaRow>;
  totalIdeas?: number;
  visibleIdeasCount?: number;
  topicFilter?: string;
  excludeClosed?: boolean;
  currentPage?: number;
  totalPages?: number;
  startIndex?: number;
  onChangeTopic?: (topic: string) => void;
  onToggleExclude?: () => void;
  onPageChange?: (page: number) => void;
};

type NavItem = {
  label: string;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: '대시보드' },
  { label: '가입 심사' },
  { label: '멤버 관리' },
  { label: '프로젝트 관리' },
  { label: '아이디어 관리', active: true },
  { label: '프로젝트 갤러리 관리' },
  { label: '액티비티 관리' },
];

const IDEA_ROWS: IdeaRow[] = [
  { id: 'idea-1', name: '그로우톤', startDate: '2025.10.30', endDate: '2025.11.28' },
  {
    id: 'idea-2',
    name: '성신X숙명X성공 SSS프로젝트',
    startDate: '2025.10.30',
    endDate: '2025.11.28',
  },
  {
    id: 'idea-3',
    name: '성신X숙명X성공 SSS프로젝트',
    startDate: '2025.10.30',
    endDate: '2025.11.28',
  },
  {
    id: 'idea-4',
    name: '성신X숙명X성공 SSS프로젝트',
    startDate: '2025.10.30',
    endDate: '2025.11.28',
  },
  {
    id: 'idea-5',
    name: '프로젝트명이 리스트보다 길어진다면 ...처리가 되는데요 이게생각보다 기네요',
    startDate: '2025.10.30',
    endDate: '2025.11.28',
  },
  {
    id: 'idea-5',
    name: '프로젝트명이 리스트보다 길어진다면 ...처리가 되는데요 이게생각보다 기네요',
    startDate: '2025.10.30',
    endDate: '2025.11.28',
  },
  {
    id: 'idea-5',
    name: '프로젝트명이 리스트보다 길어진다면 ...처리가 되는데요 이게생각보다 기네요',
    startDate: '2025.10.30',
    endDate: '2025.11.28',
  },
  {
    id: 'idea-5',
    name: '프로젝트명이 리스트보다 길어진다면 ...처리가 되는데요 이게생각보다 기네요',
    startDate: '2025.10.30',
    endDate: '2025.11.28',
  },
  {
    id: 'idea-5',
    name: '프로젝트명이 리스트보다 길어진다면 ...처리가 되는데요 이게생각보다 기네요',
    startDate: '2025.10.30',
    endDate: '2025.11.28',
  },
  {
    id: 'idea-5',
    name: '프로젝트명이 리스트보다 길어진다면 ...처리가 되는데요 이게생각보다 기네요',
    startDate: '2025.10.30',
    endDate: '2025.11.28',
  },
  {
    id: 'idea-5',
    name: '프로젝트명이 리스트보다 길어진다면 ...처리가 되는데요 이게생각보다 기네요',
    startDate: '2025.10.30',
    endDate: '2025.11.28',
  },
];

const ITEMS_PER_PAGE = 5;

export default function AdminIdeaProject({
  ideas,
  currentPage,
  totalPages,
  startIndex,
  onPageChange,
}: AdminIdeaProps) {
  const [internalPage, setInternalPage] = useState(1);
  const router = useRouter();

  const baseRows = useMemo<IdeaRow[]>(() => {
    const source = ideas ?? IDEA_ROWS;
    return source.map(item => {
      if ('startDate' in item && 'endDate' in item && 'name' in item) {
        return item as IdeaRow;
      }
      const idea = item as Idea;
      return {
        id: String(idea.id),
        name: idea.title ?? '제목 없음',
        startDate: '—',
        endDate: '—',
      };
    });
  }, [ideas]);

  const isControlled = typeof onPageChange === 'function';
  const resolvedTotalPages = isControlled
    ? Math.max(1, totalPages ?? 1)
    : Math.max(1, Math.ceil(baseRows.length / ITEMS_PER_PAGE));

  const resolvedCurrentPage = Math.min(
    Math.max(isControlled ? (currentPage ?? 1) : internalPage, 1),
    resolvedTotalPages
  );

  const shouldSlice = !isControlled || baseRows.length > ITEMS_PER_PAGE;
  const sliceStart = isControlled
    ? typeof startIndex === 'number'
      ? startIndex
      : (resolvedCurrentPage - 1) * ITEMS_PER_PAGE
    : (resolvedCurrentPage - 1) * ITEMS_PER_PAGE;
  const displayedRows = shouldSlice
    ? baseRows.slice(sliceStart, sliceStart + ITEMS_PER_PAGE)
    : baseRows;

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), resolvedTotalPages);
    if (isControlled && onPageChange) {
      onPageChange(nextPage);
    } else {
      setInternalPage(nextPage);
    }
  };

  const handleRowClick = (row: IdeaRow) => {
    router.push({
      pathname: '/AdminIdeaDetail',
      query: { id: row.id, title: row.name },
    });
  };

  return (
    <Page>
      <Sidebar>
        <BrandContainer>
          <Brand>
            <ImageContainer>
              <Image src="/gdgoc_skhu_admin.svg" alt="GDGoC SKHU 로고" width={60} height={38} />
            </ImageContainer>
            <BrandName>GDGoC SKHU</BrandName>
          </Brand>
        </BrandContainer>

        <ProfileDetails>
          <ProfileName>윤준석</ProfileName>
          <ProfileTitle>님</ProfileTitle>
        </ProfileDetails>

        <Nav>
          {NAV_ITEMS.map(item => (
            <NavButton key={item.label} type="button" $active={item.active}>
              <NavString $active={item.active}>
                <span>{item.label}</span>
              </NavString>

              <NavArrow aria-hidden="true" $visible={Boolean(item.active)}>
                <Image src="/rightarrow_admin.svg" alt="오른쪽 화살표" width={16} height={16} />
              </NavArrow>
            </NavButton>
          ))}
          <NavButton key={''} type="button">
            <NavString>
              <span>홈 화면으로 나가기</span>
            </NavString>
          </NavButton>
        </Nav>
      </Sidebar>

      <Content>
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
                {' '}
                <HeaderCell>시작일</HeaderCell>
              </PJStart>
              <PJEnd>
                {' '}
                <HeaderCell>종료일</HeaderCell>
              </PJEnd>
            </TableHeader>

            <TableBody>
              {displayedRows.map((row, index) => (
                <TableRow
                  key={`${row.id}-${index}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRowClick(row)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleRowClick(row);
                    }
                  }}
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
            <PageButton
              $isArrow
              onClick={() => handlePageChange(resolvedCurrentPage - 1)}
              aria-label="Previous page"
            >
              <ArrowIcon $direction="left" />
            </PageButton>

            <PageNumberGroup>
              {Array.from({ length: resolvedTotalPages }, (_, pageIndex) => {
                const pageNumber = pageIndex + 1;
                const isActive = pageNumber === resolvedCurrentPage;
                return (
                  <PageInsertNum
                    key={pageNumber}
                    $active={isActive}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </PageInsertNum>
                );
              })}
            </PageNumberGroup>

            <PageButton
              $isArrow
              onClick={() => handlePageChange(resolvedCurrentPage + 1)}
              aria-label="Next page"
            >
              <ArrowIcon $direction="right" />
            </PageButton>
          </Pagination>
        </ContentContainer>
      </Content>
    </Page>
  );
}
