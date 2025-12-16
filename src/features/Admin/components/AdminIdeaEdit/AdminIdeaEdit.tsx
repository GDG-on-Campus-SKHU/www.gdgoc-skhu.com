import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import {
  INTRO_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  TOPIC_OPTIONS,
} from '../../../team-building/components/IdeaForm/constants';
import {
  PREFERRED_OPTIONS,
  TEAM_ROLES,
  TeamRole,
} from '../../../team-building/components/IdeaForm/IdeaFormUtils';
import Radio from '../../../team-building/components/Radio';
import ReQuill from '../../../team-building/components/ReQuill';
import useQuillImages from '../../../team-building/hooks/useQuillImages';
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
  TextAreaWrapper,
} from '../../../team-building/styles/IdeaForm';
import {
  ApplyButton,
  ApplyButtonText,
  Brand,
  BrandContainer,
  BrandName,
  Content,
  ContentContainer,
  Description,
  DescriptionCNTR,
  FieldCNTR,
  FormWrapper,
  HeaderActions,
  HeaderTop,
  HelperText,
  ImageContainer,
  Nav,
  NavArrow,
  NavButton,
  NavString,
  Page,
  ProfileDetails,
  ProfileName,
  ProfileTitle,
  QuillWrapper,
  SelectInput,
  Sidebar,
  Title,
  TitleCNTR,
} from '../../styles/AdminIdeaEdit';

const NAV_ITEMS = [
  { label: '대시보드' },
  { label: '가입 심사' },
  { label: '멤버 관리' },
  { label: '프로젝트 관리' },
  { label: '아이디어 관리', active: true },
  { label: '프로젝트 갤러리 관리' },
  { label: '액티비티 관리' },
];

const DEFAULT_TEAM: Record<TeamRole, number> = {
  planning: 1,
  design: 1,
  frontendWeb: 0,
  frontendMobile: 2,
  backend: 2,
  aiMl: 0,
};

const DEFAULT_DESCRIPTION = `# 청년들의 월세 부담을 덜어줄 메이트, 리빙메이트<br />### 다들 월세 얼마씩 내세요?<br />저는 80만원이나 내고 있는데, 이걸 반반 부담할 친구가 있다면 얼마나 좋을까요?`;

export default function AdminIdeaEdit() {
  const router = useRouter();
  const [form, setForm] = useState(() => ({
    title: '리빙메이트',
    intro: '월세가 부담될 때 부담을 덜어줄 룸메이트 매칭 서비스',
    topic: TOPIC_OPTIONS[1] ?? '',
    preferredPart: '디자인',
    description: DEFAULT_DESCRIPTION,
    team: { ...DEFAULT_TEAM },
  }));

  const navItems = useMemo(() => NAV_ITEMS, []);

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

  const handleDescriptionChange = (value: string) => {
    setForm(prev => ({ ...prev, description: value }));
  };

  const { quillRef, imageInputRef, pageRef, quillModules, quillFormats, handleImageFileChange } =
    useQuillImages({
      description: form.description,
      onDescriptionChange: handleDescriptionChange,
    });

  const handleApply = () => {
    alert('변경 사항이 적용되었습니다.');
  };

  const titleCount = `${form.title.length}/${TITLE_MAX_LENGTH}`;
  const introCount = `${form.intro.length}/${INTRO_MAX_LENGTH}`;

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
          {navItems.map(item => (
            <NavButton key={item.label} type="button" $active={item.active}>
              <NavString $active={item.active}>
                <span>{item.label}</span>
              </NavString>
              <NavArrow aria-hidden="true" $visible={Boolean(item.active)}>
                <Image src="/rightarrow_admin.svg" alt="오른쪽 화살표" width={16} height={16} />
              </NavArrow>
            </NavButton>
          ))}
          <NavButton type="button" onClick={() => router.push('/')}>
            <NavString>
              <span>홈 화면으로 나가기</span>
            </NavString>
          </NavButton>
        </Nav>
      </Sidebar>

      <Content>
        <ContentContainer ref={pageRef}>
          <HeaderTop>
            <Title>아이디어 관리</Title>
            <Description>역대 프로젝트에 게시된 아이디어 리스트를 관리할 수 있습니다.</Description>
          </HeaderTop>
          <HeaderActions>
            <ApplyButton type="button" onClick={handleApply}>
              <ApplyButtonText>적용하기</ApplyButtonText>
            </ApplyButton>
          </HeaderActions>

          <FormWrapper>
            <TitleCNTR>
              <FieldHeader>
                <FieldLabel htmlFor="title">아이디어 제목</FieldLabel>
                <FieldCounter
                  $hasValue={!!form.title}
                  $isOver={form.title.length > TITLE_MAX_LENGTH}
                >
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
                <FieldCounter
                  $hasValue={!!form.intro}
                  $isOver={form.intro.length > INTRO_MAX_LENGTH}
                >
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
                  {PREFERRED_OPTIONS.map(option => (
                    <Radio
                      key={option}
                      label={option}
                      checked={form.preferredPart === option}
                      onChange={event => handlePreferredChange(option, event.target.checked)}
                    />
                  ))}
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
            </DescriptionCNTR>
            <TextAreaWrapper>
              <QuillWrapper>
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageFileChange}
                />
                <ReQuill
                  ref={quillRef}
                  value={form.description}
                  onChange={handleDescriptionChange}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Github README 작성에 쓰이는 ‘markdown’을 이용해 작성해보세요."
                  height="100%"
                />
              </QuillWrapper>
            </TextAreaWrapper>
          </FormWrapper>
        </ContentContainer>
      </Content>
    </Page>
  );
}
