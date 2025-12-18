import type { NextPage } from 'next';
import { ScheduleType } from '@/lib/adminProject.api';
import { colors } from '@/styles/constants';
import { css } from '@emotion/react';

import ArchivedTable, { type ColumnDef } from '../ArchivedProject/ArchivedProjectTable';

type ApiSchedule = {
  scheduleType: ScheduleType;
  startAt: string | null;
  endAt: string | null;
  isEnded?: boolean; // 서버에서 줄 수도 있어서 optional
};

type ApiParticipant = {
  id: number;
  school: string;
  name: string;
  generation: string;
  part: string;
};

type ApiProjectDetail = {
  projectName: string;
  topics: string[];
  schedules: ApiSchedule[];
  participants: ApiParticipant[];
  team: {
    maxMembers: number;
    parts: string[];
  };
};

type ScheduleRow = { id: string; category: string; status: string; period: string };

type ParticipantRow = ApiParticipant & {
  displaySchool: string;
};

const scheduleColumns: Array<ColumnDef<ScheduleRow>> = [
  { header: '구분', key: 'category', width: 200 },
  { header: '상태', key: 'status', width: 140 },
  { header: '기간', key: 'period', width: 560 },
];

const participantColumns: Array<ColumnDef<ParticipantRow>> = [
  { header: '학교', key: 'displaySchool', width: 320 },
  { header: '이름', key: 'name', width: 240 },
  { header: '기수', key: 'generation', width: 220 },
  { header: '파트', key: 'part', width: 30 },
];

const SCHEDULE_LABEL: Record<ScheduleType, string> = {
  IDEA_REGISTRATION: '아이디어 등록',
  FIRST_TEAM_BUILDING: '1차 팀빌딩',
  FIRST_TEAM_BUILDING_ANNOUNCEMENT: '1차 팀빌딩 결과 발표',
  SECOND_TEAM_BUILDING: '2차 팀빌딩',
  SECOND_TEAM_BUILDING_ANNOUNCEMENT: '2차 팀빌딩 결과 발표',
  THIRD_TEAM_BUILDING: '3차 팀빌딩',
  FINAL_RESULT_ANNOUNCEMENT: '최종 결과 발표',
};

const isAnnouncementType = (type: ScheduleType) => type.includes('ANNOUNCEMENT');

const pad2 = (n: number) => String(n).padStart(2, '0');

