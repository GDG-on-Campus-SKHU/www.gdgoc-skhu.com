import { useMemo, useState } from 'react';
import Image from 'next/image';

import {
  ActionButton,
  ActionColumn,
  ArrowIcon,
  Brand,
  BrandContainer,
  BrandName,
  Content,
  ContentContainer,
  DateBodyCell,
  DateColumn,
  DateHeaderCell,
  Description,
  DisplayBodyCell,
  DisplayColumn,
  DisplayHeaderCell,
  GenerationBodyCell,
  GenerationColumn,
  GenerationHeaderCell,
  Heading,
  IDBodyCell,
  IdColumn,
  IDHeaderCell,
  ImageContainer,
  NameBodyCell,
  NameColumn,
  NameHeaderCell,
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
  SearchBar,
  SearchButton,
  SearchButtonText,
  SearchField,
  SearchIcon,
  SearchInput,
  Sidebar,
  TableBody,
  TableCard,
  TableHeader,
  TableRow,
  Title,
} from '../../styles/AdminProjectGallery';

type GalleryRow = {
  id: string | number;
  name: string;
  generation: string;
  displayStatus: string;
  createdAt: string;
};

type AdminProjectGalleryProps = {
  items?: GalleryRow[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (keyword: string) => void;
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
  { label: '아이디어 관리' },
  { label: '프로젝트 갤러리 관리', active: true },
  { label: '액티비티 관리' },
];

const ITEMS_PER_PAGE = 10;
const DEFAULT_TOTAL_PAGES = 10;

const DEFAULT_ROWS: GalleryRow[] = Array.from(
  { length: ITEMS_PER_PAGE * DEFAULT_TOTAL_PAGES },
  (_, index) => {
    const pageIndex = Math.floor(index / ITEMS_PER_PAGE);
    const rowNumberWithinPage = ITEMS_PER_PAGE - (index % ITEMS_PER_PAGE);
    const id = pageIndex * ITEMS_PER_PAGE + rowNumberWithinPage;

    return {
      id,
      name: '프로젝트명은 20자까지!! 그래서 짧게 잡아도 될듯 !!',
      generation: '25-26',
      displayStatus: id >= 6 && id % 2 === 0 ? '비활성화' : '활성화',
      createdAt: '2025.10.31',
    };
  }
);

export default function AdminProjectGallery({
  items,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
}: AdminProjectGalleryProps) {
  const [internalPage, setInternalPage] = useState(1);
  const [keyword, setKeyword] = useState('');

  const baseRows = useMemo(() => {
    if (!items || items.length === 0) {
      return DEFAULT_ROWS;
    }
    return items;
  }, [items]);

  const isControlled = typeof onPageChange === 'function';
  const resolvedTotalPages = isControlled
    ? Math.max(1, totalPages ?? Math.ceil(baseRows.length / ITEMS_PER_PAGE))
    : Math.max(1, Math.ceil(baseRows.length / ITEMS_PER_PAGE));

  const resolvedCurrentPage = Math.min(
    Math.max(isControlled ? (currentPage ?? 1) : internalPage, 1),
    resolvedTotalPages
  );

  const sliceStart = (resolvedCurrentPage - 1) * ITEMS_PER_PAGE;
  const displayedRows = baseRows.slice(sliceStart, sliceStart + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), resolvedTotalPages);
    if (isControlled && onPageChange) {
      onPageChange(nextPage);
    } else {
      setInternalPage(nextPage);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(keyword.trim());
    }
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
          <NavButton key="home-exit" type="button">
            <NavString>
              <span>홈 화면으로 나가기</span>
            </NavString>
          </NavButton>
        </Nav>
      </Sidebar>

      <Content>
        <ContentContainer>
          <Heading>
            <Title>프로젝트 갤러리 관리</Title>
            <Description>
              프로젝트 갤러리에 전시되어있는 글을 관리하고 수정하는 화면입니다.
            </Description>
          </Heading>
          <ContentContainer>
            <SearchBar>
              <SearchField>
                <SearchIcon>
                  <Image src="/readingglass.svg" alt="검색 아이콘" width={20} height={20} />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="프로젝트명 검색"
                  value={keyword}
                  onChange={event => setKeyword(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSearch();
                    }
                  }}
                  aria-label="프로젝트명 검색"
                />
              </SearchField>
              <SearchButton type="button" onClick={handleSearch}>
                <SearchButtonText>검색</SearchButtonText>
              </SearchButton>
            </SearchBar>

            <TableCard>
              <TableHeader>
                <IdColumn>
                  <IDHeaderCell>ID</IDHeaderCell>
                </IdColumn>
                <NameColumn>
                  <NameHeaderCell>프로젝트명</NameHeaderCell>
                </NameColumn>
                <GenerationColumn>
                  <GenerationHeaderCell>기수</GenerationHeaderCell>
                </GenerationColumn>
                <DisplayColumn>
                  <DisplayHeaderCell>전시여부</DisplayHeaderCell>
                </DisplayColumn>
                <DateColumn>
                  <DateHeaderCell>등록날짜</DateHeaderCell>
                </DateColumn>
                <ActionColumn />
              </TableHeader>

              <TableBody>
                {displayedRows.map(row => (
                  <TableRow key={row.id}>
                    <IdColumn>
                      <IDBodyCell>{row.id}</IDBodyCell>
                    </IdColumn>
                    <NameColumn>
                      <NameBodyCell>{row.name}</NameBodyCell>
                    </NameColumn>
                    <GenerationColumn>
                      <GenerationBodyCell>{row.generation}</GenerationBodyCell>
                    </GenerationColumn>
                    <DisplayColumn>
                      <DisplayBodyCell>{row.displayStatus}</DisplayBodyCell>
                    </DisplayColumn>
                    <DateColumn>
                      <DateBodyCell>{row.createdAt}</DateBodyCell>
                    </DateColumn>
                    <ActionColumn>
                      <ActionButton>수정하기</ActionButton>
                    </ActionColumn>
                  </TableRow>
                ))}
              </TableBody>
            </TableCard>
          </ContentContainer>
          <Pagination>
            <PageButton
              $isArrow
              onClick={() => handlePageChange(resolvedCurrentPage - 1)}
              aria-label="이전 페이지"
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
              aria-label="다음 페이지"
              disabled={resolvedCurrentPage === resolvedTotalPages}
            >
              <ArrowIcon $direction="right" />
            </PageButton>
          </Pagination>
        </ContentContainer>
      </Content>
    </Page>
  );
}
