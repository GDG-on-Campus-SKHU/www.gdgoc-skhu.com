import { TechStack, useTechStackOptions, useUserLinkOptions } from '@/lib/mypageProfile.api';
import { fetchUserProfile } from '@/lib/adminMember.api';
import { Generation, UserLink } from '@/lib/mypageProfile.api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { css } from '@emotion/react';
import { colors } from '@/styles/constants';
import dynamic from 'next/dynamic';

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview').then(mod => mod.default), {
  ssr: false,
});

type Props = {
  memberProps?: MemberProfile;
  onBack?: () => void;
};

type MemberProfile = {
  userId: number;
  name: string;
  school: string;
  generations: Generation[];
  part: string;
  techStacks: TechStack[];
  userLinks: UserLink[];
  introduction: string;
};

const AdminMemberProfile = ({ memberProps, onBack }: Props) => {
  const { data: techStackOptions = [] } = useTechStackOptions();
  const { data: userLinkOptions = [] } = useUserLinkOptions();

  const router = useRouter();
  const userIdParam = router.query.userId;

  const parsedUserId = typeof userIdParam === 'string' ? Number(userIdParam) : null;
  const [member, setMember] = useState<MemberProfile | null>(null);

  useEffect(() => {
    if (memberProps !== undefined) {
      setMember(memberProps);
      return;
    }

    if (!parsedUserId) return;

    const fetchData = async () => {
      const member = await fetchUserProfile(parsedUserId);
      setMember(member);
    };

    fetchData();
  }, [parsedUserId, memberProps]);

  const sortedGenerations = useMemo(() => {
    if (!member) return [];

    return [...member.generations].sort((a, b) => {
      if (a.isMain === b.isMain) return 0;
      return a.isMain ? -1 : 1;
    });
  }, [member]);

  const handleUserProfileEdit = (userId: number) => {
    router.push(`/admin-member/${userId}/edit`);
  };

  if (!member) {
    return <div>로딩 중...</div>;
  }

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

          {onBack ? (
            <PrimaryButton type="button" onClick={onBack}>
              <PrimaryButtonText>돌아가기</PrimaryButtonText>
            </PrimaryButton>
          ) : (
            <PrimaryButton type="button" onClick={() => handleUserProfileEdit(member.userId)}>
              <PrimaryButtonText>수정하기</PrimaryButtonText>
            </PrimaryButton>
          )}
        </DetailHeader>

        <ProfileSection>
          <FieldRow>
            <FieldLabel>학교</FieldLabel>
            <FieldValue>{member.school}</FieldValue>
          </FieldRow>

          <FieldRow>
            <FieldLabel>역할</FieldLabel>
            <Chips>
              {sortedGenerations.map(gen => (
                <Chip key={gen.id ?? `${gen.generation}-${gen.position}`} $active={gen.isMain}>
                  <ChipText $active={gen.isMain}>
                    {gen.generation} {gen.position}
                  </ChipText>
                </Chip>
              ))}
            </Chips>
          </FieldRow>

          <FieldRow>
            <FieldLabel>파트</FieldLabel>
            <FieldValue>{member.part}</FieldValue>
          </FieldRow>

          <VerticalFieldGroup>
            <FieldLabel>기술스택</FieldLabel>

            <TechStackList>
              {member.techStacks.map(stack => {
                const option = techStackOptions.find(opt => opt.code === stack.techStackType);

                if (!option) return null;

                return (
                  <TechStackIcon key={stack.techStackType}>
                    <img src={option.iconUrl} alt={option.displayName} width={36} height={36} />
                  </TechStackIcon>
                );
              })}
            </TechStackList>
          </VerticalFieldGroup>

          <VerticalFieldGroup>
            <FieldLabel>링크</FieldLabel>

            <LinkButtons>
              {member.userLinks.map((link, idx) => {
                const option = userLinkOptions.find(opt => opt.type === link.linkType);

                return (
                  <a
                    key={`${link.linkType}-${idx}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={option?.iconUrl || '/icon/link.svg'}
                      alt={option?.name || link.linkType}
                      width={24}
                      height={24}
                    />
                  </a>
                );
              })}
            </LinkButtons>
          </VerticalFieldGroup>

          <IntroSection>
            <FieldLabel>자기소개</FieldLabel>
            <div css={boxCss} data-color-mode="light">
              <MDPreview source={member.introduction} />
            </div>
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

const Chip = styled.span<{ $active?: boolean }>`
  border-radius: 4px;
  background-color: ${({ $active }) =>
    $active ? 'var(--primary-100, #d9e7fd)' : 'var(--gray-100, #f1f3f5)'};
  display: flex;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const ChipText = styled.span<{ $active?: boolean }>`
  color: ${({ $active }) =>
    $active ? 'var(--primary-600-main, #4285f4)' : 'var(--gray-500, #868e96)'};

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

const boxCss = css`
  margin-top: 1.5rem;
  border-radius: 8px;
  outline: 1px ${colors.grayscale[400]} solid;
  outline-offset: -1px;
  padding: 32px;
  background: #fff;
  min-height: 400px;

  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    font-family: 'Pretendard', sans-serif;
  }

  & code {
    font-family: 'Courier New', monospace;
  }
`;