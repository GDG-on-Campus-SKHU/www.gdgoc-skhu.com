import styled from 'styled-components';

import {
  ArrowIcon,
  Brand,
  BrandContainer,
  BrandName,
  Content as BaseContent,
  ImageContainer,
  Nav,
  NavArrow,
  NavButton,
  NavString,
  Page,
  PageButton,
  PageInsertNum,
  PageNumberGroup,
  ProfileDetails,
  ProfileName,
  ProfileTitle,
  Sidebar,
  Title,
} from './AdminIdeaProject';

export {
  ArrowIcon,
  Brand,
  BrandContainer,
  BrandName,
  BaseContent as Content,
  ImageContainer,
  Nav,
  NavArrow,
  NavButton,
  NavString,
  Page,
  PageButton,
  PageInsertNum,
  PageNumberGroup,
  ProfileDetails,
  ProfileName,
  ProfileTitle,
  Sidebar,
  Title,
};

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
export const ContentContainer = styled.div`
  display: flex;
  width: 1105px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;
export const Cell = styled.span<{ $muted?: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  color: ${({ $muted }) => ($muted ? '#7c8088' : '#040405')};
`;

export const IdCell = styled(Cell)`
  color: #454b54;
  font-weight: 600;
  padding-right: 12px;
`;

export const StatusCell = styled(Cell)`
  color: #636a75;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
export const NameInfoRow = styled.span`
  color: #000;

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;

export const DateInfoRow = styled.span`
  color: var(--grayscale-600, #7e8590);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const ContentBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 0;
`;

export const TableWrapper = styled.section`
  width: 1105px;
  max-width: 100%;
  margin: 0 auto;
`;

export const TableHeaderRow = styled.div`
  background: var(--grayscale-200, #ededef);
  display: flex;
  height: 45px;
  padding: 0 8px;
  align-items: center;
  gap: 45px;
  align-self: stretch;
`;

export const TableBodyWrapper = styled.div`
  display: grid;
  flex-direction: column;
  background: #fff;
`;

export const TableBodyLayout = styled.div`
  display: flex;
  height: 80px;
  padding: 0 8px;
  align-items: center;
  gap: 45px;
  align-self: stretch;
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
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

export const IDCNTR = styled.div`
  display: flex;
  width: 50px;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;
export const NameCNTR = styled.div`
  display: flex;
  width: 700px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;
export const WriterCNTR = styled.div`
  display: flex;
  width: 100px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;
export const StatusCNTR = styled.div`
  display: flex;
  width: 100px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;
export const IdHeaderCell = styled.span`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const IdeaNameHeaderCell = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  flex: 1 0 0;
  overflow: hidden;
  color: var(--grayscale-600, #7e8590);
  text-overflow: ellipsis;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const WriterHeaderCell = styled.span`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const StatusHeaderCell = styled.span`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const Heading = styled.div`
  display: inline-flex;
  height: 100px;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 50px;
  gap: 4px;
`;

export const TableBody = styled.div`
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
  display: flex;
  height: 80px;
  padding: 0 8px;
  align-items: center;
  gap: 45px;
  align-self: stretch;
`;

export const IdBodyCTNR = styled.div`
  display: flex;
  width: 50px;
  padding: 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const NameBodyCTNR = styled.div`
  display: flex;
  width: 700px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

export const WriterBodyCTNR = styled.div`
  display: flex;
  width: 100px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

export const StatusBodyCTNR = styled.div`
  display: flex;
  width: 100px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

export const NameBodyCell = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  flex: 1 0 0;
  overflow: hidden;
  color: var(--grayscale-1000, #040405);
  text-overflow: ellipsis;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
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
`;

export const WriterBodyCell = styled.span<{ $muted?: boolean }>`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

export const StatusBodyCell = styled.span`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;
