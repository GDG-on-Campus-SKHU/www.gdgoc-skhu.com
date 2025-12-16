import styled from 'styled-components';

import Button from '../../team-building/components/Button';

export const Content = styled.main`
  background: #ffffff;
  height: 2181px;
  padding: 20px 45px 0 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  width: 100%;
`;
export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1105px;
  max-width: 1105px;

  /* 아래 여백을 항상 정확히 41px로 유지 */
`;
export const Heading = styled.header`
  display: inline-flex;
  height: 100px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  margin-top: 91px;
  margin-bottom: 30px;
`;

export const Title = styled.h1`
  align-self: stretch;
  color: #000;

  /* header/h2-bold */
  font-family: Pretendard;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
`;

export const Description = styled.p`
  color: var(--grayscale-700, #626873);

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;
export const Page = styled.div`
  display: grid;
  grid-template-columns: 255px 1fr;

  background: #ffffff;
`;
export const Sidebar = styled.aside`
  background: var(--grayscale-800, #454b54);
  display: flex;
  width: 255px;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: auto;
  overflow-y: auto;
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
export const ImageContainer = styled.div`
  aspect-ratio: 30/19;4
  width: 60px;
  height: 38px;
`;

export const PreviewCanvas = styled.div`
  display: flex;
  flex-direction: column;

  gap: 20px;
  width: 100%;
  max-width: 1080px;
  padding-top: 0;
`;

export const ResponsiveWrapper = styled.div`
  width: 100%;
`;

export const TitleSection = styled.section`
  display: flex;
  width: 100%;
  padding: 50px 0 20px 0;
  flex-direction: column;
  align-items: flex-start;
  border-top: 1px solid var(--grayscale-400, #c3c6cb);
`;

export const TitleText = styled.h1`
  margin: 0;
  color: #040405;
  font-family: 'Pretendard';
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  text-align: left;
`;

export const IntroText = styled.p`
  overflow: hidden;
  color: var(--grayscale-1000, #040405);
  text-overflow: ellipsis;

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 38.4px */
`;

export const IntroRow = styled.div`
  display: flex;
  width: 100%;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: nowrap;

  ${IntroText} {
    flex: 1;
  }
`;
export const MentorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: auto;
  align-items: flex-end;
  text-align: right;
`;
export const MentorPart = styled.p`
  margin: 0;
  font-size: 0.98rem;
  color: #030213;
  font-weight: 400;
  line-height: 160%;
`;
export const Mentor = styled.p`
  margin: 0;
  font-size: 0.98rem;
  color: #030213;
  font-weight: 600;
  line-height: 160%;
`;

export const MembersSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  align-items: flex-start;
`;

export const SubjectLabel = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
`;

export const SubjectValue = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;
export const MemberCard = styled.div`
  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  background: #fff;
  display: flex;
  width: 1080px;
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

export const MemberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  align-self: stretch;
`;

export const MemberCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const RoleName = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b3/b3-bold */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 28.8px */
`;

export const CountStat = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 24px;
  font-weight: 700;
  color: #4285f4;
  line-height: 160%;
`;
export const CountNum = styled.span`
  color: var(--primary-600-main, #4285f4);
  text-align: right;

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;
export const CountUnit = styled.span`
  color: var(--grayscale-1000, #040405);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  text-align: right;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const DescriptionSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0 0;
`;

export const DescriptionBox = styled.div`
  width: 1080px;
  height: 400px;
  border-radius: 10px;
  border: 1px solid #e0e2e5;
  background: #ffffff;
  padding: 26px 28px;
  min-height: 320px;
  color: #040405;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;

  * {
    color: var(--grayscale-1000, #040405);

    /* body/b4/b4 */
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 160%;
  }

  h1,
  h2,
  h3 {
    margin: 0 0 12px;
    font-weight: 500;
    font-style: normal;
    line-height: 160%;
  }

  h1 {
    font-size: 24px;
    font-weight: 500;
  }

  h2 {
    font-size: 20px;
    font-weight: 500;
  }

  h3 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
  }

  p {
    margin: 0 0 16px;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
  }
`;

export const ActionButton = styled.button`
  width: 300px;
  height: 50px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  line-height: 160%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
export const PrimaryButton = styled(ActionButton)`
  border: 1px solid #4285f4;
  background: #4285f4;
  color: #f9f9fa;
  padding: 10px 8px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalCard = styled.div<{ $compact?: boolean }>`
  display: flex;
  width: 500px;
  padding: 40px 20px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
`;

export const ModalInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  color: var(--grayscale-1000, #040405);
  text-align: center;

  font-family: Pretendard;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
`;

export const ModalTitleComplete = styled.h3`
  margin: 0;
  color: var(--grayscale-1000, #040405);
  text-align: center;

  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

export const ModalMessage = styled.p`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 16px;
`;

export const MyDeleteButton = styled(Button)`
  border-radius: 8px;
  background: var(--primary-600-main, #4285f4);
  display: flex;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
`;
export const MyCancelButton = styled(Button)`
  display: flex;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
`;

export const DeleteButtonText = styled.span`
  color: var(--grayscale-100, #f9f9fa);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;
export const CancelButtonText = styled.span`
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

export const MyConfirmButton = styled(Button)`
  display: flex;
  width: 100%;
  height: 56px;
  padding: 10px 16px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  background: var(--primary-600-main, #4285f4);
`;

export const ModalSuccessCard = styled.div<{ $compact?: boolean }>`
  display: flex;
  width: 500px;
  height: auto;
  padding: 40px 20px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.2);
`;

export const ModalSuccessCardTitle = styled.h3`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  margin: 0;

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;

export const MySuccessButtonText = styled.span`
  color: var(--grayscale-100, #f9f9fa);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;
