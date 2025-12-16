import styled from 'styled-components';

export const Page = styled.div`
  display: grid;
  grid-template-columns: 255px 1fr;
  min-height: 100vh;
  background: #ffffff;
`;

export const Sidebar = styled.aside`
  background: var(--grayscale-800, #454b54);
  display: flex;
  width: 255px;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  overflow-y: auto;
`;

export const ImageContainer = styled.div`
  aspect-ratio: 30/19;
  width: 60px;
  height: 38px;
`;

export const BrandContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: var(--grayscale-800, #454b54);
`;

export const Brand = styled.div`
  display: flex;
  padding: 40px 28px 20px 28px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
`;

export const BrandName = styled.span`
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
`;

export const ProfileDetails = styled.div`
  display: flex;
  padding: 20px 28px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-top: 1px solid var(--grayscale-700, #626873);
`;

export const ProfileName = styled.p`
  margin: 0;
  display: inline-flex;
  align-items: center;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

export const ProfileTitle = styled.span`
  display: inline-flex;
  align-items: center;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

export const NavArrow = styled.span<{ $visible?: boolean }>`
  color: rgba(255, 255, 255, 0.7);
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;

export const NavButton = styled.button<{ $active?: boolean; $muted?: boolean }>`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 28px;
  background: ${({ $active }) =>
    $active
      ? 'var(--grayscale-900, linear-gradient(0deg, #353a40 0%, #353a40 100%), #25282c)'
      : 'var(--grayscale-800, #454b54)'};
  border: none;
  border-bottom: 1px solid var(--grayscale-700, #626873);
  color: #ffffff;
  white-space: nowrap;

  &:first-of-type {
    border-top: 1px solid var(--grayscale-700, #626873);
  }

  &:hover {
    display: flex;
    padding: 12px 28px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    background: var(--grayscale-900, linear-gradient(0deg, #353a40 0%, #353a40 100%), #25282c);
  }

  &:hover ${NavArrow} {
    visibility: visible;
  }

  ${({ $active }) =>
    $active &&
    `
    &:hover {
      background: var(
        --grayscale-900,
        linear-gradient(0deg, #353a40 0%, #353a40 100%),
        #25282c
      );
    }
  `}
`;

export const NavString = styled.span<{ $active?: boolean }>`
  flex: 1;
  min-width: 0;
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  line-height: 160%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

export const Content = styled.main`
  background: #ffffff;
  padding: 48px 40px 40px 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

export const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1105px;
  flex-direction: column;
  gap: 12px;
`;
/* -----------------------------
   공통 Row (Header / Body)
------------------------------*/
export const RowBase = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  padding: 0 20px;
  align-items: center;
  gap: 32px;
`;

/* Header는 높이 45px */
export const TableHeader = styled(RowBase)`
  height: 45px;
  background: var(--grayscale-200, #ededef);
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
  padding: 0 20px;
`;

/* Body Row */
export const TableRow = styled(RowBase)`
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
  background: #fff;
`;

/* -----------------------------
   Column widths (Figma 기반)
------------------------------*/
export const IdColumn = styled.div`
  width: 50px;
  display: flex;
  justify-content: center;
`;

export const NameColumn = styled.div`
  display: flex;
  width: 320px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

export const GenerationColumn = styled.div`
  display: flex;
  width: 80px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

export const DisplayColumn = styled.div`
  display: flex;
  width: 100px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

export const DateColumn = styled.div`
  display: flex;
  width: 140px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

export const ActionColumn = styled.div`
  display: flex;
  width: 200px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
`;
export const Heading = styled.header`
  display: inline-flex;
  height: 100px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  margin-top: 43px;
`;

export const Title = styled.h1`
  color: #000;

  /* header/h2-bold */
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 57.6px */
  align-self: stretch;
`;

export const Description = styled.p`
  color: var(--grayscale-700, #626873);

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

export const SearchBar = styled.div`
  display: flex;
  width: 100%;
  height: 45px;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 54px;
  margin-bottom: 8px;
`;

export const SearchField = styled.div`
  position: relative;
  width: 360px;
  height: 50px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  border-radius: 8px;
  display: flex;
  align-items: center;
  background: #fff;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 12px 0 44px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #1e2024;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 25.6px */

  &::placeholder {
    color: var(--grayscale-500, #9aa3b1);
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const SearchButton = styled.button`
  display: flex;
  width: 80px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: var(--primary-600-main, #4285f4);
`;
export const SearchButtonText = styled.span`
  color: var(--grayscale-100, #f9f9fa);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const TableCard = styled.section`
  display: flex;
  width: 100%;
  height: 845px;
  flex-direction: column;
  align-items: center;
  gap: 0;
  margin-top: 8px;
`;

export const IDHeaderCell = styled.span`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
  align-self: stretch;
`;

export const NameHeaderCell = styled.span`
  overflow: hidden;
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  text-overflow: ellipsis;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  flex: 1 0 0;
`;

export const GenerationHeaderCell = styled.span`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const DisplayHeaderCell = styled.span`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;
export const DateHeaderCell = styled.span`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const TableBody = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
`;

export const DateBodyCell = styled.span`
  color: var(--grayscale-900, #1e2024);
  text-align: center;

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 28.8px */
`;

export const ActionButton = styled.button`
  display: flex;
  width: 200px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
  color: var(--primary-600-main, #4285f4);
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  cursor: pointer;

  &:hover {
    background: #f6f9ff;
  }

  &:active {
    background: #e8f1ff;
  }
`;

export const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 80px auto 0;
  width: 100%;
  max-width: 100%;
`;

export const IDBodyCell = styled.span`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  align-self: stretch;
`;

export const NameBodyCell = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  flex: 1 0 0;
  overflow: hidden;
  color: var(--grayscale-1000, #040405);
  text-align: center;
  text-overflow: ellipsis;

  width: 304px;
  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

export const GenerationBodyCell = styled.span`
  color: var(--grayscale-900, #1e2024);
  text-align: flex-start;

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 28.8px */
`;

export const DisplayBodyCell = styled.span`
  color: var(--grayscale-900, #1e2024);
  text-align: center;

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 28.8px */
`;

export const PageNumberGroup = styled.div`
  display: flex;
  gap: 0;
`;

export const PageButton = styled.button<{ $active?: boolean; $isArrow?: boolean }>`
  width: ${({ $isArrow }) => ($isArrow ? '40px' : '40px')};
  height: ${({ $isArrow }) => ($isArrow ? '40px' : '40px')};
  min-width: ${({ $isArrow }) => ($isArrow ? '40px' : '40px')};
  min-height: ${({ $isArrow }) => ($isArrow ? '40px' : '40px')};
  padding: 0;
  border-radius: 12px;
  border: ${({ $isArrow }) => ($isArrow ? '1px solid #d7dadd' : 'none')};
  font-size: ${({ $isArrow }) => ($isArrow ? '18px' : '17px')};
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  background: transparent;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.1s ease;

  &:hover:not(:disabled) {
    background: ${({ $isArrow, $active }) => {
      if ($active) return '#3f7bf5';
      if ($isArrow) return '#e9edf5';
      return '#f5f7fa';
    }};
    border-color: ${({ $isArrow, $active }) =>
      $isArrow ? ($active ? '#3f7bf5' : '#c9ced8') : 'transparent'};
  }

  &:active:not(:disabled) {
    transform: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    border-color: #e2e4e8;
    background: #f5f7fa;
    color: #a0a6ad;
    transform: none;
  }
`;

export const PageInsertNum = styled.div<{ $active: boolean }>`
  width: 40px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'var(--primary-600-main, #4285f4)' : '#ffffff')};
  color: ${({ $active }) =>
    $active ? 'var(--grayscale-100, #ffffff)' : 'var(--grayscale-1000, #000000)'};
  border: none;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;

  &:hover {
    transform: translateY(-1px);
    background: ${({ $active }) => ($active ? '#3f7bf5' : '#f5f7fa')};
    border-color: ${({ $active }) => ($active ? '#3f7bf5' : '#c9ced8')};
  }

  &:focus-visible {
    outline: none;
  }
`;

export const ArrowIcon = styled.span<{ $direction: 'left' | 'right' }>`
  width: 12px;
  height: 12px;
  display: inline-block;
  background-color: currentColor;
  mask: url(${({ $direction }) => ($direction === 'left' ? '/leftarrow.svg' : '/rightarrow.svg')})
    no-repeat center / contain;
  -webkit-mask: url(${({ $direction }) =>
      $direction === 'left' ? '/leftarrow.svg' : '/rightarrow.svg'})
    no-repeat center / contain;
  pointer-events: none;
`;
export const TableBodyContainer = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  padding: 0;
  justify-content: flex-start;
  align-items: center;
  gap: 32px;
  align-self: stretch;
`;
