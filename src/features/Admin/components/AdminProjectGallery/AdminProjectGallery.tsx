import { useMemo, useState } from 'react';
import Image from 'next/image';

import {
  ActionButton,
  ActionColumn,
  ArrowIcon,
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
  NameBodyCell,
  NameColumn,
  NameHeaderCell,
  PageButton,
  PageInsertNum,
  PageNumberGroup,
  Pagination,
  SearchBar,
  SearchButton,
  SearchButtonText,
  SearchField,
  SearchIcon,
  SearchInput,
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

type Props = {
  items?: GalleryRow[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (keyword: string) => void;
};

const ITEMS_PER_PAGE = 10;

const DEFAULT_ROWS: GalleryRow[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: '프로젝트명은 20자까지!! 그래서 짧게 잡아도 될듯 !!',
  generation: '25-26',
  displayStatus: i % 2 === 0 ? '활성화' : '비활성화',
  createdAt: '2025.10.31',
}));

export default function AdminProjectGallery({
  items,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
}: Props) {
  const [internalPage, setInternalPage] = useState(1);
  const [keyword, setKeyword] = useState('');

  const rows = useMemo(() => items ?? DEFAULT_ROWS, [items]);

  const isControlled = typeof onPageChange === 'function';
  const resolvedTotalPages = Math.max(
    1,
    isControlled
      ? totalPages ?? 1
      : Math.ceil(rows.length / ITEMS_PER_PAGE)
  );

  const page = Math.min(
    Math.max(isControlled ? currentPage ?? 1 : internalPage, 1),
    resolvedTotalPages
  );

  const displayedRows = rows.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const changePage = (p: number) => {
    const next = Math.min(Math.max(p, 1), resolvedTotalPages);
    if (isControlled && onPageChange) onPageChange(next);
    else setInternalPage(next);
  };

  return (
    <ContentContainer>
      <Heading>
        <Title>프로젝트 갤러리 관리</Title>
        <Description>
          프로젝트 갤러리에 전시된 글을 관리하고 수정할 수 있습니다.
        </Description>
      </Heading>

      <SearchBar>
        <SearchField>
          <SearchIcon>
            <Image src="/readingglass.svg" alt="" width={20} height={20} />
          </SearchIcon>
          <SearchInput
            value={keyword}
            placeholder="프로젝트명 검색"
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch?.(keyword)}
          />
        </SearchField>
        <SearchButton onClick={() => onSearch?.(keyword)}>
          <SearchButtonText>검색</SearchButtonText>
        </SearchButton>
      </SearchBar>

      <TableCard>
        <TableHeader>
          <IdColumn><IDHeaderCell>ID</IDHeaderCell></IdColumn>
          <NameColumn><NameHeaderCell>프로젝트명</NameHeaderCell></NameColumn>
          <GenerationColumn><GenerationHeaderCell>기수</GenerationHeaderCell></GenerationColumn>
          <DisplayColumn><DisplayHeaderCell>전시여부</DisplayHeaderCell></DisplayColumn>
          <DateColumn><DateHeaderCell>등록날짜</DateHeaderCell></DateColumn>
          <ActionColumn />
        </TableHeader>

        <TableBody>
          {displayedRows.map(row => (
            <TableRow key={row.id}>
              <IdColumn><IDBodyCell>{row.id}</IDBodyCell></IdColumn>
              <NameColumn><NameBodyCell>{row.name}</NameBodyCell></NameColumn>
              <GenerationColumn><GenerationBodyCell>{row.generation}</GenerationBodyCell></GenerationColumn>
              <DisplayColumn><DisplayBodyCell>{row.displayStatus}</DisplayBodyCell></DisplayColumn>
              <DateColumn><DateBodyCell>{row.createdAt}</DateBodyCell></DateColumn>
              <ActionColumn><ActionButton>수정하기</ActionButton></ActionColumn>
            </TableRow>
          ))}
        </TableBody>
      </TableCard>

      <Pagination>
        <PageButton $isArrow onClick={() => changePage(page - 1)}>
          <ArrowIcon $direction="left" />
        </PageButton>

        <PageNumberGroup>
          {Array.from({ length: resolvedTotalPages }, (_, i) => (
            <PageInsertNum
              key={i + 1}
              $active={page === i + 1}
              onClick={() => changePage(i + 1)}
            >
              {i + 1}
            </PageInsertNum>
          ))}
        </PageNumberGroup>

        <PageButton $isArrow onClick={() => changePage(page + 1)}>
          <ArrowIcon $direction="right" />
        </PageButton>
      </Pagination>
    </ContentContainer>
  );
}
