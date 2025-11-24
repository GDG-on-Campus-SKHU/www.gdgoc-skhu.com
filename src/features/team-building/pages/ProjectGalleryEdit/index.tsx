import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import ProjectPostForm, {
  type ProjectPostFormInitialValues,
  TeamMember,
} from '../../components/ProjectGalleryPost/ProjectPostForm';

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: '윤준석',
    badge: '25-26 Organizer',
    school: '성공회대학교',
    part: ['프론트엔드 (웹)'],
  },
  {
    id: 'm2',
    name: '이슬',
    badge: '25-26 Core',
    school: '성공회대학교',
    part: ['디자인'],
  },
  {
    id: 'm3',
    name: '이서영',
    badge: '25-26 Core',
    school: '성공회대학교',
    part: ['AI/ML'],
  },
];

const INITIAL_FORM_VALUES: ProjectPostFormInitialValues = {
  title: '커피와 담소',
  oneLiner: '담소를 나누기 위해 사용해셍용',
  generation: '25-26',
  leader: {
    id: 'leader-1',
    name: '주현지',
    badge: '25-26 Core',
    school: '성공회대학교',
  },
  leaderPart: '백엔드',
  serviceStatus: 'PAUSED', // 미운영 중
  description: '작성완료',
  teamMembers: INITIAL_TEAM_MEMBERS,
};

export default function ProjectGalleryEditPage() {
  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <h1 css={pageTitleCss}>Project Gallery</h1>
        <ProjectPostForm initialValues={INITIAL_FORM_VALUES} isEditMode />
      </div>
    </main>
  );
}

const mainCss = css`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.white};
  color: ${colors.grayscale[1000]};
  font-family: 'Pretendard', sans-serif;
  padding: 4rem 2.5rem 5rem;
`;

const innerCss = css`
  width: 100%;
  max-width: 1080px;
`;

const pageTitleCss = css`
  font-size: 50px;
  font-weight: 700;
  line-height: 160%;
  margin: 60px 0 40px;
`;
