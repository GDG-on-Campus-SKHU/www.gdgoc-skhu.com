import { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { fetchUserSummaryList } from '@/lib/adminMember.api';
import styled from 'styled-components';

import SelectBoxBasic from '../../../team-building/components/SelectBoxBasic';
import { ArrowIcon, PageButton, PageInsertNum } from '../../styles/AdminIdeaProject';

type SearchField = 'userName' | 'generation' | 'school' | 'part' | 'position';
const SEARCH_FIELD_VALUES = ['name', 'generation', 'school', 'part', 'position'] as const;

type Member = {
  id: number;
  userName: string;
  generation?: string;
  school?: string;
  part?: string;
  position?: string;
};

const TABLE_VISIBLE_ROWS = 10;
const TABLE_ROW_HEIGHT = 72;

const SEARCH_OPTIONS: Array<{ value: SearchField; label: string }> = [
  { value: 'userName', label: '이름' },
  { value: 'generation', label: '기수' },
  { value: 'school', label: '학교' },
  { value: 'part', label: '파트' },
  { value: 'position', label: '분류' },
];

const AdminMember: NextPage = () => {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [searchField, setSearchField] = useState<SearchField>('userName');
  const [inputKeyword, setInputKeyword] = useState('');
  const [submittedField, setSubmittedField] = useState<SearchField>('userName');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const selectedSearchLabel = useMemo(
    () =>
      SEARCH_OPTIONS.find(option => option.value === searchField)?.label ?? SEARCH_OPTIONS[0].label,
    [searchField]
  );

  useEffect(() => {
    const fetchData = async () => {
      const members = await fetchUserSummaryList();
      setMembers(members);
    };
    fetchData();
  }, []);

  const handleSearchFieldChange = (selected: string[]) => {
    const nextLabel = selected[0];
    const matchedOption = SEARCH_OPTIONS.find(option => option.label === nextLabel);
    if (matchedOption) {
      setSearchField(matchedOption.value);
    }
  };

  const filteredMembers = useMemo(() => {
    const keyword = submittedKeyword.trim().toLowerCase();
    if (!keyword) return members;

    return members.filter(member => {
      const target = member[submittedField] ?? '';
      return target.toLowerCase().includes(keyword);
    });
  }, [members, submittedField, submittedKeyword]);

  const totalPages = useMemo(
    () => Math.max(Math.ceil(filteredMembers.length / TABLE_VISIBLE_ROWS), 1),
    [filteredMembers.length]
  );

  const safeCurrentPage = useMemo(
    () => Math.min(Math.max(currentPage, 1), totalPages),
    [currentPage, totalPages]
  );

  const paginatedMembers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * TABLE_VISIBLE_ROWS;
    return filteredMembers.slice(startIndex, startIndex + TABLE_VISIBLE_ROWS);
  }, [filteredMembers, safeCurrentPage]);

  const pageSlots = useMemo(
    () => Array.from({ length: totalPages }, (_, idx) => idx + 1),
    [totalPages]
  );

  const handlePageChange = (page: number) => {
    const next = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(next);
  };

  const handleSearch = () => {
    setSubmittedField(searchField);
    setSubmittedKeyword(inputKeyword.trim());
    setCurrentPage(1);
  };

  const handleUserDetail = (userId: number) => {
    router.push(`/admin-member/${userId}`);
  };

  return (
    <Container>
      <Sidebar>
        <Logo>
          <GdgocSkhuImage src="/gdgoc_skhu_admin.svg" alt="" width={60} height={38} />
          <LogoText>GDGoC SKHU</LogoText>
        </Logo>

        <LoginInfo>
          <UserName>윤준석</UserName>
          <Divider>님</Divider>
        </LoginInfo>

        <MenuList>
          <MenuItem>대시보드</MenuItem>
          <MenuItem>가입 심사</MenuItem>
          <MenuItemActive>
            <span>멤버 관리</span>
            <MenuArrowIcon src="/rightarrow_admin.svg" width={16} height={16} alt="" />
          </MenuItemActive>
          <MenuItem>프로젝트 관리</MenuItem>
          <MenuItem>아이디어 관리</MenuItem>
          <MenuItem>프로젝트 갤러리 관리</MenuItem>
          <MenuItem>액티비티 관리</MenuItem>
          <MenuItem>홈 화면으로 나가기</MenuItem>
        </MenuList>
      </Sidebar>

      <MainContent>
        <HeaderBlock>
          <Header>
            <Title>멤버 관리</Title>
            <Subtitle>승인된 모든 회원의 정보를 관리할 수 있습니다.</Subtitle>
          </Header>
        </HeaderBlock>

        <TableCard>
          <Filters>
            <SelectBoxBasicCTNR>
              <SelectBoxBasic
                className="admin-member-select"
                options={SEARCH_OPTIONS.map(option => option.label)}
                placeholder="이름"
                value={[selectedSearchLabel]}
                onChange={handleSearchFieldChange}
              />
            </SelectBoxBasicCTNR>

            <Search>
              <SearchInput
                type="text"
                placeholder="이름을 검색하세요."
                value={inputKeyword}
                onChange={event => setInputKeyword(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
              />
            </Search>

            <SearchButton type="button" onClick={handleSearch}>
              <SearchButtonText>검색</SearchButtonText>
            </SearchButton>
          </Filters>

          <TableShell>
            <TableHeaderRow>
              <HeaderName>
                {' '}
                <HeaderNameCell>이름</HeaderNameCell>
              </HeaderName>
              <HeaderGen>
                <HeaderGenCell>기수</HeaderGenCell>
              </HeaderGen>
              <HeaderSchool>
                <HeaderSchoolCell>학교</HeaderSchoolCell>
              </HeaderSchool>
              <HeaderPart>
                <HeaderPartCell>파트</HeaderPartCell>
              </HeaderPart>
              <HeaderCategory>
                <HeaderCategoryCell>분류</HeaderCategoryCell>
              </HeaderCategory>
            </TableHeaderRow>

            <TableBody>
              {paginatedMembers.map(member => (
                <TableRow key={member.id} onClick={() => handleUserDetail(member.id)}>
                  <BodyName>
                    {' '}
                    <BodyNameCell>{member.userName}</BodyNameCell>
                  </BodyName>
                  <BodyGen>
                    <BodyGenCell>{member.generation}</BodyGenCell>
                  </BodyGen>
                  <BodySchool>
                    <BodySchoolCell>{member.school}</BodySchoolCell>
                  </BodySchool>
                  <BodyPart>
                    <BodyPartCell>{member.part}</BodyPartCell>
                  </BodyPart>
                  <BodyCategory>
                    <BodyCategoryCell>{member.position}</BodyCategoryCell>
                  </BodyCategory>
                </TableRow>
              ))}

              {paginatedMembers.length === 0 && (
                <EmptyRow>
                  <EmptyRowText>검색 결과가 없습니다.</EmptyRowText>
                </EmptyRow>
              )}
            </TableBody>
          </TableShell>
        </TableCard>

        <Pagination>
          <PageButton
            $isArrow
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            aria-label="Previous page"
          >
            <ArrowIcon $direction="left" />
          </PageButton>

          <PageNumberGroup>
            {pageSlots.map(pageNumber => {
              const isActive = pageNumber === safeCurrentPage;
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
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            aria-label="Next page"
          >
            <ArrowIcon $direction="right" />
          </PageButton>
        </Pagination>
      </MainContent>
    </Container>
  );
};

export default AdminMember;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  line-height: normal;
  letter-spacing: normal;
`;

const Sidebar = styled.div`
  width: 255px;
  min-height: 100vh;
  background-color: #454b54;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Logo = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 28px 20px;
  gap: 12px;
  text-align: center;
  color: #fff;
  font-family: Pretendard;
`;

const GdgocSkhuImage = styled(Image)`
  width: 60px;
  max-height: 100%;
  object-fit: cover;
`;

const LogoText = styled.h3`
  margin: 0;
  font-size: 20px;
  line-height: 160%;
  font-weight: 400;

  @media screen and (max-width: 450px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

const LoginInfo = styled.div`
  align-self: stretch;
  border-top: 1px solid #626873;
  display: flex;
  align-items: center;
  padding: 18px 28px 20px;
  gap: 8px;
  color: #fff;
  font-family: Pretendard;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 20px;
  line-height: 160%;
  font-weight: 700;

  @media screen and (max-width: 450px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

const Divider = styled.div`
  font-size: 16px;
  line-height: 160%;
  font-weight: 500;
`;

const MenuList = styled.section`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  font-size: 16px;
  color: #fff;
  font-family: Pretendard;
`;

const MenuItem = styled.div`
  align-self: stretch;
  background-color: #454b54;
  border-bottom: 1px solid #626873;
  display: flex;
  height: 50px;
  align-items: center;
  padding: 12px 28px;
  line-height: 160%;
  font-weight: 500;
  cursor: pointer;

  &:first-child {
    border-top: 1px solid #626873;
  }

  &:hover {
    background-color: #353a40;
  }
`;

const MenuItemActive = styled(MenuItem)`
  background: linear-gradient(#353a40, #353a40), #25282c;
  font-weight: 700;
  justify-content: space-between;
`;

const MenuArrowIcon = styled(Image)`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;

const MainContent = styled.main`
  flex: 1;
  margin: 0 40px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
`;

const HeaderBlock = styled.div`
  width: 100%;
  margin-top: 90px;
`;

const Header = styled.div`
  display: flex;
  width: 472px;
  height: 100px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const Title = styled.h1`
  color: #000;
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  margin: 0;
`;

const Subtitle = styled.h3`
  margin: 0;
  align-self: stretch;
  font-size: 20px;
  line-height: 160%;
  font-weight: 500;
  color: #626873;

  @media screen and (max-width: 450px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

const TableCard = styled.div`
  width: 100%;
  max-width: 1120px;
  margin-top: 40px;
  border-radius: 12px;
  background: #fff;
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  column-gap: 12px;
`;

const SelectBoxBasicCTNR = styled.div`
  width: 200px;
  height: 48px;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .admin-member-select {
    width: 100%;
  }

  .admin-member-select > div:first-of-type {
    position: relative;
    padding-right: 2.5rem;
  }

  .admin-member-select > div:first-of-type::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background: url('/dropdownarrow.svg') no-repeat center;
    background-size: contain;
    pointer-events: none;
    transition: transform 0.2s ease;
  }

  .admin-member-select > div:first-of-type.open::after {
    transform: translateY(-50%) rotate(180deg);
  }

  .admin-member-select > div:first-of-type svg {
    display: none;
  }
`;

const SearchInput = styled.input`
  height: 48px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  background: #fff;
  padding: 0 14px;
  font-size: 16px;
  color: #15171a;
  box-sizing: border-box;

  &::placeholder {
    color: #9da3ae;
  }
`;

const SearchButton = styled.button`
  display: flex;
  width: 80px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: var(--primary-600-main, #4285f4);
`;

const TableShell = styled.div`
  width: 100%;
  background: #fff;
  overflow: hidden;
`;

const TableHeaderRow = styled.div`
  background: var(--grayscale-200, #ededef);
  display: flex;
  height: 45px;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${TABLE_VISIBLE_ROWS * TABLE_ROW_HEIGHT}px;
  background: #fff;
`;

const TableRow = styled.div`
  display: flex;
  height: 80px;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const HeaderCell = styled.span<{ $align?: 'left' | 'center' }>`
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  text-align: ${({ $align }) => ($align === 'center' ? 'center' : 'left')};
`;

const EmptyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${TABLE_ROW_HEIGHT}px;
  color: #979ca5;
  font-size: 18px;
  font-weight: 500;
`;

const EmptyRowText = styled.span``;

const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin: 120px 0 40px;
`;

const PageNumberGroup = styled.div`
  display: flex;
`;

const HeaderName = styled.div`
  display: flex;
  width: 120px;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`;
const HeaderNameCell = styled(HeaderCell)`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const HeaderGen = styled.div`
  display: flex;
  width: 100px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;
const HeaderGenCell = styled(HeaderCell)`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const HeaderSchool = styled.div`
  display: flex;
  width: 220px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;
const HeaderSchoolCell = styled(HeaderCell)`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const HeaderPart = styled.div`
  display: flex;
  width: 140px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;
const HeaderPartCell = styled(HeaderCell)`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const HeaderCategory = styled.div`
  display: flex;
  width: 140px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;
const HeaderCategoryCell = styled(HeaderCell)`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const BodyName = styled.div`
  display: flex;
  width: 120px;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`;
const BodyNameCell = styled.div`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

const BodyGen = styled.div`
  display: flex;
  width: 100px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const BodyCell = styled.span<{ $align?: 'left' | 'center' }>`
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  text-align: ${({ $align }) => ($align === 'center' ? 'center' : 'left')};
  color: #040405;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const BodyGenCell = styled(BodyCell)`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

const BodySchool = styled.div`
  display: flex;
  width: 220px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const BodySchoolCell = styled(BodyCell)`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

const BodyPart = styled.div`
  display: flex;
  width: 140px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const BodyPartCell = styled(BodyCell)`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

const BodyCategory = styled.div`
  display: flex;
  width: 140px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const BodyCategoryCell = styled(BodyCell)`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

const Search = styled.div`
  display: flex;
  width: 360px;
  height: 48px;
  align-items: center;
`;

const SearchButtonText = styled.span`
  color: var(--grayscale-100, #f9f9fa);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;
