import type { NextPage } from 'next';
import Image from 'next/image';
import styled from 'styled-components';

type MemberProfile = {
  name: string;
  school: string;
  roles: string[];
  part: string;
  techStacks: Array<{ name: string; icon: string }>; // 수정: 객체 배열로 변경
  links: Array<{ type: string; label: string }>;
  introduction: string;
};

// 기술스택 아이콘 매핑
const TECH_STACK_ICONS: Record<string, string> = {
  Ae: '/techstack/ae.svg',
  Ai: '/techstack/ai.svg',
  Ps: '/techstack/ps.svg',
  Figma: '/techstack/figma.svg',
  Xd: '/techstack/xd.svg',
  React: '/techstack/react.svg',
  Vue: '/techstack/vue.svg',
  Angular: '/techstack/angular.svg',
  TypeScript: '/techstack/typescript.svg',
  JavaScript: '/techstack/javascript.svg',
  Node: '/techstack/node.svg',
  Python: '/techstack/python.svg',
  Java: '/techstack/java.svg',
  Spring: '/techstack/spring.svg',
  Swift: '/techstack/swift.svg',
  Kotlin: '/techstack/kotlin.svg',
  Flutter: '/techstack/flutter.svg',
  // 필요한 기술스택 추가
};

const MOCK_PROFILE: MemberProfile = {
  name: '주현지',
  school: '성공회대학교',
  roles: ['25-26 Member', '24-25 Core', '23-24 Member'],
  part: 'Design',
  techStacks: [
    { name: 'Ae', icon: '/icon/Adobe After Effect.svg' },
    { name: 'Ae', icon: '/icon/Adobe After Effect.svg' },
    { name: 'Ae', icon: '/icon/Adobe After Effect.svg' },
    { name: 'Ae', icon: '/icon/Adobe After Effect.svg' },
    { name: 'Ae', icon: '/icon/Adobe After Effect.svg' },
  ],
  links: [
    { type: 'github', label: 'GitHub' },
    { type: 'notion', label: 'Notion' },
    { type: 'link', label: '링크 1' },
    { type: 'link', label: '링크 2' },
  ],
  introduction: '자기소개 내용',
};

const AdminMemberProfile: NextPage = () => {
  const member = MOCK_PROFILE;

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
        <Header>
          <Title>멤버 관리</Title>
          <Subtitle>승인된 모든 회원의 정보를 관리할 수 있습니다.</Subtitle>
        </Header>

        <DetailHeader>
          <MemberName>{member.name}</MemberName>
          <PrimaryButton type="button">
            <PrimaryButtonText>수정하기</PrimaryButtonText>
          </PrimaryButton>
        </DetailHeader>

        <ProfileSection>
          {/* 학교, 역할, 파트 - 가로 정렬 */}
          <FieldRow>
            <FieldLabel>학교</FieldLabel>
            <FieldValue>{member.school}</FieldValue>
          </FieldRow>

          <FieldRow>
            <FieldLabel>역할</FieldLabel>
            <Chips>
              {member.roles.map(role => (
                <Chip key={role}>{role}</Chip>
              ))}
            </Chips>
          </FieldRow>

          <FieldRow>
            <FieldLabel>파트</FieldLabel>
            <FieldValue>{member.part}</FieldValue>
          </FieldRow>

          {/* 기술스택 - 세로 정렬 */}
          <VerticalFieldGroup>
            <FieldLabel>기술스택</FieldLabel>
            <TechStackList>
              {member.techStacks.map((stack, idx) => (
                <TechStackIcon key={`${stack.name}-${idx}`}>
                  <Image src={stack.icon} alt={stack.name} width={36} height={36} />
                </TechStackIcon>
              ))}
            </TechStackList>
          </VerticalFieldGroup>

          {/* 링크 - 세로 정렬 */}
          <VerticalFieldGroup>
            <FieldLabel>링크</FieldLabel>
            <LinkButtons>
              {member.links.map(link => (
                <LinkButton key={`${link.type}-${link.label}`}>
                  {link.type === 'github' && (
                    <Image src="/github.svg" alt="GitHub" width={24} height={24} />
                  )}
                  {link.type === 'notion' && (
                    <Image src="/Notion.svg" alt="Notion" width={24} height={24} />
                  )}
                  {link.type === 'link' && (
                    <Image src="/icon/link.svg" alt="Link" width={24} height={24} />
                  )}
                </LinkButton>
              ))}
            </LinkButtons>
          </VerticalFieldGroup>

          {/* 자기소개 - 세로 정렬 */}
          <IntroSection>
            <FieldLabel>자기소개</FieldLabel>
            <IntroArea readOnly value={member.introduction} />
          </IntroSection>
        </ProfileSection>
      </MainContent>
    </Container>
  );
};

export default AdminMemberProfile;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  line-height: normal;
  letter-spacing: normal;
  overflow: visible;
`;

const Sidebar = styled.div`
  width: 255px;
  min-height: 100vh;
  background-color: #454b54;
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
  padding: 0 45px 0 40px; /* margin 대신 padding 사용 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  overflow-x: hidden; /* 가로 스크롤 방지 */
`;

const Header = styled.div`
  display: flex;
  width: 472px;
  height: 100px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 60px;
  margin-top: 91px;
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
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  width: 100%;
  max-width: 1080px;
  box-sizing: border-box;
`;

const MemberName = styled.h2`
  color: var(--grayscale-1000, #040405);
  margin: 0;
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const PrimaryButton = styled.button`
  display: flex;
  width: 200px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;

  &:hover {
    background: rgba(66, 133, 244, 0.08);
  }
`;

const PrimaryButtonText = styled.span`
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;
const ProfileSection = styled.div`
  width: 100%;
  max-width: 1080px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 40px;
  padding-bottom: 40px;
  box-sizing: border-box;
`;

/* 가로 정렬 (학교, 역할, 파트) */
const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  gap: 20px;
`;

/* 세로 정렬 (기술스택, 링크) */
const VerticalFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FieldLabel = styled.span`
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const FieldValue = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 38.4px */
`;

const Chips = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Chip = styled.span`
  display: flex;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  background: var(--primary-100, #d9e7fd);
  color: var(--primary-600-main, #4285f4);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const TechStackList = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const TechStackIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const LinkButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const LinkButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e0e2e5;
  background: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 0;

  &:hover {
    background: #f8f9fb;
  }
`;

const IntroSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding-top: 16px; /* 24px(기본 gap) + 16px = 40px */
`;

const IntroArea = styled.textarea`
  display: flex;
  width: 100%; /* 고정값 대신 100%로 변경 */
  max-width: 1080px;
  height: 400px;
  padding: 32px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  background: #fff;
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  box-sizing: border-box; /* padding 포함 */
`;
