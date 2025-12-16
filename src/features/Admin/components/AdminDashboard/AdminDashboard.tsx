import { useEffect, useState } from 'react';
import Image from 'next/image';

import { api } from '../../../../lib/api';
import {
  CardArrow,
  Content,
  ContentContainer,
  Description,
  EmptyProjectCard,
  EmptyProjectText,
  Heading,
  MetricCard,
  MetricLabel,
  MetricRow,
  MetricUnit,
  MetricValue,
  MetricValueRow,
  ProjectCard,
  ProjectHeader,
  ProjectName,
  Section,
  SectionTitle,
  SummaryCard,
  SummaryGrid,
  SummaryHeader,
  SummaryLabel,
  SummaryUnit,
  SummaryValue,
  SummaryValueRow,
  Title,
} from '../../styles/AdminDashboard';
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
} from '../../styles/AdminProjectGallery';

type NavItem = {
  label: string;
  active?: boolean;
};

type SummaryStat = {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
};

type ProjectMetric = {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
};

type ProjectOverview = {
  id: string;
  name: string;
  metrics: ProjectMetric[];
};

type AdminDashboardProps = {
  summaryStats?: SummaryStat[];
  projects?: ProjectOverview[];
};

type DashboardResponse = {
  waitingUserCount: number;
  approvedUserCount: number;
  activeProjects: Array<{
    id: number;
    projectName: string;
    ideaCount: number;
    currentParticipants: number;
    maxMemberCount: number;
    currentScheduleType: string;
    currentScheduleDeadline: string;
  }>;
};

const NAV_ITEMS: NavItem[] = [
  { label: '대시보드', active: true },
  { label: '가입 심사' },
  { label: '멤버 관리' },
  { label: '프로젝트 관리' },
  { label: '아이디어 관리' },
  { label: '프로젝트 갤러리 관리' },
  { label: '액티비티 관리' },
];

export default function AdminDashboard({ summaryStats = [], projects = [] }: AdminDashboardProps) {
  const [fetchedStats, setFetchedStats] = useState<SummaryStat[] | null>(null);
  const [fetchedProjects, setFetchedProjects] = useState<ProjectOverview[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // API 응답 데이터를 SummaryStat[] 형태로 변환
    const normalizeStats = (data: DashboardResponse): SummaryStat[] => {
      const stats: SummaryStat[] = [];

      if (typeof data.waitingUserCount === 'number') {
        stats.push({
          id: 'waiting',
          label: '가입 승인 대기 중',
          value: data.waitingUserCount,
          unit: '명',
        });
      }

      if (typeof data.approvedUserCount === 'number') {
        stats.push({
          id: 'approved',
          label: '전체 회원 수',
          value: data.approvedUserCount,
          unit: '명',
        });
      }

      return stats;
    };

    // API 응답 데이터를 ProjectOverview[] 형태로 변환
    const normalizeProjects = (data: DashboardResponse): ProjectOverview[] => {
      if (!data.activeProjects || !Array.isArray(data.activeProjects)) {
        return [];
      }

      return data.activeProjects.map(project => ({
        id: String(project.id),
        name: project.projectName,
        metrics: [
          {
            id: 'ideas',
            label: '아이디어',
            value: project.ideaCount,
            unit: '개',
          },
          {
            id: 'participants',
            label: '참여 인원',
            value: `${project.currentParticipants}/${project.maxMemberCount}`,
            unit: '명',
          },
        ],
      }));
    };

    const fetchDashboard = async () => {
      try {
        setError(null);
        const res = await api.get<DashboardResponse>('/admin/dashboard');
        if (cancelled) return;

        const data = res.data;
        setFetchedStats(normalizeStats(data));
        setFetchedProjects(normalizeProjects(data));
      } catch {
        if (cancelled) return;
        setError('대시보드 정보를 불러오지 못했습니다.');
        setFetchedStats([]);
        setFetchedProjects([]);
      }
    };

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  // API에서 가져온 데이터가 있으면 사용, 없으면 props 사용
  const statsToRender = fetchedStats && fetchedStats.length > 0 ? fetchedStats : summaryStats;
  const projectsToRender = fetchedProjects ?? projects ?? [];
  const hasProjects = projectsToRender.length > 0;

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
          <ProfileName>윤준석</ProfileName>
          <ProfileTitle>님</ProfileTitle>
        </ProfileDetails>

        <Nav>
          {NAV_ITEMS.map(item => (
            <NavButton key={item.label} type="button" $active={item.active}>
              <NavString $active={item.active}>
                <span>{item.label}</span>
              </NavString>

              <NavArrow aria-hidden="true" $visible={Boolean(item.active)}>
                <Image src="/rightarrow_admin.svg" alt="" width={16} height={16} />
              </NavArrow>
            </NavButton>
          ))}

          <NavButton key="home-exit" type="button">
            <NavString>
              <span>홈 화면으로 나가기</span>
            </NavString>
          </NavButton>
        </Nav>
      </Sidebar>

      <Content>
        <ContentContainer>
          <Heading>
            <Title>대시보드</Title>
            <Description>
              서비스의 주요 통계와 진행 중인 프로젝트 현황을 확인할 수 있습니다.
            </Description>
            {error ? (
              <Description style={{ color: '#ea4335', marginTop: '8px' }}>{error}</Description>
            ) : null}
          </Heading>

          <SummaryGrid>
            {statsToRender.map(stat => (
              <SummaryCard key={stat.id}>
                <SummaryHeader>
                  <SummaryLabel>{stat.label}</SummaryLabel>
                  <CardArrow aria-hidden="true">
                    <Image src="/rightarrow.svg" alt="" width={8.469} height={16} />
                  </CardArrow>
                </SummaryHeader>
                <SummaryValueRow>
                  <SummaryValue>{stat.value}</SummaryValue>
                  {stat.unit ? <SummaryUnit>{stat.unit}</SummaryUnit> : null}
                </SummaryValueRow>
              </SummaryCard>
            ))}
          </SummaryGrid>

          <Section>
            <SectionTitle>진행중인 프로젝트</SectionTitle>

            {hasProjects ? (
              projectsToRender.map(project => (
                <ProjectCard key={project.id}>
                  <ProjectHeader>
                    <ProjectName>{project.name}</ProjectName>
                    <CardArrow aria-hidden="true">
                      <Image src="/rightarrow.svg" alt="" width={16} height={16} />
                    </CardArrow>
                  </ProjectHeader>

                  <MetricRow>
                    {project.metrics.map(metric => (
                      <MetricCard key={metric.id}>
                        <MetricLabel>{metric.label}</MetricLabel>
                        <MetricValueRow>
                          <MetricValue>{metric.value}</MetricValue>
                          {metric.unit ? <MetricUnit>{metric.unit}</MetricUnit> : null}
                        </MetricValueRow>
                      </MetricCard>
                    ))}
                  </MetricRow>
                </ProjectCard>
              ))
            ) : (
              <EmptyProjectCard>
                <EmptyProjectText>진행중인 프로젝트가 없습니다.</EmptyProjectText>
              </EmptyProjectCard>
            )}
          </Section>
        </ContentContainer>
      </Content>
    </Page>
  );
}
