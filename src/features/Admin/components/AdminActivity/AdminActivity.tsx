import { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAdminCategories } from '@/lib/adminActivity.api';
import styled from 'styled-components';

const AdminActivity: NextPage = () => {
  const router = useRouter();
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { data: categoriesData, isLoading, error } = useAdminCategories();

  // [수정됨] 클릭 시 해당 카테고리의 ID를 받아 수정 페이지로 이동
  const onAdminListCategoryContainerClick = useCallback(
    (categoryId: number) => {
      router.push(`/AdminActivityCategoryEdit?id=${categoryId}`);
    },
    [router]
  );

  const handleAddCategory = () => {
    router.push('/AdminActivityCategoryCreate'); // 생성 페이지 경로는 Create로 가정
  };

  const handlePageChange = (page: number) => {
    if (!categoriesData) return;
    const totalPages = Math.ceil(categoriesData.length / ITEMS_PER_PAGE);
    const next = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(next);
  };

  const displayedCategories = categoriesData
    ? categoriesData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : [];

  const emptyRowsCount = Math.max(0, ITEMS_PER_PAGE - displayedCategories.length);
  const totalPages = categoriesData ? Math.ceil(categoriesData.length / ITEMS_PER_PAGE) : 1;

  return (
    <Container>
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
              <ApplyButton type="button" onClick={handleAddCategory}>
                카테고리 추가
              </ApplyButton>
            </FormHeaderRow>

            {isLoading && <LoadingMessage>카테고리 목록을 불러오는 중...</LoadingMessage>}

            {error && <ErrorMessage>카테고리 목록을 불러오는 중 오류가 발생했습니다.</ErrorMessage>}

            {!isLoading && !error && categoriesData && (
              <>
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

                  {displayedCategories.map(category => (
                    <AdminListCategory
                      key={category.categoryId}
                      // [수정됨] ID 전달
                      onClick={() => onAdminListCategoryContainerClick(category.categoryId)}
                    >
                      <ContentTitle>
                        <ContentTitleText>{category.categoryName}</ContentTitleText>
                      </ContentTitle>
                      <ContentCount>
                        <ContentCountText>{category.count}개</ContentCountText>
                      </ContentCount>
                      <ContentCount>
                        <ContentCountText>
                          {category.isPublished ? '공개' : '비공개'}
                        </ContentCountText>
                      </ContentCount>
                    </AdminListCategory>
                  ))}

                  {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                    <AdminListCategoryEmpty key={`empty-${idx}`} />
                  ))}
                </CategoryList>

                <Pagination>
                  <PageButton
                    $isArrow
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <PaginationArrowIcon $direction="left" src="/leftarrow.svg" alt="이전" />
                  </PageButton>

                  <PageNumberGroup>
                    {Array.from({ length: totalPages }, (_, idx) => {
                      const pageNumber = idx + 1;
                      const isActive = pageNumber === currentPage;
                      return (
                        <PageNumber
                          key={pageNumber}
                          $active={isActive}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </PageNumber>
                      );
                    })}
                  </PageNumberGroup>

                  <PageButton
                    $isArrow
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <PaginationArrowIcon $direction="right" src="/rightarrow.svg" alt="다음" />
                  </PageButton>
                </Pagination>
              </>
            )}
          </FormBlock>
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};

export default AdminActivity;

/* ================== layout (from ProjectGalleryEdit) ================== */

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  line-height: normal;
  letter-spacing: normal;
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

  &:hover {
    background-color: #f9f9fa;
  }
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

  &:hover:not(:disabled) {
    border-color: ${({ $isArrow }) => ($isArrow ? '#4285f4' : 'transparent')};
    background: ${({ $active }) => ($active ? '#3367d6' : 'rgba(66, 133, 244, 0.08)')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const LoadingMessage = styled.div`
  width: 100%;
  text-align: center;
  padding: 60px 0;
  font-size: 18px;
  color: #626873;
`;

const ErrorMessage = styled.div`
  width: 100%;
  text-align: center;
  padding: 60px 0;
  font-size: 18px;
  color: #e53e3e;
`;
