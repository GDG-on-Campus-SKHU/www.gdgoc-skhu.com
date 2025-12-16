import styled from 'styled-components';

export const Page = styled.div`
  display: grid;
  grid-template-columns: 255px 40px 1fr;
  min-height: 100vh;
  background: #ffffff;
`;
export const Sidebar = styled.aside`
  background: var(--grayscale-800, #454b54);
  display: flex;
  width: 255px;
  flex-direction: column;
  align-items: flex-start;
  height: 1440px; /* ✔ 고정 px → vh 로 변경 */
  overflow-y: auto; /* ✔ 내부 스크롤 허용 */
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

  /* body/b2/b2-light */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
`;

export const ProfileTitle = styled.span`
  display: inline-flex;
  align-items: center;
  color: #fff;
  text-align: center;

  /* body/b4/b4 */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 25.6px */
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

  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
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
export const ContentContainer = styled.div`
  display: flex;
  width: 1105px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;
export const Content = styled.main`
  background: #ffffff;

  /* 🔥 Heading이 top에서 91px 떨어지도록 고정 */
  padding: 91px 40px 40px 40px;

  display: flex;
  justify-content: flex-start;
  height: 100vh;
  width: 100%;
`;

export const Heading = styled.header`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

export const Title = styled.h1`
  color: #000;

  /* header/h2-bold */
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 57.6px */
`;

export const Description = styled.p`
  color: var(--grayscale-700, #626873);

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
`;

export const TableCard = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;

  /* 🔥 Heading 아래 간격을 66px로 고정 */
  padding-top: 66px;
`;

export const TableHeader = styled.div`
  background: var(--grayscale-200, #ededef);
  display: flex;
  width: 100%;
  height: 45px;
  padding: 0 8px;
  justify-content: flex-start;
  align-items: center;
  gap: 40px;
  align-self: stretch;
`;

export const HeaderCell = styled.span`
  overflow: hidden;
  color: var(--grayscale-600, #7e8590);
  text-overflow: ellipsis;

  font-family: Pretendard;
  font-size: clamp(14px, 1.25vw, 18px); /* 🔥 반응형 폰트 */
  font-style: normal;
  font-weight: 500;
  line-height: 160%;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  flex: 1 0 0;
`;

export const TableBody = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

export const TableRow = styled.div`
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
  display: flex;
  height: 80px;
  padding: 0 8px;
  align-items: center;

  /** 기존: gap: 40px;
      변경: 화면 기준 비율로 변환 (2.78%)
   */
  gap: clamp(24px, 2.78vw, 40px);
  cursor: pointer;
`;
export const PJName = styled.div`
  display: flex;
  width: 600px;
  padding: 8px;
  align-items: center;
  gap: 0px;
`;

export const PJStart = styled.div`
  display: flex;
  display: flex;
  width: 200px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

export const PJEnd = styled.div`
  display: flex;
  width: 200px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;
export const PJItemName = styled.div`
  overflow: hidden;
  color: var(--grayscale-1000, #040405);
  text-overflow: ellipsis;

  font-family: Pretendard;
  font-size: clamp(16px, 1.39vw, 20px); /* 🔥 반응형 폰트 */
  font-style: normal;
  font-weight: 500;
  line-height: 160%;

  display: flex;
  width: 600px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;
export const PJItemStart = styled.div`
  display: flex;
  width: 200px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

export const PJItemEnd = styled.div`
  display: flex;
  width: 200px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

export const PJNameItemCell = styled.span`
  display: -webkit-box;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
`;

export const DateItemCell = styled.span`
  font-size: clamp(16px, 1.39vw, 20px); /* 🔥 반응형 폰트 */
  font-weight: 500;
  color: #1e2024;
  text-align: center;
`;

export const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 120px auto;
  width: 100%;
  max-width: 100%;
  border-radius: 8px;
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
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'var(--primary-600-main, #4285F4)' : '#ffffff')};
  color: ${({ $active }) =>
    $active ? 'var(--grayscale-100, #ffffff)' : 'var(--grayscale-1000, #000000)'};
  border: none;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;
  text-align: center;
  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */

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
