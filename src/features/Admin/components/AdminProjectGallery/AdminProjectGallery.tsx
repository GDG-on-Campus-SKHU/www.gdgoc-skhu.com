import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ProjectGalleryListItem, useProjectGalleryList } from '@/lib/adminProjectGallery.api';

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
  id: number;
  name: string;
  generation: string;
  displayStatus: string;
  createdAt: string;
};

const ITEMS_PER_PAGE = 10;

export default function AdminProjectGallery() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');

  const { data: listData, isLoading } = useProjectGalleryList();

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const rows: GalleryRow[] = useMemo(() => {
    if (!listData) return [];

    const filteredList = listData.filter(item =>
      item.projectName.toLowerCase().includes(keyword.toLowerCase())
    );

    return filteredList.map((item: ProjectGalleryListItem) => {
      const formattedDate = item.createdAt ? item.createdAt.split('T')[0].replace(/-/g, '.') : '-';

      return {
        id: item.id,
        name: item.projectName,
        generation: item.generation,
        displayStatus: item.exhibited ? '활성화' : '비활성화',
        createdAt: formattedDate,
      };
    });
  }, [listData, keyword]);

  const totalPages = Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE));

  const displayedRows = useMemo(() => {
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    return rows.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [rows, page, totalPages]);

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/AdminProjectEdit?id=${id}`);
  };

  return (
    <ContentContainer>
      <Heading>
        <Title>프로젝트 갤러리 관리</Title>
        <Description>프로젝트 갤러리에 전시된 글을 관리하고 수정할 수 있습니다.</Description>
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
          />
        </SearchField>
        <SearchButton onClick={() => {}}>
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
          {isLoading ? (
            <TableRow>
              <NameColumn style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                로딩 중...
              </NameColumn>
            </TableRow>
          ) : displayedRows.length > 0 ? (
            displayedRows.map(row => (
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
                  <ActionButton onClick={() => handleEdit(row.id)}>수정하기</ActionButton>
                </ActionColumn>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <NameColumn style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                검색 결과가 없습니다.
              </NameColumn>
            </TableRow>
          )}
        </TableBody>
      </TableCard>

      <Pagination>
        <PageButton $isArrow onClick={() => changePage(page - 1)} disabled={page === 1}>
          <ArrowIcon $direction="left" />
        </PageButton>

        <PageNumberGroup>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageInsertNum key={i + 1} $active={page === i + 1} onClick={() => changePage(i + 1)}>
              {i + 1}
            </PageInsertNum>
          ))}
        </PageNumberGroup>

        <PageButton $isArrow onClick={() => changePage(page + 1)} disabled={page === totalPages}>
          <ArrowIcon $direction="right" />
        </PageButton>
      </Pagination>
    </ContentContainer>
  );
}
