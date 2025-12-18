import { useEffect, useState } from 'react';
import Image from 'next/image';

import { api } from '../../../../lib/api';
import {
  CardArrow,
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
import { useRouter } from 'next/router';

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

export default function AdminDashboard({ summaryStats = [], projects = [] }: AdminDashboardProps) {
  const router = useRouter();

  const [fetchedStats, setFetchedStats] = useState<SummaryStat[] | null>(null);
  const [fetchedProjects, setFetchedProjects] = useState<ProjectOverview[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

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

    const normalizeProjects = (data: DashboardResponse): ProjectOverview[] => {
      if (!Array.isArray(data.activeProjects)) {
        return [];
      }

      return data.activeProjects.map(project => {
        const metrics: ProjectMetric[] = [
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
        ];

        // 1차 팀빌딩 마감까지 남은 시간 계산
        if (project.currentScheduleDeadline) {
          const now = new Date();
          const deadline = new Date(project.currentScheduleDeadline);
          const diffMs = deadline.getTime() - now.getTime();

          let timeRemaining = '';

          if (diffMs > 0) {
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
              timeRemaining = `${days}일 ${hours}시간 ${minutes}분`;
            } else if (hours > 0) {
              timeRemaining = `${hours}시간 ${minutes}분`;
            } else {
              timeRemaining = `${minutes}분`;
            }
          } else {
            timeRemaining = '마감됨';
          }

          metrics.push({
            id: 'deadline',
            label: '1차 팀빌딩 마감',
            value: timeRemaining,
          });
        }

        return {
          id: String(project.id),
          name: project.projectName,
          metrics,
        };
      });
    };

    const fetchDashboard = async () => {
      try {
        setError(null);
        const res = await api.get<DashboardResponse>('/admin/dashboard');
        if (cancelled) return;

        setFetchedStats(normalizeStats(res.data));
        setFetchedProjects(normalizeProjects(res.data));
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

  const summaryRouteMap: Record<string, string> = {
    waiting: '/AdminSubsScreening',
    approved: '/admin-member',
  };

  const statsToRender = fetchedStats && fetchedStats.length > 0 ? fetchedStats : summaryStats;
  const projectsToRender = fetchedProjects ?? projects ?? [];
  const hasProjects = projectsToRender.length > 0;

  return (
    <ContentContainer>
      <Heading>
        <Title>대시보드</Title>
        <Description>
          서비스의 주요 통계와 진행 중인 프로젝트 현황을 확인할 수 있습니다.
        </Description>
        {error && <Description style={{ color: '#ea4335' }}>{error}</Description>}
      </Heading>

      <SummaryGrid>
        {statsToRender.map(stat => (
          <SummaryCard key={stat.id}>
            <SummaryHeader
              role="button"
              tabIndex={0}
              clickable={Boolean(summaryRouteMap[stat.id])}
              onClick={() => {
                const route = summaryRouteMap[stat.id];
                if (route) router.push(route);
              }}
              onKeyDown={e => {
                if (e.key !== 'Enter') return;
                const route = summaryRouteMap[stat.id];
                if (route) router.push(route);
              }}
            >
              <SummaryLabel>{stat.label}</SummaryLabel>
              <CardArrow aria-hidden="true">
                <Image src="/rightarrow.svg" alt="" width={8.469} height={16} />
              </CardArrow>
            </SummaryHeader>
            <SummaryValueRow>
              <SummaryValue>{stat.value}</SummaryValue>
              {stat.unit && <SummaryUnit>{stat.unit}</SummaryUnit>}
            </SummaryValueRow>
          </SummaryCard>
        ))}
      </SummaryGrid>

      <Section>
        <SectionTitle>진행중인 프로젝트</SectionTitle>

        {hasProjects ? (
          projectsToRender.map(project => (
            <ProjectCard key={project.id}>
              <ProjectHeader clickable
                role="button"
                tabIndex={0}
                onClick={() => {
                  router.push('/admin-project');
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    router.push('/admin-project');
                  }
                }}
              >
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
                      {metric.unit && <MetricUnit>{metric.unit}</MetricUnit>}
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
  );
}