/** ISO → "YYYY.MM.DD 10AM" 같은 느낌 (원하면 포맷 더 다듬어도 됨) */
const formatKoreanDateTime = (iso: string) => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());

  let hours = d.getHours();
  const minutes = pad2(d.getMinutes());
  const isPM = hours >= 12;
  const ampm = isPM ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${yyyy}.${mm}.${dd} ${hours}${minutes === '00' ? '' : `:${minutes}`}${ampm}`;
};

const getScheduleStatus = (s: ApiSchedule): string => {
  if (!s.startAt) return '등록 전';

  // 서버가 isEnded를 주면 우선 반영
  if (s.isEnded === true) return '완료';

  const now = new Date();
  const start = new Date(s.startAt);
  const end = s.endAt ? new Date(s.endAt) : start;

  if (now < start) return '진행 전';
  if (now > end) return '완료';
  return '진행 중';
};

const getSchedulePeriod = (s: ApiSchedule): string => {
  if (!s.startAt) return '';

  if (isAnnouncementType(s.scheduleType)) {
    return formatKoreanDateTime(s.startAt);
  }

  // 기간 타입
  if (s.endAt) return `${formatKoreanDateTime(s.startAt)} ~ ${formatKoreanDateTime(s.endAt)}`;
  return formatKoreanDateTime(s.startAt);
};

const toScheduleRows = (schedules: ApiSchedule[]): ScheduleRow[] => {
  return schedules.map(s => ({
    id: s.scheduleType,
    category: SCHEDULE_LABEL[s.scheduleType],
    status: getScheduleStatus(s),
    period: getSchedulePeriod(s),
  }));
};

const toParticipantRowsWithSchoolCount = (participants: ApiParticipant[]): ParticipantRow[] => {
  const countBySchool = participants.reduce<Record<string, number>>((acc, p) => {
    const key = (p.school ?? '').trim();
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const seen = new Set<string>();

  return participants.map(p => {
    const school = (p.school ?? '').trim();
    if (!school) {
      return { ...p, displaySchool: '' };
    }

    if (!seen.has(school)) {
      seen.add(school);
      return { ...p, displaySchool: `${school} (${countBySchool[school]}명)` };
    }

    return { ...p, displaySchool: '' };
  });
};

/**  데이터 */
const MOCK: ApiProjectDetail = {
  projectName: '그로우톤',
  schedules: [
    {
      scheduleType: 'IDEA_REGISTRATION',
      startAt: '2025-11-08T08:00:00.000Z',
      endAt: '2025-11-10T08:00:00.000Z',
      isEnded: true,
    },
    {
      scheduleType: 'FIRST_TEAM_BUILDING',
      startAt: '2025-11-11T01:00:00.000Z',
      endAt: '2025-11-16T07:00:00.000Z',
      isEnded: true,
    },
    {
      scheduleType: 'FIRST_TEAM_BUILDING_ANNOUNCEMENT',
      startAt: '2025-11-16T08:00:00.000Z',
      endAt: null,
      isEnded: true,
    },
    {
      scheduleType: 'SECOND_TEAM_BUILDING',
      startAt: '2025-11-16T08:00:00.000Z',
      endAt: null,
      isEnded: true,
    },
    {
      scheduleType: 'SECOND_TEAM_BUILDING_ANNOUNCEMENT',
      startAt: '2025-11-16T08:00:00.000Z',
      endAt: null,
      isEnded: true,
    },
    {
      scheduleType: 'THIRD_TEAM_BUILDING',
      startAt: '2025-11-16T08:00:00.000Z',
      endAt: null,
      isEnded: true,
    },
    {
      scheduleType: 'FINAL_RESULT_ANNOUNCEMENT',
      startAt: '2025-11-16T08:00:00.000Z',
      endAt: null,
      isEnded: true,
    },
  ],
  topics: ['주제1', '주제2', '주제3'],
  participants: [
    { id: 1, school: '성공회대학교', name: '강민정', generation: '25-26', part: 'Design' },
    { id: 2, school: '성공회대학교', name: '강우혁', generation: '25-26', part: 'BE' },
    { id: 3, school: '성공회대학교', name: '권지후', generation: '25-26', part: 'BE' },
    { id: 4, school: '서울  여자대학교', name: '김선호', generation: '25-26', part: 'PM' },
  ],
  team: {
    maxMembers: 7,
    parts: ['기획', '디자인', '프론트엔드 (웹)', '프론트엔드 (모바일)', '백엔드'],
  },
};

const ArchivedProjectDetail: NextPage = () => {
  // 연결 시 여기서 괄호 안에 임시 데이터 대신 실제 응답 넣으면 됨
  const scheduleRows = toScheduleRows(MOCK.schedules);
  const participantRows = toParticipantRowsWithSchoolCount(MOCK.participants);

  return (
    <div css={pageCss}>
      <div css={titleBlockCss}>
        <h1 css={pageTitleCss}>프로젝트 관리</h1>
        <p css={pageDescCss}>역대 프로젝트의 일정, 참여자, 팀 조건을 관리할 수 있습니다.</p>
      </div>

      <h2 css={projectNameCss}>{MOCK.projectName}</h2>

      <section css={sectionCss}>
        <h3 css={sectionTitleCss1}>프로젝트 일정 관리</h3>
        <ArchivedTable columns={scheduleColumns} rows={scheduleRows} getRowKey={r => r.id} />
      </section>

      <section css={sectionCss}>
        <h3 css={sectionTitleCss}>주제 관리</h3>
        <ul css={topicListCss}>
          {MOCK.topics.map(t => (
            <li key={t} css={topicItemCss}>
              <span css={topicTextCss}>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section css={sectionCss}>
        <h3 css={sectionTitleCss}>참여자 관리</h3>
        <div css={selectedInfoCss}>
          <span css={selectedLabelCss}>선택된 멤버</span>
          <span css={selectedCountCss}>{MOCK.participants.length}명</span>
        </div>
        <ArchivedTable columns={participantColumns} rows={participantRows} getRowKey={r => r.id} />
      </section>

      <section css={sectionCss}>
        <h3 css={sectionTitleCss}>팀 관리</h3>
        <div css={teamBlockCss}>
          <div>
            <div css={teamLabelCss}>최대 인원</div>
            <div css={teamValueCss}>{MOCK.team.maxMembers}명</div>
          </div>

          <div css={{ marginTop: 22 }}>
            <div css={teamLabelCss}>모집 파트</div>
            <div css={teamValueCss}>{MOCK.team.parts.join(', ')}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArchivedProjectDetail;

const pageCss = css`
  width: 100%;
  padding: 0 20px;
`;
const titleBlockCss = css`
  margin-bottom: 28px;
`;
const pageTitleCss = css`
  margin: 0;
  font-size: 36px;
  font-weight: 800;
`;
const pageDescCss = css`
  margin: 10px 0 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  word-wrap: break-word;
  color: ${colors.grayscale[700]};
`;
const projectNameCss = css`
  margin: 60px 0 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 38.4px;
  word-wrap: break-word;
`;
const sectionCss = css`
  margin-top: 64px;
`;
const sectionTitleCss = css`
  margin: 0 0 25px;
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
  word-wrap: break-word;
`;

const sectionTitleCss1 = css`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
  word-wrap: break-word;
`;

const topicListCss = css`
  margin: 0;
  padding-left: 7px;
  list-style: none;
`;
const topicItemCss = css`
  margin: 2px 0;
  font-size: 20px;
  gap: 20px;

  &::before {
    content: '•';
    font-size: 30px;
    margin-right: 10px;
    line-height: 1;
  }

  & + & {
    margin-top: 5px;
  }
`;

const topicTextCss = css`
  font-size: 20px;
  font-weight: 500;
  word-wrap: break-word;
`;

const selectedInfoCss = css`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 4px 0 12px;
`;
const selectedLabelCss = css`
  margin-top: 15px;
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
  word-wrap: break-word;
`;
const selectedCountCss = css`
  margin-top: 15px;
  color: #4285f4;
  font-size: 18px;
  font-weight: 500;
  line-height: 28.8px;
  word-wrap: break-word;
`;

const teamBlockCss = css`
  margin-top: 10px;
`;
const teamLabelCss = css`
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
  word-wrap: break-word;
`;
const teamValueCss = css`
  margin-top: 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  word-wrap: break-word;
`;
