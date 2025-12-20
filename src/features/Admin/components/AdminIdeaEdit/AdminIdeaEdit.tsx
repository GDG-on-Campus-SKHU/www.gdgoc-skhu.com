import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
// --- Constants & Utils Imports ---
import {
  INTRO_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  TOPIC_OPTIONS,
} from '@/features/team-building/components/IdeaForm/constants';
import {
  PREFERRED_OPTIONS,
  TEAM_ROLES,
  TeamRole,
} from '@/features/team-building/components/IdeaForm/IdeaFormUtils';
// --- Components Imports ---
import Radio from '@/features/team-building/components/Radio';
// --- Styles Imports (Team Building) ---
import {
  FieldCounter,
  FieldHeader,
  FieldInputWrapper,
  FieldLabel,
  Input,
  PreferredHeading,
  PreferredSection,
  RadioGroup,
  SelectWrapper,
  StepButton,
  TeamControls,
  TeamCount,
  TeamHeading,
  TeamHint,
  TeamLabel,
  TeamList,
  TeamRow,
  TeamSection,
  TeamTitle,
} from '@/features/team-building/styles/IdeaForm';
// --- API Imports ---
import {
  AdminIdeaCompositionRequest,
  AdminIdeaUpdateRequest,
  getAdminProjectIdeaDetail,
  updateAdminIdea,
} from '@/lib/adminIdea.api';
import { css } from '@emotion/react';

// --- Styles Imports (Admin Idea Edit) ---
import {
  ApplyButton,
  ApplyButtonText,
  Content,
  ContentContainer,
  Description,
  DescriptionCNTR,
  FieldCNTR,
  FormWrapper,
  HeaderActions,
  HeaderTop,
  HelperText,
  SelectInput,
  Title,
  TitleCNTR,
} from '../../styles/AdminIdeaEdit';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), {
  ssr: false,
});

const DEFAULT_TEAM: Record<TeamRole, number> = {
  planning: 0,
  design: 0,
  frontendWeb: 0,
  frontendMobile: 0,
  backend: 0,
  aiMl: 0,
};

// --- MAPPING HELPERS ---

const ROLE_UI_TO_API: Record<TeamRole, 'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI'> = {
  planning: 'PM',
  design: 'DESIGN',
  frontendWeb: 'WEB',
  frontendMobile: 'MOBILE',
  backend: 'BACKEND',
  aiMl: 'AI',
};

const ROLE_API_TO_UI: Record<'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI', TeamRole> = {
  PM: 'planning',
  DESIGN: 'design',
  WEB: 'frontendWeb',
  MOBILE: 'frontendMobile',
  BACKEND: 'backend',
  AI: 'aiMl',
};

const KOREAN_PART_TO_API: Record<string, 'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI'> = {
  기획: 'PM',
  디자인: 'DESIGN',
  '프론트엔드 (웹)': 'WEB',
  '프론트엔드 (모바일)': 'MOBILE',
  백엔드: 'BACKEND',
  'AI/ML': 'AI',
};

const API_PART_TO_KOREAN: Record<'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI', string> = {
  PM: '기획',
  DESIGN: '디자인',
  WEB: '프론트엔드 (웹)',
  MOBILE: '프론트엔드 (모바일)',
  BACKEND: '백엔드',
  AI: 'AI/ML',
};

