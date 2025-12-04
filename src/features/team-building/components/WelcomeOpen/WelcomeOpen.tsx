import Link from 'next/link';
import Image from 'next/image';
import IdeaItem from '../IdeaItem/IdeaItem';
import Button from '../Button';
import SelectBoxBasic from '../SelectBoxBasic';
import Toggle from '../Toggle';
import {
  Container,
  Wrapper,
  TitleSection,
  Title,
  ProjectTitleRow,
  Subtitle,
  StatusBar,
  StatusText,
  StatusLabel,
  StatusCount,
  StatusActions,
  RegisterButtonLink,
  FilterContainer,
  TopicSelectBox,
  StateRow,
  StateLabel,
  StateToggle,
  EmptyCard,
  EmptyMessage,
  IdeaHeaderRow,
  NumberCTNR,
  IdeaContentCTNR,
  ApplyCTNR,
  RecruitStatusCTNR,
  IdeaItemCTNR,
  Pagination,
  PageButton,
  PageInsertNum,
  ArrowIcon,
  GrowthonLogo,
} from '../../styles/WelcomeOpen';
import { Idea } from '../store/IdeaStore';
const TOPIC_FILTER_OPTIONS = ['전체', '디자인', '프론트엔드', '백엔드'];

export default function WelcomeView({
  ideas = [],
  totalIdeas = 0,
  visibleIdeasCount = ideas.length,
  topicFilter,
  excludeClosed,
  currentPage,
  totalPages,
  startIndex,
  onChangeTopic,
  onToggleExclude,
  onPageChange,
}: any) {
  return (
    <Container>
      <Wrapper>
        <TitleSection>
          <Title>Team Building</Title>

          <ProjectTitleRow>
            <Subtitle>
              그로우톤
              <GrowthonLogo
                src="/GrowthonScheduleIcon.svg"
                alt="그로우톤 로고"
                width={36}
                height={36}
                priority
              />
            </Subtitle>
          </ProjectTitleRow>
        </TitleSection>

        <StatusBar>
          <StatusText>
            <StatusLabel>아이디어 현황</StatusLabel>
            <StatusCount>{totalIdeas}개</StatusCount>
          </StatusText>

          <StatusActions>
            <RegisterButtonLink href="/IdeaForm">
              <Button
                title="아이디어 등록하기"
                disabled={false}
                className="IdeaButton"
                css={{
                  display: 'flex',
                  width: '200px',
                  height: '50px',
                  padding: '10px 8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  color: 'var(--grayscale-100, #f9f9fa)',
                  fontFamily: 'Pretendard',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '160%',
                }}
              />
            </RegisterButtonLink>
          </StatusActions>
        </StatusBar>

        <FilterContainer>
          <TopicSelectBox
            options={TOPIC_FILTER_OPTIONS}
            placeholder={topicFilter || '주제를 선택해주세요.'}
            multiple={false}
            searchable={false}
            onChange={selected => onChangeTopic(selected[0] ?? '')}
          />

          <StateRow>
            <StateLabel>모집 중인 공고만 보기</StateLabel>

            <StateToggle
              $active={excludeClosed}
              onClick={onToggleExclude}
              role="switch"
              aria-checked={excludeClosed}
            >
              <Toggle checked={excludeClosed} />
            </StateToggle>
          </StateRow>
        </FilterContainer>

        {visibleIdeasCount === 0 ? (
          <EmptyCard>
            <EmptyMessage>
              아직 아이디어가 없어요 😃
              <br />첫 번째 아이디어의 주인공이 되어보세요!
            </EmptyMessage>
          </EmptyCard>
        ) : (
          <>
            <IdeaHeaderRow>
              <NumberCTNR>순번</NumberCTNR>
              <IdeaContentCTNR>아이디어 내용</IdeaContentCTNR>
              <ApplyCTNR>지원 현황</ApplyCTNR>
              <RecruitStatusCTNR>모집 상태</RecruitStatusCTNR>
            </IdeaHeaderRow>

            {ideas.map((idea: Idea, idx: any) => (
              <IdeaItemCTNR key={idea.id}>
                <IdeaItem idea={idea} index={startIndex + idx + 1} />
              </IdeaItemCTNR>
            ))}

            <Pagination>
              <PageButton
                $isArrow
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                <ArrowIcon $direction="left" />
              </PageButton>

              {Array.from({ length: totalPages }, (_, pageIndex) => {
                const pageNumber = pageIndex + 1;
                const isActive = pageNumber === currentPage;
                return (
                  <PageInsertNum
                    key={pageNumber}
                    $active={isActive}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => onPageChange(pageNumber)}
                    css={{
                      cursor: 'pointer',
                      display: 'flex',
                      width: '40px',
                      height: '40px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '8px',
                      background: isActive ? 'var(--primary-600-main, #4285F4)' : '#ffffff',
                      color: isActive
                        ? 'var(--grayscale-100, #ffffff)'
                        : 'var(--grayscale-1000, #000000)',
                    }}
                  >
                    {pageNumber}
                  </PageInsertNum>
                );
              })}

              <PageButton
                $isArrow
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                <ArrowIcon $direction="right" />
              </PageButton>
            </Pagination>
          </>
        )}
      </Wrapper>
    </Container>
  );
}
