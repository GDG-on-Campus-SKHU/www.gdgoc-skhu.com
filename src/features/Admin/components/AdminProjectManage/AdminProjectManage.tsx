import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';

import {
  createTopic,
  deleteTopic as deleteTopicApi,
  getProjectInfo,
  getScheduleRounds,
  getTeamBuildingCondition,
  getTopics,
  type ScheduleRound,
  type Topic,
  updateProjectInfo,
  updateScheduleRound,
  updateTeamBuildingCondition,
} from '../../../../lib/project.api';
import styles from '../../styles/AdminProjectManage.module.css';
import ParticipantManagement from '../ParticipantManagement/ParticipantManagement';
import ScheduleRegisterModal from '../ScheduleRegisterModal/ScheduleRegisterModal';
import TopicRegisterModal from '../TopicRegisterModal/TopicRegisterModal';

type ScheduleItem = {
  id: number;
  category: string;
  status: '등록 전' | '진행 전' | '진행 중' | '완료';
  period: string;
  startDate: string | null;
  endDate: string | null;
};

// 초기 일정 데이터 (API 실패 시 fallback)
const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: 1,
    category: '아이디어 등록',
    status: '등록 전',
    period: '',
    startDate: null,
    endDate: null,
  },
  { id: 2, category: '1차 팀빌딩', status: '등록 전', period: '', startDate: null, endDate: null },
  {
    id: 3,
    category: '1차 팀빌딩 결과 발표',
    status: '등록 전',
    period: '',
    startDate: null,
    endDate: null,
  },
  { id: 4, category: '2차 팀빌딩', status: '등록 전', period: '', startDate: null, endDate: null },
  {
    id: 5,
    category: '2차 팀빌딩 결과 발표',
    status: '등록 전',
    period: '',
    startDate: null,
    endDate: null,
  },
  { id: 6, category: '3차 팀빌딩', status: '등록 전', period: '', startDate: null, endDate: null },
  {
    id: 7,
    category: '최종 결과 발표',
    status: '등록 전',
    period: '',
    startDate: null,
    endDate: null,
  },
];

