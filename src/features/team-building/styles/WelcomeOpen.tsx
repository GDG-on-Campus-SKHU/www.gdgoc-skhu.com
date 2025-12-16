import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

import { colors } from '../../../styles/constants/colors';
import SelectBoxBasic from '../components/SelectBoxBasic';

export const Container = styled.div`
  width: 100%;
  min-height: 1024px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  padding: 0 1.5rem;
  font-family: 'Pretendard', sans-serif;
  color: #040405;
`;

export const Wrapper = styled.div`
  width: min(1080px, 100%);
  padding: 24px 0 120px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const TitleSection = styled.section`
  display: flex;
  width: 1080px;
  padding: 100px 0 20px 0;
  flex-direction: column;
  align-items: flex-start;
`;

export const Title = styled.h1`
  dcolor: var(--grayscale-1000, #040405);

  /* header/h1-bold */
  font-family: Pretendard;
  font-size: 50px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 80px */
  align-self: stretch;
`;
export const FilterContainer = styled.div`
  display: flex;
  width: min(1080px, 100%);
  padding: 10px 0;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: nowrap;
  min-height: 64px;
  margin-top: 6px;
  margin-bottom: 30px;
`;
export const ProjectTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 58px;
`;

export const Subtitle = styled.h2`
  color: var(--grayscale-1000, #040405);

  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 0;
`;

export const StatusBar = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  gap: clamp(1rem, 35vw, 717px);
  width: 100%;
  min-height: 70px;
`;

export const StatusText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 25px;
`;

export const StatusLabel = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;

export const StatusCount = styled.span`
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const StatusActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const RegisterButtonLink = styled(Link)`
  display: inline-flex;
  text-decoration: none;
`;

export const TopicSelectBox = styled(SelectBoxBasic)`
  display: flex;
  width: 496px;
  max-width: 100%;
  flex: 0 0 496px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex-shrink: 0;
  align-self: flex-start;

  & > div:first-of-type {
    position: relative;
    padding-right: 48px;

    /* Hide default arrow from SelectBoxBasic */
    & > svg {
      display: none;
    }
  }

  & > div:first-of-type::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 16px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%) rotate(0deg);
    background-image: url('/dropdownarrow.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transition: transform 0.2s ease;
    pointer-events: none;
  }

  & > div:first-of-type.open::after {
    transform: translateY(-50%) rotate(180deg);
  }
`;

export const StateRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

export const StateLabel = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 28.8px */
`;

export const StateToggle = styled.div<{ $active: boolean }>`
  position: relative;
  border-radius: 18px;
  display: flex;
  width: 72px;
  height: 36px;
  padding: ${({ $active }) => ($active ? '3px 3px 3px 39px' : '3px 39px 3px 3px')};
  justify-content: ${({ $active }) => ($active ? 'flex-end' : 'flex-start')};
  align-items: center;
  cursor: pointer;
  background: ${({ $active }) =>
    $active ? 'var(--primary-600-main, #4285F4)' : 'var(--grayscale-400, #C3C6CB)'};
  transition:
    padding 0.2s ease,
    background 0.2s ease,
    justify-content 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 30px;
    height: 30px;
    border-radius: 18px;
    background: #f9f9fa;

    transform: ${({ $active }) => ($active ? 'translateX(36px)' : 'translateX(0)')};
    transition: transform 0.2s ease;
  }

  & > div {
    opacity: 0;
  }
`;

export const EmptyCard = styled.div`
  width: 1080px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  background: #fff;
`;

export const EmptyMessage = styled.p`
  color: var(--grayscale-900, #25282c);
  text-align: center;

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 38.4px */
`;

export const IdeaHeaderRow = styled.div`
  display: flex;
  width: 1080px;
  padding: 8px 0;
  align-items: center;
  gap: 40px;
  border-bottom: 1px solid var(--grayscale-200, #ededef);
  background: var(--grayscale-200, #ededef);
`;
export const NumberCTNR = styled.div`
  width: 100px;
  height: 29px;
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  width: 100px;
  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;
export const IdeaContentCTNR = styled.div`
  width: 660px;
  height: 29px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  align-self: stretch;
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
`;
export const ApplyCTNR = styled.div`
  width: 100px;
  height: 29px;
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
  width: 100px;
  flex-shrink: 0;
`;
export const RecruitStatusCTNR = styled.div`
  width: 100px;
  height: 29px;
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
  width: 100px;
`;

export const IdeaItemCTNR = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  align-self: stretch;
`;
export const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 36px auto 0;
  width: fit-content;
  border-radius: 8px;
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
    transform 0.15s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ $isArrow, $active }) => {
      if ($active) return '#3f7bf5';
      if ($isArrow) return '#e9edf5';
      return '#f5f7fa';
    }};
    border-color: ${({ $isArrow, $active }) =>
      $isArrow ? ($active ? '#3f7bf5' : '#c9ced8') : 'transparent'};
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
  min-width: 40px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  text-align: center;
  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
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

export const GrowthonLogo = styled(Image)`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
`;

export const ScheduleModalOverlay = styled.div`
  position: fixed;
  inset: 0;

  /* 🔥 실제 보이는 결과 값이 정확히 180(0.706)이 되도록 계산된 배경 */
  background: rgba(88, 88, 88, 0.45);

  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 9999;
`;

export const ScheduleModalCard = styled.div`
  width: min(640px, 100%);
  max-height: min(90vh, 840px);
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.18);
  padding: 40px 40px;
  overflow-y: auto;

  position: relative;
  width: 480px;
  height: 796px;
`;

export const ScheduleModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
`;

export const ScheduleModalTitle = styled.h3`
  align-self: stretch;
  color: var(--grayscale-1000, #040405);

  /* header/h2-bold */
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 57.6px */
`;

export const ScheduleModalSubtitle = styled.p`
  color: var(--grayscale-1000, #040405);

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 38.4px */
`;

export const ScheduleModalCloseButton = styled.button`
  width: 36px;
  height: 36px;

  &:hover {
    background: ${colors.grayscale[200]};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ScheduleSteps = styled.ol`
  display: flex;
  width: 400px;
  flex-direction: column;
  gap: 32px;
`;

export const ScheduleStep = styled.li<{ $isLast: boolean }>`
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 40px;
  position: relative;
  align-items: flex-start;
`;

export const ScheduleMarker = styled.div<{ $isLast: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-self: stretch;
  align-items: flex-start;

  &::after {
    content: '';
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% + 28px);
    background: ${colors.grayscale[300]};
    display: ${({ $isLast }) => ($isLast ? 'none' : 'block')};
  }
`;

export const ScheduleDot = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 6px solid var(--primary-600-main, #4285f4);
  background: #fff;
  z-index: 1;
  margin-top: 9px;
`;

export const ScheduleStepTitle = styled.p`
  color: var(--grayscale-1000, #040405);

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;

export const ScheduleStepDate = styled.p`
  color: var(--primary-600-main, #4285f4);

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;