export default function AdminIdeaEdit() {
  const router = useRouter();
  const { id, projectId } = router.query;

  const [form, setForm] = useState({
    title: '',
    intro: '',
    topic: '',
    topicId: 0,
    preferredPart: '',
    description: '',
    team: { ...DEFAULT_TEAM },
  });

  const [availableParts, setAvailableParts] = useState<Set<string>>(new Set());

  // 1. Fetch Data
  useEffect(() => {
    if (!id || !projectId) return;

    const fetchDetail = async () => {
      try {
        const res = await getAdminProjectIdeaDetail({
          projectId: Number(projectId),
          ideaId: Number(id),
        });

        const data = res.data;

        const loadedTeam = { ...DEFAULT_TEAM };
        const parts = new Set<string>();
        
        data.rosters.forEach(roster => {
          const uiKey = ROLE_API_TO_UI[roster.part];
          if (uiKey) {
            loadedTeam[uiKey] = roster.maxMemberCount;
          }
          // 프로젝트에서 사용 가능한 파트 저장
          const koreanPart = API_PART_TO_KOREAN[roster.part];
          if (koreanPart) {
            parts.add(koreanPart);
          }
        });

        setAvailableParts(parts);

        setForm({
          title: data.title,
          intro: data.introduction,
          topic: data.topic,
          topicId: data.topicId,
          preferredPart: API_PART_TO_KOREAN[data.creator.part] ?? '기획',
          description: data.description,
          team: loadedTeam,
        });
      } catch (error) {
        console.error('Failed to fetch idea detail:', error);
        alert('아이디어 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchDetail();
  }, [id, projectId]);

  // Input Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const limited =
      name === 'title'
        ? value.slice(0, TITLE_MAX_LENGTH)
        : name === 'intro'
          ? value.slice(0, INTRO_MAX_LENGTH)
          : value;

    setForm(prev => ({ ...prev, [name]: limited }));
  };

  const handlePreferredChange = (option: string, checked: boolean) => {
    if (!checked) return;
    
    // 사용 불가능한 파트 선택 방지
    if (!availableParts.has(option)) {
      alert('해당 파트는 이 프로젝트에서 사용할 수 없습니다.');
      return;
    }
    
    setForm(prev => ({ ...prev, preferredPart: option }));
  };

  const handleTeamAdjust = (role: TeamRole, delta: number) => {
    setForm(prev => {
      const next = Math.max(0, (prev.team?.[role] ?? 0) + delta);
      return {
        ...prev,
        team: {
          ...prev.team,
          [role]: next,
        },
      };
    });
  };

  // 2. Update Data
  const handleApply = async () => {
    if (!id || !projectId) return;

    try {
      const compositions: AdminIdeaCompositionRequest[] = Object.entries(form.team).map(
        ([key, count]) => ({
          part: ROLE_UI_TO_API[key as TeamRole],
          maxCount: count,
        })
      );

      const creatorPartEnum = KOREAN_PART_TO_API[form.preferredPart];

      if (!creatorPartEnum) {
        alert('작성자 파트를 선택해주세요.');
        return;
      }

      // 선택한 파트가 사용 가능한지 재확인
      if (!availableParts.has(form.preferredPart)) {
        alert('선택한 파트는 이 프로젝트에서 사용할 수 없습니다.');
        return;
      }

      const requestBody: AdminIdeaUpdateRequest = {
        title: form.title,
        introduction: form.intro,
        description: form.description,
        topicId: form.topicId,
        creatorPart: creatorPartEnum,
        compositions,
      };

      await updateAdminIdea({
        ideaId: Number(id),
        data: requestBody,
      });

      alert('변경 사항이 적용되었습니다.');

      router.push({
        pathname: '/AdminIdeaDetail',
        query: { projectId, id },
      });
    } catch (error) {
      console.error('Failed to update idea:', error);
      
      // 400 에러 처리
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 400) {
          alert('선택한 파트가 유효하지 않습니다. 프로젝트에서 사용 가능한 파트를 선택해주세요.');
          return;
        }
      }
      
      alert('아이디어 수정에 실패했습니다.');
    }
  };

  const titleCount = `${form.title.length}/${TITLE_MAX_LENGTH}`;
  const introCount = `${form.intro.length}/${INTRO_MAX_LENGTH}`;

  return (
    <Content css={contentFullWidthCss}>
      <ContentContainer css={contentContainerFullWidthCss}>
        <HeaderTop>
          <Title>아이디어 관리</Title>
          <Description>역대 프로젝트에 게시된 아이디어 리스트를 관리할 수 있습니다.</Description>
        </HeaderTop>
        <HeaderActions>
          <ApplyButton type="button" onClick={handleApply}>
            <ApplyButtonText>적용하기</ApplyButtonText>
          </ApplyButton>
        </HeaderActions>

        <FormWrapper css={formWrapperFullWidthCss}>
          <TitleCNTR>
            <FieldHeader>
              <FieldLabel htmlFor="title">아이디어 제목</FieldLabel>
              <FieldCounter $hasValue={!!form.title} $isOver={form.title.length > TITLE_MAX_LENGTH}>
                {titleCount}
              </FieldCounter>
            </FieldHeader>
            <FieldInputWrapper $isOver={form.title.length > TITLE_MAX_LENGTH}>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="아이디어 제목을 입력해주세요"
              />
            </FieldInputWrapper>
          </TitleCNTR>
          <FieldCNTR>
            <FieldHeader>
              <FieldLabel htmlFor="intro">아이디어 한 줄 소개</FieldLabel>
              <FieldCounter $hasValue={!!form.intro} $isOver={form.intro.length > INTRO_MAX_LENGTH}>
                {introCount}
              </FieldCounter>
            </FieldHeader>
            <FieldInputWrapper $isOver={form.intro.length > INTRO_MAX_LENGTH}>
              <Input
                id="intro"
                name="intro"
                value={form.intro}
                onChange={handleInputChange}
                placeholder="아이디어를 한 줄로 소개해주세요"
              />
            </FieldInputWrapper>
          </FieldCNTR>
          <FieldCNTR>
            <FieldHeader>
              <FieldLabel htmlFor="topic">아이디어 주제</FieldLabel>
            </FieldHeader>
            <FieldInputWrapper>
              <SelectWrapper style={{ width: '100%' }}>
                <SelectInput
                  id="topic"
                  name="topic"
                  value={form.topic}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    주제를 선택해주세요.
                  </option>
                  {TOPIC_OPTIONS.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </SelectInput>
              </SelectWrapper>
            </FieldInputWrapper>
          </FieldCNTR>
          <FieldCNTR>
            <PreferredSection>
              <PreferredHeading>
                <FieldLabel>작성자의 파트</FieldLabel>
                <HelperText>하나의 파트만 선택할 수 있습니다.</HelperText>
              </PreferredHeading>
              <RadioGroup>
                {PREFERRED_OPTIONS.map(option => {
                  const isDisabled = !availableParts.has(option);
                  return (
                    <Radio
                      key={option}
                      label={option}
                      checked={form.preferredPart === option}
                      onChange={event => handlePreferredChange(option, event.target.checked)}
                      disabled={isDisabled}
                    />
                  );
                })}
              </RadioGroup>
            </PreferredSection>
          </FieldCNTR>
          <FieldCNTR>
            <TeamSection>
              <TeamHeading>
                <TeamTitle>팀원 구성</TeamTitle>
                <TeamHint>팀당 최대 6명까지 가능합니다.</TeamHint>
              </TeamHeading>
              <TeamList>
                {TEAM_ROLES.map(role => (
                  <TeamRow key={role.key}>
                    <TeamLabel>{role.label}</TeamLabel>
                    <TeamControls>
                      <StepButton
                        type="button"
                        onClick={() => handleTeamAdjust(role.key, -1)}
                        disabled={(form.team?.[role.key] ?? 0) <= 0}
                      >
                        -
                      </StepButton>
                      <TeamCount>{form.team?.[role.key] ?? 0}</TeamCount>
                      <StepButton type="button" onClick={() => handleTeamAdjust(role.key, 1)}>
                        +
                      </StepButton>
                    </TeamControls>
                  </TeamRow>
                ))}
              </TeamList>
            </TeamSection>
          </FieldCNTR>
          <DescriptionCNTR>
            <FieldHeader>
              <FieldLabel>아이디어 설명</FieldLabel>
            </FieldHeader>
            <div css={editorContainerCss} data-color-mode="light">
              <MDEditor
                value={form.description}
                onChange={val => setForm(prev => ({ ...prev, description: val || '' }))}
                height={400}
                hideToolbar={false}
                textareaProps={{
                  placeholder: "Github README 생성에 쓰이는 'markdown'을 이용해 작성해보세요.",
                }}
              />
            </div>
          </DescriptionCNTR>
        </FormWrapper>
      </ContentContainer>
    </Content>
  );
}

const contentFullWidthCss = css`
  width: 100%;
  max-width: 100%;
`;

const contentContainerFullWidthCss = css`
  width: 100%;
  max-width: 100%;
  margin: 0;
  min-width: 0;
`;

const formWrapperFullWidthCss = css`
  width: 100%;
  max-width: 100%;
`;

const editorContainerCss = css`
  border-radius: 8px;
  background: #fff;
  min-height: 400px;

  & .w-md-editor-text-pre {
    font-family: 'Courier New', monospace;
  }

  & .w-md-editor-bar {
    display: none !important;
  }

  & .wmde-markdown {
    background: transparent;
    ul {
      list-style: disc !important;
      padding-left: 1rem !important;
    }
    ol {
      list-style: decimal !important;
      padding-left: 1rem !important;
    }
  }

  & .wmde-markdown h1,
  & .wmde-markdown h2,
  & .wmde-markdown h3,
  & .wmde-markdown h4,
  & .wmde-markdown h5,
  & .wmde-markdown h6 {
    font-family: 'Pretendard', sans-serif;
  }

  & .wmde-markdown code {
    font-family: 'Courier New', monospace;
  }
`;