const AdminProjectManagement: NextPage = () => {
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 프로젝트 데이터
  const [projectName, setProjectName] = useState('');
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [topics, setTopics] = useState<Array<{ id: number; name: string }>>([]);

  // 팀 관리 관련 state
  const [maxMembers, setMaxMembers] = useState(7);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  // 아코디언 상태
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [isParticipantOpen, setIsParticipantOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const PARTS = ['기획', '디자인', '프론트엔드 (웹)', '프론트엔드 (모바일)', '백엔드', 'AI/ML'];

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 프로젝트 정보 조회
        try {
          const projectData = await getProjectInfo();
          setProjectName(projectData.projectName);
        } catch (error) {
          console.error('프로젝트 정보 조회 실패:', error);
          setProjectName('그로우톤');
        }

        try {
          const schedulesData = await getScheduleRounds();
          if (schedulesData && schedulesData.length > 0) {
            const mappedSchedules: ScheduleItem[] = schedulesData.map(
              (schedule: ScheduleRound) => ({
                id: schedule.id,
                category: schedule.roundType,
                status: schedule.status,
                period: schedule.startDate
                  ? schedule.endDate
                    ? `${schedule.startDate} ~ ${schedule.endDate}`
                    : schedule.startDate
                  : '',
                startDate: schedule.startDate,
                endDate: schedule.endDate,
              })
            );
            setSchedules(mappedSchedules);
          }
        } catch (error) {
          console.error('일정 조회 실패:', error);
        }

        // 주제 조회
        try {
          const topicsData = await getTopics();
          if (topicsData) {
            setTopics(
              topicsData.map((topic: Topic) => ({
                id: topic.topicId,
                name: topic.topicName,
              }))
            );
          }
        } catch (error) {
          console.error('주제 조회 실패:', error);
        }

        // 팀빌딩 조건 조회
        try {
          const conditionData = await getTeamBuildingCondition();
          if (conditionData) {
            setMaxMembers(conditionData.maxMember);
            setSelectedParts(conditionData.recruitParts || []);
          }
        } catch (error) {
          console.error('팀빌딩 조건 조회 실패:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 파트 체크박스 토글
  const handlePartToggle = (part: string) => {
    setSelectedParts(prev =>
      prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
    );
  };

  // 등록하기/수정하기 버튼 클릭 → 모달 열기
  const handleRegister = (schedule: ScheduleItem) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  // 모달 확인 → 일정 업데이트
  const handleConfirm = async (startDate: string, endDate?: string) => {
    if (selectedSchedule) {
      try {
        // API 호출
        await updateScheduleRound(selectedSchedule.id, {
          startDate,
          endDate,
        });

        // 로컬 상태 업데이트
        const periodText = endDate ? `${startDate} ~ ${endDate}` : startDate;
        setSchedules(prev =>
          prev.map(schedule =>
            schedule.id === selectedSchedule.id
              ? {
                  ...schedule,
                  status: '진행 전' as const,
                  period: periodText,
                  startDate,
                  endDate: endDate || null,
                }
              : schedule
          )
        );
      } catch (error) {
        console.error('일정 업데이트 실패:', error);
        alert('일정 업데이트에 실패했습니다.');
      }
    }
  };

  // 카테고리에 따라 모달 타입 결정
  const getModalType = (category: string): 'period' | 'single' => {
    if (category.includes('결과 발표')) {
      return 'single';
    }
    return 'period';
  };

  // 주제 추가 버튼 클릭 → 주제 모달 열기
  const handleAddTopicClick = () => {
    setIsTopicModalOpen(true);
  };

  // 주제 모달 닫기
  const handleCloseTopicModal = () => {
    setIsTopicModalOpen(false);
  };

  // 주제 등록 확인
  const handleTopicConfirm = async (topicName: string) => {
    try {
      const newTopic = await createTopic({ topicName });
      setTopics(prev => [...prev, { id: newTopic.topicId, name: newTopic.topicName }]);
    } catch (error) {
      console.error('주제 등록 실패:', error);
      alert('주제 등록에 실패했습니다.');
    }
  };

  // 주제 삭제
  const handleDeleteTopic = async (topicId: number) => {
    try {
      await deleteTopicApi(topicId);
      setTopics(prev => prev.filter(t => t.id !== topicId));
    } catch (error) {
      console.error('주제 삭제 실패:', error);
      alert('주제 삭제에 실패했습니다.');
    }
  };

  // 저장하기 버튼 클릭
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 프로젝트 이름 저장
      await updateProjectInfo({ projectName });

      // 팀빌딩 조건 저장
      await updateTeamBuildingCondition({
        maxMember: maxMembers,
        recruitParts: selectedParts,
      });

      setIsSaveModalOpen(true);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  // 저장 완료 모달 닫기
  const handleCloseSaveModal = () => {
    setIsSaveModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.logo}>
            <Image
              className={styles.gdgocSkhuImage}
              src="/gdgoc_skhu_admin.svg"
              alt="GDGoC SKHU"
              width={40}
              height={26}
            />
            <h3 className={styles.logoText}>GDGoC SKHU</h3>
          </div>
        </div>
        <main className={styles.mainContent}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <span>로딩 중...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Image
            className={styles.gdgocSkhuImage}
            src="/gdgoc_skhu_admin.svg"
            alt="GDGoC SKHU"
            width={40}
            height={26}
          />
          <h3 className={styles.logoText}>GDGoC SKHU</h3>
        </div>

        <div className={styles.loginInfo}>
          <h3 className={styles.userName}>윤준석</h3>
          <div className={styles.divider}>님</div>
        </div>

        <section className={styles.menuList}>
          <div className={styles.menuItem}>대시보드</div>
          <div className={styles.menuItem}>가입 심사</div>
          <div className={styles.menuItem}>멤버 관리</div>
          <div className={`${styles.menuItem} ${styles.menuItemActive}`}>
            <span>프로젝트 관리</span>
            <Image
              className={styles.menuArrowIcon}
              src="/rightarrow_admin.svg"
              width={14}
              height={14}
              alt=""
            />
          </div>
          <div className={styles.menuItem}>아이디어 관리</div>
          <div className={styles.menuItem}>프로젝트 갤러리 관리</div>
          <div className={styles.menuItem}>액티비티 관리</div>
          <div className={styles.menuItem}>홈 화면으로 나가기</div>
        </section>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.headerSection}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>프로젝트 관리</h1>
            <h3 className={styles.headerSubtitle}>
              역대 프로젝트의 일정, 참여자, 팀 조건을 관리할 수 있습니다.
            </h3>
          </div>
          <button type="button" className={styles.endedProjectButton}>
            <span className={styles.endedProjectButtonText}>종료 프로젝트 보기</span>
          </button>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.projectNameContainer}>
            <h2 className={styles.projectName}>{projectName}</h2>
            <Image className={styles.editIcon} src="/edit.svg" alt="편집" width={24} height={24} />
          </div>

          {/* 프로젝트 일정 관리 */}
          <div
            className={`${styles.accordionSection} ${isScheduleOpen ? styles.accordionSectionOpen : ''}`}
          >
            <div
              className={styles.accordionHeader}
              onClick={() => setIsScheduleOpen(!isScheduleOpen)}
            >
              <span className={styles.accordionTitle}>프로젝트 일정 관리</span>
              <div
                className={`${styles.accordionArrow} ${isScheduleOpen ? styles.accordionArrowOpen : ''}`}
              >
                <Image src="/dropdownarrow.svg" alt="" width={24} height={24} />
              </div>
            </div>

            {isScheduleOpen && (
              <div className={styles.scheduleTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableHeaderCategoryCell}>
                    <span className={styles.tableHeaderCategoryText}>구분</span>
                  </div>
                  <div className={styles.tableHeaderStatusCell}>
                    <span className={styles.tableHeaderStatusText}>상태</span>
                  </div>
                  <div className={styles.tableHeaderPeriodCell}>
                    <span className={styles.tableHeaderPeriodText}>기간</span>
                  </div>
                  <div className={styles.tableHeaderActionCell}>
                    <span className={styles.tableHeaderActionText}>등록/수정</span>
                  </div>
                </div>
                <div className={styles.tableBody}>
                  {schedules.map(schedule => (
                    <div key={schedule.id} className={styles.tableRow}>
                      <div className={styles.tableCellCategory}>
                        <span className={styles.tableCellCategoryText}>{schedule.category}</span>
                      </div>
                      <div className={styles.tableCellStatus}>
                        <span className={styles.tableCellStatusText}>{schedule.status}</span>
                      </div>
                      <div className={styles.tableCellPeriod}>
                        <span className={styles.tableCellPeriodText}>
                          {schedule.period || '기간을 등록해주세요.'}
                        </span>
                      </div>
                      <div className={styles.tableCellAction}>
                        <button
                          type="button"
                          className={schedule.period ? styles.editButton : styles.registerButton}
                          onClick={() => handleRegister(schedule)}
                        >
                          <span
                            className={
                              schedule.period ? styles.editButtonText : styles.registerButtonText
                            }
                          >
                            {schedule.period ? '수정하기' : '등록하기'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 주제 관리 */}
          <div
            className={`${styles.accordionSection} ${isTopicOpen ? styles.accordionSectionOpen : ''}`}
          >
            <div className={styles.accordionHeader} onClick={() => setIsTopicOpen(!isTopicOpen)}>
              <span className={styles.accordionTitle}>주제 관리</span>
              <div
                className={`${styles.accordionArrow} ${isTopicOpen ? styles.accordionArrowOpen : ''}`}
              >
                <Image src="/dropdownarrow.svg" alt="" width={24} height={24} />
              </div>
            </div>

            {isTopicOpen && (
              <div className={styles.accordionContent}>
                <div className={styles.topicListContainer}>
                  {/* 등록된 주제 목록 */}
                  {topics.map(topic => (
                    <div key={topic.id} className={styles.topicItem}>
                      <span className={styles.topicText}>{topic.name}</span>
                      <button
                        type="button"
                        className={styles.topicDeleteButton}
                        onClick={() => handleDeleteTopic(topic.id)}
                      >
                        <span className={styles.topicDeleteButtonText}>삭제</span>
                      </button>
                    </div>
                  ))}

                  {/* 주제 추가 버튼 */}
                  <button
                    type="button"
                    className={styles.addTopicButton}
                    onClick={handleAddTopicClick}
                  >
                    <span className={styles.addTopicButtonText}>주제 추가</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 참여자 관리 */}
          <div
            className={`${styles.accordionSection} ${isParticipantOpen ? styles.accordionSectionOpen : ''}`}
          >
            <div
              className={styles.accordionHeader}
              onClick={() => setIsParticipantOpen(!isParticipantOpen)}
            >
              <span className={styles.accordionTitle}>참여자 관리</span>
              <div
                className={`${styles.accordionArrow} ${isParticipantOpen ? styles.accordionArrowOpen : ''}`}
              >
                <Image src="/dropdownarrow.svg" alt="" width={24} height={24} />
              </div>
            </div>

            {isParticipantOpen && (
              <div className={styles.accordionContent}>
                <ParticipantManagement />
              </div>
            )}
          </div>

          {/* 팀 관리 */}
          <div
            className={`${styles.accordionSection} ${isTeamOpen ? styles.accordionSectionOpen : ''}`}
          >
            <div className={styles.accordionHeader} onClick={() => setIsTeamOpen(!isTeamOpen)}>
              <span className={styles.accordionTitle}>팀 관리</span>
              <div
                className={`${styles.accordionArrow} ${isTeamOpen ? styles.accordionArrowOpen : ''}`}
              >
                <Image src="/dropdownarrow.svg" alt="" width={24} height={24} />
              </div>
            </div>

            {isTeamOpen && (
              <div className={styles.accordionContent}>
                <div className={styles.teamManagementContainer}>
                  {/* 최대 인원 */}
                  <div className={styles.teamSection}>
                    <span className={styles.teamSectionTitle}>최대 인원</span>
                    <div className={styles.maxMembersRow}>
                      <input
                        type="number"
                        min="1"
                        value={maxMembers}
                        onChange={e => setMaxMembers(Number(e.target.value))}
                        className={styles.maxMembersInput}
                      />
                      <span className={styles.maxMembersUnit}>명</span>
                    </div>
                  </div>

                  {/* 모집 파트 */}
                  <div className={styles.teamSection}>
                    <span className={styles.teamSectionTitle}>모집 파트</span>
                    <div className={styles.partsCheckboxList}>
                      {PARTS.map(part => (
                        <div
                          key={part}
                          className={styles.partCheckboxItem}
                          onClick={() => handlePartToggle(part)}
                        >
                          <div
                            className={`${styles.partCheckbox} ${selectedParts.includes(part) ? styles.partCheckboxSelected : ''}`}
                          >
                            <Image src="/check_white.svg" alt="" width={12} height={9} />
                          </div>
                          <span className={styles.partLabel}>{part}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actionRow}>
          <button type="button" className={styles.deleteButton}>
            <span className={styles.deleteButtonText}>프로젝트 삭제하기</span>
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            <span className={styles.saveButtonText}>{isSaving ? '저장 중...' : '저장하기'}</span>
          </button>
        </div>
      </main>

      <ScheduleRegisterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedSchedule?.category || ''}
        type={selectedSchedule ? getModalType(selectedSchedule.category) : 'period'}
        onConfirm={handleConfirm}
      />

      <TopicRegisterModal
        isOpen={isTopicModalOpen}
        onClose={handleCloseTopicModal}
        onConfirm={handleTopicConfirm}
      />

      {/* 저장 완료 모달 */}
      {isSaveModalOpen && (
        <div className={styles.saveModalOverlay} onClick={handleCloseSaveModal}>
          <div className={styles.saveModalContainer} onClick={e => e.stopPropagation()}>
            <span className={styles.saveModalText}>저장이 완료되었습니다.</span>
            <button type="button" className={styles.saveModalButton} onClick={handleCloseSaveModal}>
              <span className={styles.saveModalButtonText}>확인</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectManagement;
