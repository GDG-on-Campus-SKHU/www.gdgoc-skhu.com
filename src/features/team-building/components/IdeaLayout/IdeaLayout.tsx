import React from 'react';
import styled from 'styled-components';

const MOBILE_BREAKPOINT = '768px';
const SMALL_BREAKPOINT = '540px';

const Container = styled.div.withConfig({ componentId: 'TeamBuildingLayout__Container' })<{
  $isModalOpen?: boolean;
}>`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #000;
  font-family: 'Pretendard', sans-serif;
  padding: 2rem 2.5rem 2.5rem;
  position: relative;
  z-index: 1;

  /* 모달이 켜졌을 때 배경 blur 적용 - IdeaForm에서는 자체적으로 blur 처리 */
  ${({ $isModalOpen }) =>
    $isModalOpen &&
    `
    /* IdeaForm은 자체 blur 처리하므로 여기서는 적용하지 않음 */
  `}

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 1.75rem 1.75rem 2.75rem;
  }

  @media (max-width: ${SMALL_BREAKPOINT}) {
    padding: 1.5rem 1.25rem 2.5rem;
  }
`;

const Wrapper = styled.div.withConfig({ componentId: 'TeamBuildingLayout__Wrapper' })`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1.withConfig({ componentId: 'TeamBuildingLayout__Title' })`
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.6rem;
  }

  @media (max-width: ${SMALL_BREAKPOINT}) {
    font-size: 1.45rem;
  }
`;

const Subtitle = styled.h2.withConfig({ componentId: 'TeamBuildingLayout__Subtitle' })`
  font-size: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.3rem;
  }

  @media (max-width: ${SMALL_BREAKPOINT}) {
    font-size: 1.15rem;
  }
`;

type IdeaLayoutProps = {
  children?: React.ReactNode;
  showHeading?: boolean;
  isModalOpen?: boolean; // 🔥 추가된 Props
};

export default function IdeaLayout({
  children,
  showHeading = true,
  isModalOpen = false,
}: IdeaLayoutProps) {
  return (
    <Container $isModalOpen={isModalOpen}>
      <Wrapper>
        {showHeading && (
          <>
            <Title>Team Building</Title>
            <Subtitle>그로우톤</Subtitle>
          </>
        )}
        {children}
      </Wrapper>
    </Container>
  );
}
