import React from 'react';

import {
  AutoSaveStatus,
  ButtonGroup,
  FieldCounter,
  FieldHeader,
  FieldInputWrapper,
  FieldLabel,
  FieldSet,
  FormContainer,
  FormSection,
  HeaderRow,
  Input,
  ModalActions,
  ModalButton,
  ModalCard,
  ModalOverlay,
  ModalTitle,
  PageContainer,
  PreferredHeading,
  PreferredSection,
  PreviewButton,
  RadioGroup,
  SectionTitle,
  SelectWrapper,
  StepButton,
  SubmitButton,
  TeamControls,
  TeamCount,
  TeamHeading,
  TeamHint,
  TeamLabel,
  TeamList,
  TeamRow,
  TeamSection,
  TeamTitle,
} from '../../styles/IdeaForm';
import Radio from '../Radio';
import SelectBoxBasic from '../SelectBoxBasic';
import type { TeamCounts } from '../store/IdeaStore';
import {
  AUTO_SAVE_PLACEHOLDER,
  formatSavedAt,
  INTRO_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  TOPIC_OPTIONS,
  TOPIC_PLACEHOLDER,
} from './constants';
import IdeaDescriptionEditor from './IdeaDescriptionEditor';
import { PREFERRED_OPTIONS, TEAM_ROLES, TeamRole } from './IdeaFormUtils';

import 'react-quill/dist/quill.snow.css';

type ModalState = 'idle' | 'confirm' | 'success';

interface IdeaFormValues {
  title?: string;
  intro?: string;
  topic?: string;
  preferredPart?: string;
  description: string;
  team: Partial<Record<TeamRole, number>>;
}

interface IdeaFormViewProps {
  form: IdeaFormValues;
  team: TeamCounts;
  topicOptions?: string[];
  preferredRoleKey: TeamRole | null;
  radioRenderVersion: number;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  emitFieldChange: (name: string, value: string) => void;
  onTopicSelect: (selected: string[]) => void;
  onPreferredPartSelect: (option: (typeof PREFERRED_OPTIONS)[number], checked: boolean) => void;
  onTeamAdjust: (key: TeamRole, next: number) => void;
  onDescriptionChange: (value: string) => void;
  onPreview: () => void;
  onOpenSubmitModal: () => void;
  onConfirmSubmit: () => void;
  onCloseModal: () => void;
  onModalDone: () => void;
  isSubmitDisabled: boolean;
  modalState: ModalState;
  isDraftModalOpen: boolean;
  draftSavedAt: string | null;
  onLoadDraft: () => void;
  onSkipDraft: () => void;
  autoSaveSaving: boolean;
  autoSaveSavedAt: string;
}

