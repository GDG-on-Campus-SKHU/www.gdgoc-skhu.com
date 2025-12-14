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
  ImageContainer,
  InfoRow,
  NameBodyCell,
  NameBodyCTNR,
  NameCNTR,
  NameInfoRow,
  Nav,
  NavArrow,
  NavButton,
  NavString,
  Page,
  PageButton,
  PageInsertNum,
  PageNumberGroup,
  Pagination,
  ProfileDetails,
  ProfileName,
  ProfileTitle,
  Sidebar,
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
  {
    id: 10,
    title: '아이디어 제목 제한이 20자라서 이것보다 길어질 일은 없겠지만? 만약 길어지면 이런...',
    author: '이서영',
    status: '모집 중',
  },
  { id: 9, title: '리빙메이트', author: '주현지', status: '모집 완료' },
  { id: 8, title: '어디갈래', author: '김규빈', status: '모집 중' },
  { id: 7, title: '아이디어 제목', author: '김다운', status: '모집 중단' },
  { id: 6, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 5, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 4, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 3, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 2, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 1, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  {
    id: 10,
    title: '아이디어 제목 제한이 20자라서 이것보다 길어질 일은 없겠지만? 만약 길어지면 이런...',
    author: '이서영',
    status: '모집 중',
  },
  { id: 9, title: '리빙메이트', author: '주현지', status: '모집 완료' },
  { id: 8, title: '어디갈래', author: '김규빈', status: '모집 중단' },
  { id: 7, title: '아이디어 제목', author: '김다운', status: '모집 중단' },
  { id: 6, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 5, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 4, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 3, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 2, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 1, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  {
    id: 10,
    title: '아이디어 제목 제한이 20자라서 이것보다 길어질 일은 없겠지만? 만약 길어지면 이런...',
    author: '이서영',
    status: '모집 중',
  },
  { id: 9, title: '리빙메이트', author: '주현지', status: '모집 완료' },
  { id: 8, title: '어디갈래', author: '김규빈', status: '모집 중단' },
  { id: 7, title: '아이디어 제목', author: '김다운', status: '모집 중단' },
  { id: 6, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 5, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 4, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 3, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 2, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 1, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  {
    id: 10,
    title: '아이디어 제목 제한이 20자라서 이것보다 길어질 일은 없겠지만? 만약 길어지면 이런...',
    author: '이서영',
    status: '모집 중',
  },
  { id: 9, title: '리빙메이트', author: '주현지', status: '모집 완료' },
  { id: 8, title: '어디갈래', author: '김규빈', status: '모집 중단' },
  { id: 7, title: '아이디어 제목', author: '김다운', status: '모집 중단' },
  { id: 6, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 5, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 4, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 3, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 2, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 1, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  {
    id: 10,
    title: '아이디어 제목 제한이 20자라서 이것보다 길어질 일은 없겠지만? 만약 길어지면 이런...',
    author: '이서영',
    status: '모집 중',
  },
  { id: 9, title: '리빙메이트', author: '주현지', status: '모집 완료' },
  { id: 8, title: '어디갈래', author: '김규빈', status: '모집 중단' },
  { id: 7, title: '아이디어 제목', author: '김다운', status: '모집 중단' },
  { id: 6, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 5, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 4, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 3, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 2, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 1, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  {
    id: 10,
    title: '아이디어 제목 제한이 20자라서 이것보다 길어질 일은 없겠지만? 만약 길어지면 이런...',
    author: '이서영',
    status: '모집 중',
  },
  { id: 9, title: '리빙메이트', author: '주현지', status: '모집 완료' },
  { id: 8, title: '어디갈래', author: '김규빈', status: '모집 중단' },
  { id: 7, title: '아이디어 제목', author: '김다운', status: '모집 중단' },
  { id: 6, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 5, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 4, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 3, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 2, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 1, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  {
    id: 10,
    title: '아이디어 제목 제한이 20자라서 이것보다 길어질 일은 없겠지만? 만약 길어지면 이런...',
    author: '이서영',
    status: '모집 중',
  },
  { id: 9, title: '리빙메이트', author: '주현지', status: '모집 완료' },
  { id: 8, title: '어디갈래', author: '김규빈', status: '모집 중단' },
  { id: 7, title: '아이디어 제목', author: '김다운', status: '모집 중단' },
  { id: 6, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 5, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 4, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 3, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 2, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 1, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  {
    id: 10,
    title: '아이디어 제목 제한이 20자라서 이것보다 길어질 일은 없겠지만? 만약 길어지면 이런...',
    author: '이서영',
    status: '모집 중',
  },
  { id: 9, title: '리빙메이트', author: '주현지', status: '모집 완료' },
  { id: 8, title: '어디갈래', author: '김규빈', status: '모집 중단' },
  { id: 7, title: '아이디어 제목', author: '김다운', status: '모집 중단' },
  { id: 6, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 5, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 4, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 3, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 2, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 1, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  {
    id: 10,
    title: '아이디어 제목 제한이 20자라서 이것보다 길어질 일은 없겠지만? 만약 길어지면 이런...',
    author: '이서영',
    status: '모집 중',
  },
  { id: 9, title: '리빙메이트', author: '주현지', status: '모집 완료' },
  { id: 8, title: '어디갈래', author: '김규빈', status: '모집 중단' },
  { id: 7, title: '아이디어 제목', author: '김다운', status: '모집 중단' },
  { id: 6, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 5, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 4, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 3, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 2, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 1, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  {
    id: 10,
    title: '아이디어 제목 제한이 20자라서 이것보다 길어질 일은 없겠지만? 만약 길어지면 이런...',
    author: '이서영',
    status: '모집 중',
  },
  { id: 9, title: '리빙메이트', author: '주현지', status: '모집 완료' },
  { id: 8, title: '어디갈래', author: '김규빈', status: '모집 중단' },
  { id: 7, title: '아이디어 제목', author: '김다운', status: '모집 중단' },
  { id: 6, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 5, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 4, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 3, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 2, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
  { id: 1, title: '아이디어 제목', author: '작성자', status: '모집 중단' },
];

const ITEMS_PER_PAGE = 10;

export default function AdminIdeaIdea({
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
      if ('author' in item && 'status' in item && 'title' in item) return item as IdeaRow;
      const idea = item as Idea;
      return {
        id: idea.id ?? 0,
        title: idea.title ?? '제목 없음',
        author: '작성자',
        status: idea.status ?? '모집 중',
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
      query: { id: row.id, title: row.title },
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
          <NavButton key="" type="button">
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
          <ContentBody>
            <InfoRow>
              <NameInfoRow>그로우톤</NameInfoRow>
              <DateInfoRow>2025.10.30~2025.11.28</DateInfoRow>
            </InfoRow>

            <TableWrapper>
              <TableHeaderRow>
                <IDCNTR>
                  {' '}
                  <IdHeaderCell>ID</IdHeaderCell>
                </IDCNTR>
                <NameCNTR>
                  {' '}
                  <IdeaNameHeaderCell>아이디어명</IdeaNameHeaderCell>
                </NameCNTR>
                <WriterCNTR>
                  {' '}
                  <WriterHeaderCell>작성자</WriterHeaderCell>
                </WriterCNTR>
                <StatusCNTR>
                  {' '}
                  <StatusHeaderCell>모집 상태</StatusHeaderCell>{' '}
                </StatusCNTR>
              </TableHeaderRow>

              <TableBodyWrapper>
                {displayedRows.map((row, index) => (
                  <TableBodyLayout
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
                    <IdBodyCTNR>
                      {' '}
                      <IDBodyCell>{row.id}</IDBodyCell>
                    </IdBodyCTNR>
                    <NameBodyCTNR>
                      {' '}
                      <NameBodyCell title={row.title}>{row.title}</NameBodyCell>
                    </NameBodyCTNR>
                    <WriterBodyCTNR>
                      {' '}
                      <WriterBodyCell $muted title={row.author}>
                        {row.author}
                      </WriterBodyCell>
                    </WriterBodyCTNR>
                    <StatusBodyCTNR>
                      {' '}
                      <StatusBodyCell title={row.status}>{row.status}</StatusBodyCell>
                    </StatusBodyCTNR>
                  </TableBodyLayout>
                ))}
              </TableBodyWrapper>
            </TableWrapper>

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
          </ContentBody>
        </ContentContainer>
      </Content>
    </Page>
  );
}
