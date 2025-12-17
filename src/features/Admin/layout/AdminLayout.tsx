import { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useAuthStore } from '../../../lib/authStore';
import { Content } from '../styles/AdminDashboard';
import {
  Brand,
  BrandContainer,
  BrandName,
  ImageContainer,
  Nav,
  NavArrow,
  NavButton,
  NavString,
  Page,
  ProfileDetails,
  ProfileName,
  ProfileTitle,
  Sidebar,
} from '../styles/AdminProjectGallery';

type NavItem = {
  label: string;
  path: string;
};

type Props = {
  children: ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { label: '대시보드', path: '/admin' },
  { label: '가입 심사', path: '/AdminSubsScreening' },
  { label: '멤버 관리', path: '/admin-member/list' },
  { label: '프로젝트 관리', path: '/AdminProjectManage' },
  { label: '아이디어 관리', path: '/AdminIdea' },
  { label: '프로젝트 갤러리 관리', path: '/AdminProjectGallery' },
  { label: '액티비티 관리', path: '/AdminActivity' },
];

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const { pathname } = router;
  const { name } = useAuthStore(); // Zustand 스토어에서 이름 가져오기

  return (
    <Page>
      <Sidebar>
        <BrandContainer>
          <Brand>
            <ImageContainer>
              <Image src="/gdgoc_skhu_admin.svg" alt="GDGoC SKHU 로고" width={60} height={38} />
            </ImageContainer>
            <BrandName>GDGoC SKHU</BrandName>
          </Brand>
        </BrandContainer>

        <ProfileDetails>
          <ProfileName>{name || '관리자'}</ProfileName>
          <ProfileTitle>님</ProfileTitle>
        </ProfileDetails>

        <Nav>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.path || pathname.startsWith(item.path);

            return (
              <NavButton
                key={item.label}
                type="button"
                $active={isActive}
                onClick={() => router.push(item.path)}
              >
                <NavString $active={isActive}>
                  <span>{item.label}</span>
                </NavString>

                <NavArrow aria-hidden="true" $visible={isActive}>
                  <Image src="/rightarrow_admin.svg" alt="" width={16} height={16} />
                </NavArrow>
              </NavButton>
            );
          })}

          <NavButton type="button" onClick={() => router.push('/')}>
            <NavString>
              <span>홈 화면으로 나가기</span>
            </NavString>
          </NavButton>
        </Nav>
      </Sidebar>

      <Content>{children}</Content>
    </Page>
  );
}