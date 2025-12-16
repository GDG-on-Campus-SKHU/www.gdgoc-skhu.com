import { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import styled from 'styled-components';

const AdminActivity: NextPage = () => {
  const TOTAL_PAGES = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const categories = [
    { id: 1, title: '이서영 PM의 프로젝트 관리법이 궁금하다면?', count: '1개', status: '공개' },
    {
      id: 2,
      title: '💫 24-25 PM 코어(서혜근 코어)의 프로젝트 비법이 궁금하시다면?',
      count: '5개',
      status: '공개',
    },
    { id: 3, title: '👀 24-25 Tech Talk 다시보기', count: '99개', status: '비공개' },
    { id: 4, title: '👀 23-24 Tech Talk 다시보기', count: '7개', status: '공개' },
  ];
  const onAdminListCategoryContainerClick = useCallback(() => {
    // Please sync "등록된 카테고리 수정창" to the project
  }, []);

  const handlePageChange = (page: number) => {
    const next = Math.min(Math.max(page, 1), TOTAL_PAGES);
    setCurrentPage(next);
  };

  return (
    <Container>
      <Sidebar>
        <Logo>
          <GdgocSkhuImage src="gdgoc_skhu_admin.svg" alt="" width={60} height={38} />
          <LogoText>GDGoC SKHU</LogoText>
        </Logo>

        <LoginInfo>
          <UserName>윤준석</UserName>
          <Divider>님</Divider>
        </LoginInfo>

        <MenuList>
          <MenuItem>대시보드</MenuItem>
          <MenuItem>가입 심사</MenuItem>
          <MenuItem>멤버 관리</MenuItem>
          <MenuItem>프로젝트 관리</MenuItem>
          <MenuItem>아이디어 관리</MenuItem>
          <MenuItem>프로젝트 갤러리 관리</MenuItem>
          <MenuItemActive>
            <span>액티비티 관리</span>
            <ArrowIcon src="rightarrow_admin.svg" width={16} height={16} alt="" />
          </MenuItemActive>
          <MenuItem>홈 화면으로 나가기</MenuItem>
        </MenuList>
      </Sidebar>

      <MainContent>
        <ContentWrapper>
          <HeaderBlock>
            <Header>
              <Title>액티비티 관리</Title>
              <Subtitle>액티비티 게시판에 업로드된 콘텐츠를 관리할 수 있습니다.</Subtitle>
            </Header>
          </HeaderBlock>

          <FormBlock>
            <FormHeaderRow>
              <ApplyButton type="button">카테고리 추가</ApplyButton>
            </FormHeaderRow>

            <CategoryList>
              <CategoryTitle>
                <ContentTitle>
                  <ContentTitleText>카테고리명</ContentTitleText>
                </ContentTitle>
                <ContentCount>
                  <ContentCountText>영상 수</ContentCountText>
                </ContentCount>
                <ContentCount>
                  <ContentCountText>상태</ContentCountText>
                </ContentCount>
              </CategoryTitle>

              {categories.map((category: any) => (
                <AdminListCategory key={category.id} onClick={onAdminListCategoryContainerClick}>
                  <ContentTitle>
                    <ContentTitleText>{category.title}</ContentTitleText>
                  </ContentTitle>
                  <ContentCount>
                    <ContentCountText>{category.count}</ContentCountText>
                  </ContentCount>
                  <ContentCount>
                    <ContentCountText>{category.status}</ContentCountText>
                  </ContentCount>
                </AdminListCategory>
              ))}
              {Array.from({ length: 10 - categories.length }).map((_, idx) => (
                <AdminListCategoryEmpty key={`empty-${idx}`} />
              ))}
            </CategoryList>

            <Pagination>
              <PageButton
                $isArrow
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="이전 페이지"
              >
                <PaginationArrowIcon $direction="left" src="leftarrow.svg" alt="이전" />
              </PageButton>

              <PageNumberGroup>
                {Array.from({ length: TOTAL_PAGES }, (_, idx) => {
                  const pageNumber = idx + 1;
                  const isActive = pageNumber === currentPage;
                  return (
                    <PageNumber
                      key={pageNumber}
                      $active={isActive}
                      onClick={() => handlePageChange(pageNumber)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {pageNumber}
                    </PageNumber>
                  );
                })}
              </PageNumberGroup>

              <PageButton
                $isArrow
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="다음 페이지"
              >
                <PaginationArrowIcon $direction="right" src="rightarrow.svg" alt="다음" />
              </PageButton>
            </Pagination>
          </FormBlock>
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};

export default AdminActivity;

/* ================== layout & sidebar (from ProjectGalleryEdit) ================== */

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

const MenuItemActive = styled.div`
  align-self: stretch;
  background: linear-gradient(#353a40, #353a40), #25282c;
  border-bottom: 1px solid #626873;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 28px;
  gap: 20px;
  font-weight: 700;
  line-height: 160%;
  cursor: pointer;
`;

const ArrowIcon = styled.img`
  width: 16px;
  max-height: 100%;
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

const ContentWrapper = styled.section`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
  text-align: left;
  font-size: 36px;
  color: #000;
  font-family: Pretendard;
`;

const HeaderBlock = styled.div`
  width: 100%;
  margin-top: 91px;
`;

const FormBlock = styled.div`
  width: 100%;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-end;
`;

const Header = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const Title = styled.h1`
  margin: 0;
  align-self: stretch;
  font-size: 36px;
  line-height: 160%;
  font-weight: 700;

  @media screen and (max-width: 800px) {
    font-size: 29px;
    line-height: 46px;
  }

  @media screen and (max-width: 450px) {
    font-size: 22px;
    line-height: 35px;
  }
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

const FormHeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const ApplyButton = styled.button`
  cursor: pointer;
  border: 0;
  padding: 10px 8px;
  background-color: #4285f4;
  width: 200px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 18px;
  line-height: 160%;
  font-weight: 500;
  font-family: Pretendard;
  color: #f9f9fa;
  z-index: 2;

  &:hover {
    background-color: #3367d6;
  }
`;

/* ================== list & pagination (adapted to layout) ================== */

const CategoryList = styled.div`
  width: 100%;
  max-width: 1105px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  font-size: 20px;
  color: #040405;
  font-family: Pretendard;
`;

const CategoryTitle = styled.div`
  align-self: stretch;
  height: 45px;
  background-color: #f1f2f4;
  display: flex;
  align-items: center;
  padding: 0 8px;
  box-sizing: border-box;
  gap: 44px;
  font-size: 18px;
  color: #626873;
`;

const ContentTitle = styled.div`
  flex: 3 1 0;
  display: flex;
  align-items: center;
  padding: 8px;
  box-sizing: border-box;
  text-align: left;
  justify-content: flex-start;
`;

const ContentTitleText = styled.div`
  flex: 1;
  line-height: 160%;
  font-weight: 500;
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ContentCount = styled.div`
  flex: 1 1 0;
  display: flex;
  align-items: center;
  padding: 8px 8px 8px 0;
  box-sizing: border-box;
  justify-content: flex-start;
`;

const ContentCountText = styled.div`
  line-height: 160%;
  font-weight: 500;
`;

const AdminListCategory = styled.div`
  align-self: stretch;
  height: 80px;
  border-bottom: 1px solid #e1e3e6;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 44px;
  cursor: pointer;
`;

const AdminListCategoryEmpty = styled.div`
  align-self: stretch;
  height: 80px;
  border-bottom: 1px solid #e1e3e6;
  box-sizing: border-box;
`;

const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin: 120px 0 40px 0;
`;

const PageNumberGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const PageButton = styled.button<{ $active?: boolean; $isArrow?: boolean }>`
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 12px;
  border: ${({ $isArrow }) => ($isArrow ? '1px solid #d0d5dd' : 'none')};
  background: ${({ $active }) => ($active ? '#4285f4' : 'transparent')};
  color: ${({ $active }) => ($active ? '#f9f9fa' : '#040405')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: ${({ $isArrow }) => ($isArrow ? '#4285f4' : 'transparent')};
    background: ${({ $active }) => ($active ? '#3367d6' : 'rgba(66, 133, 244, 0.08)')};
  }
`;

const PageNumber = styled(PageButton)<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? 'var(--primary-600-main, #4285f4)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#f9f9fa' : '#040405')};
`;

const PaginationArrowIcon = styled.img<{ $direction: 'left' | 'right' }>`
  width: 16px;
  height: 16px;
`;