export default function IdeaFormView({
  form,
  team,
  topicOptions,
  radioRenderVersion,
  onChange,
  onTopicSelect,
  onPreferredPartSelect,
  onTeamAdjust,
  onDescriptionChange,
  onPreview,
  onOpenSubmitModal,
  onConfirmSubmit,
  onCloseModal,
  onModalDone,
  isSubmitDisabled,
  modalState,
  isDraftModalOpen,
  draftSavedAt,
  onLoadDraft,
  onSkipDraft,
  autoSaveSaving,
  autoSaveSavedAt,
}: IdeaFormViewProps) {
  const title = form.title ?? '';
  const intro = form.intro ?? '';
  const isTitleLimitReached = title.length >= TITLE_MAX_LENGTH;
  const isIntroLimitReached = intro.length >= INTRO_MAX_LENGTH;

  const titleCounter = `${Math.min(title.length, TITLE_MAX_LENGTH)}/${TITLE_MAX_LENGTH}`;
  const introCounter = `${Math.min(intro.length, INTRO_MAX_LENGTH)}/${INTRO_MAX_LENGTH}`;
  const draftSavedAtLabel = formatSavedAt(draftSavedAt) ?? draftSavedAt ?? '최근';

  const autoSaveDisplay = autoSaveSaving
    ? '임시저장 중...'
    : autoSaveSavedAt
      ? `임시저장 완료 ${autoSaveSavedAt}`
      : AUTO_SAVE_PLACEHOLDER;

  return (
    <PageContainer $isModalOpen={modalState !== 'idle' || isDraftModalOpen}>
      <FormContainer>
        <HeaderRow>
          <SectionTitle>아이디어 작성</SectionTitle>
          <AutoSaveStatus $saving={autoSaveSaving}>{autoSaveDisplay}</AutoSaveStatus>
        </HeaderRow>

        {isDraftModalOpen && (
          <ModalOverlay className="modal">
            <ModalCard>
              <ModalTitle>
                {draftSavedAtLabel}에 저장된 글이 있습니다.
                <br />
                불러오시겠습니까?
              </ModalTitle>
              <ModalActions>
                <ModalButton type="button" onClick={onLoadDraft}>
                  예
                </ModalButton>
                <ModalButton type="button" $variant="secondary" onClick={onSkipDraft}>
                  아니오
                </ModalButton>
              </ModalActions>
            </ModalCard>
          </ModalOverlay>
        )}

        <FormSection>
          <FieldSet>
            <FieldHeader>
              <FieldLabel htmlFor="title">아이디어 제목</FieldLabel>
              <FieldCounter $isOver={isTitleLimitReached} $hasValue={!!title}>
                {titleCounter}
              </FieldCounter>
            </FieldHeader>
            <FieldInputWrapper $isOver={isTitleLimitReached}>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={onChange}
                maxLength={TITLE_MAX_LENGTH}
                placeholder="제목을 입력해주세요."
              />
            </FieldInputWrapper>
          </FieldSet>

          <FieldSet>
            <FieldHeader>
              <FieldLabel htmlFor="intro">아이디어 한 줄 소개</FieldLabel>
              <FieldCounter $isOver={isIntroLimitReached} $hasValue={!!intro}>
                {introCounter}
              </FieldCounter>
            </FieldHeader>
            <FieldInputWrapper $isOver={isIntroLimitReached}>
              <Input
                id="intro"
                name="intro"
                value={intro}
                onChange={onChange}
                maxLength={INTRO_MAX_LENGTH}
                placeholder="아이디어를 간단하게 소개해주세요."
              />
            </FieldInputWrapper>
          </FieldSet>

          <FieldSet>
            <FieldLabel id="topic-label">아이디어 주제</FieldLabel>
            <SelectWrapper role="group" aria-labelledby="topic-label">
              <SelectBoxBasic
                options={topicOptions ?? TOPIC_OPTIONS}
                placeholder={TOPIC_PLACEHOLDER}
                multiple={false}
                searchable={false}
                value={form.topic ? [form.topic] : []}
                onChange={onTopicSelect}
              />
            </SelectWrapper>
          </FieldSet>
        </FormSection>

        <PreferredSection>
          <PreferredHeading>
            <FieldLabel as="span">작성자의 파트</FieldLabel>
          </PreferredHeading>
          <RadioGroup>
            {PREFERRED_OPTIONS.map(option => (
              <Radio
                key={`${option}-${radioRenderVersion}`}
                name="preferredPart"
                label={option}
                checked={form.preferredPart === option}
                onClick={() => onPreferredPartSelect(option, form.preferredPart !== option)}
              />
            ))}
          </RadioGroup>
        </PreferredSection>

        <TeamSection>
          <TeamHeading>
            <TeamTitle>팀원 구성</TeamTitle>
            <TeamHint>팀 당 최대 n명까지 가능합니다.</TeamHint>
          </TeamHeading>
          <TeamList>
            {TEAM_ROLES.map(r => {
              const currentCount = team[r.key] ?? 0;
              return (
                <TeamRow key={r.key}>
                  <TeamLabel>{r.label}</TeamLabel>
                  <TeamControls>
                    <StepButton
                      type="button"
                      disabled={currentCount <= 0}
                      onClick={() => onTeamAdjust(r.key, Math.max(0, currentCount - 1))}
                    >
                      -
                    </StepButton>
                    <TeamCount>{currentCount}</TeamCount>
                    <StepButton type="button" onClick={() => onTeamAdjust(r.key, currentCount + 1)}>
                      +
                    </StepButton>
                  </TeamControls>
                </TeamRow>
              );
            })}
          </TeamList>
        </TeamSection>

        <FieldSet>
          <FieldLabel htmlFor="description">아이디어 설명</FieldLabel>
          <IdeaDescriptionEditor value={form.description ?? ''} onChange={onDescriptionChange} />
        </FieldSet>

        <ButtonGroup>
          <PreviewButton type="button" onClick={onPreview}>
            아이디어 미리보기
          </PreviewButton>
          <SubmitButton type="button" onClick={onOpenSubmitModal} disabled={isSubmitDisabled}>
            아이디어 등록하기
          </SubmitButton>
        </ButtonGroup>

        {modalState !== 'idle' && (
          <ModalOverlay className="modal">
            <ModalCard>
              {modalState === 'confirm' ? (
                <>
                  <ModalTitle>해당 아이디어를 게시하겠습니까?</ModalTitle>
                  <ModalActions>
                    <ModalButton type="button" onClick={onConfirmSubmit}>
                      예
                    </ModalButton>
                    <ModalButton type="button" $variant="secondary" onClick={onCloseModal}>
                      아니오
                    </ModalButton>
                  </ModalActions>
                </>
              ) : (
                <>
                  <ModalTitle>게시가 완료되었습니다.</ModalTitle>
                  <ModalActions>
                    <ModalButton type="button" onClick={onModalDone}>
                      확인
                    </ModalButton>
                  </ModalActions>
                </>
              )}
            </ModalCard>
          </ModalOverlay>
        )}
      </FormContainer>
    </PageContainer>
  );
}
