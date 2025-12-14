import styled from 'styled-components';

import {
  Content as BaseContent,
  ContentContainer as BaseContentContainer,
  Description as BaseDescription,
  Title as BaseTitle,
} from './AdminProjectGallery';

export const Content = styled(BaseContent)`
  padding-top: 91px;
  padding-bottom: 56px;
`;

export const ContentContainer = styled(BaseContentContainer)`
  gap: 60px;
`;

export const Heading = styled.header`
  display: inline-flex;
  height: 100px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

export const Title = styled(BaseTitle)`
  margin: 0;
`;

export const Description = styled(BaseDescription)`
  margin: 0;
`;

export const SummaryGrid = styled.div`
  display: flex;
  width: 1105px;
  height: 147px;
  align-items: center;
  gap: 20px;
`;

export const SummaryCard = styled.article`
  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  display: flex;
  padding: 28px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1 0 0;
`;

export const SummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

export const SummaryLabel = styled.span`
  color: var(--grayscale-700, #626873);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const SummaryValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: stretch;
`;

export const SummaryValue = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
`;

export const SummaryUnit = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 38.4px */
`;

export const Section = styled.section`
  display: flex;
  width: 1105px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #000;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

export const ProjectCard = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid var(--grayscale-300, #e0e2e5);
  background: #ffffff;
  overflow: hidden;
`;

export const EmptyProjectCard = styled(ProjectCard)`
  min-height: 220px;
  padding: 40px 24px;
  align-items: center;
  justify-content: center;
`;

export const EmptyProjectText = styled.span`
  color: #626873;

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 38.4px */
`;

export const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
`;

export const ProjectName = styled.h3`
  margin: 0;
  color: #000;
  font-family: Pretendard;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

export const MetricRow = styled.div`
  display: grid;
  width: 100%;
  gap: 12px;
  padding: 16px 24px 24px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;

export const MetricCard = styled.div`
  border-radius: 8px;
  background: var(--grayscale-100, #f9f9fa);
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
`;

export const MetricLabel = styled.span`
  color: var(--grayscale-700, #626873);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
  align-self: stretch;
`;

export const MetricValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: stretch;
`;

export const MetricValue = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
`;

export const MetricUnit = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 38.4px */
  display: inline-flex;
  align-items: center;
`;

export const CardArrow = styled.span`
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  color: var(--grayscale-600, #7e8590);
`;
