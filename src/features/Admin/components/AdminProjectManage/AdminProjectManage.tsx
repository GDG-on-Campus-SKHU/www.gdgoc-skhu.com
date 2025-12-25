import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  createProject,
  deleteProject,
  getModifiableProject,
  type ModifiableProject,
  type Part,
  type Schedule,
  type ScheduleType,
  updateProject,
  updateProjectName,
} from 'src/lib/adminProject.api';

import styles from '../../styles/AdminProjectManage.module.css';
import ParticipantManagement from '../ParticipantManagement/ParticipantManagement';
import ScheduleRegisterModal from '../ScheduleRegisterModal/ScheduleRegisterModal';
import TopicRegisterModal from '../TopicRegisterModal/TopicRegisterModal';

// ScheduleType을 한글 카테고리로 변환
const SCHEDULE_TYPE_TO_CATEGORY: Record<ScheduleType, string> = {
  IDEA_REGISTRATION: '아이디어 등록',
  FIRST_TEAM_BUILDING: '1차 팀빌딩',
  FIRST_TEAM_BUILDING_ANNOUNCEMENT: '1차 팀빌딩 결과 발표',
  SECOND_TEAM_BUILDING: '2차 팀빌딩',
  SECOND_TEAM_BUILDING_ANNOUNCEMENT: '2차 팀빌딩 결과 발표',
  THIRD_TEAM_BUILDING: '3차 팀빌딩',
  FINAL_RESULT_ANNOUNCEMENT: '최종 결과 발표',
};

// Part를 한글로 변환
const PART_TO_KOREAN: Record<Part, string> = {
  PM: '기획',
  DESIGN: '디자인',
  WEB: '프론트엔드 (웹)',
  MOBILE: '프론트엔드 (모바일)',
  BACKEND: '백엔드',
  AI: 'AI/ML',
};

const KOREAN_TO_PART: Record<string, Part> = {
  기획: 'PM',
  디자인: 'DESIGN',
  '프론트엔드 (웹)': 'WEB',
  '프론트엔드 (모바일)': 'MOBILE',
  백엔드: 'BACKEND',
  'AI/ML': 'AI',
};

type ScheduleItem = {
  scheduleType: ScheduleType;
  category: string;
  status: '등록 전' | '진행 전' | '진행 중' | '완료';
  period: string;
  startAt: string | null;
  endAt: string | null;
};

// 일정 상태 계산
const getScheduleStatus = (
  startAt: string | null,
  endAt: string | null
): '등록 전' | '진행 전' | '진행 중' | '완료' => {
  if (!startAt) return '등록 전';
  const now = new Date();
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : start;
  if (now < start) return '진행 전';
  if (now > end) return '완료';
  return '진행 중';
};

// 날짜 포맷팅 (ISO → YYYY.MM.DD HH:mm)
const formatDateTime = (isoString: string | null): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    scheduleType: 'IDEA_REGISTRATION',
    category: '아이디어 등록',
    status: '등록 전',
    period: '',
    startAt: null,
    endAt: null,
  },
  {
    scheduleType: 'FIRST_TEAM_BUILDING',
    category: '1차 팀빌딩',
    status: '등록 전',
    period: '',
    startAt: null,
    endAt: null,
  },
  {
    scheduleType: 'FIRST_TEAM_BUILDING_ANNOUNCEMENT',
    category: '1차 팀빌딩 결과 발표',
    status: '등록 전',
    period: '',
    startAt: null,
    endAt: null,
  },
  {
    scheduleType: 'SECOND_TEAM_BUILDING',
    category: '2차 팀빌딩',
    status: '등록 전',
    period: '',
    startAt: null,
    endAt: null,
  },
  {
    scheduleType: 'SECOND_TEAM_BUILDING_ANNOUNCEMENT',
    category: '2차 팀빌딩 결과 발표',
    status: '등록 전',
    period: '',
    startAt: null,
    endAt: null,
  },
  {
    scheduleType: 'THIRD_TEAM_BUILDING',
    category: '3차 팀빌딩',
    status: '등록 전',
    period: '',
    startAt: null,
    endAt: null,
  },
  {
    scheduleType: 'FINAL_RESULT_ANNOUNCEMENT',
    category: '최종 결과 발표',
    status: '등록 전',
    period: '',
    startAt: null,
    endAt: null,
  },
];

const SCHEDULE_ORDER = INITIAL_SCHEDULES.map(s => s.scheduleType);

// 프로젝트 등록 모달 컴포넌트
type ProjectRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (projectName: string) => void;
  isLoading?: boolean;
};

type ProjectNameEditModalProps = {
  isOpen: boolean;
  projectId: number;
  currentName: string;
  onClose: () => void;
  onSuccess: (newName: string) => void;
};

type ProjectDeleteConfirmModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const ProjectRegisterModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ProjectRegisterModalProps) => {
  const [projectName, setProjectName] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (projectName.trim()) {
      onConfirm(projectName.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && projectName.trim()) {
      handleConfirm();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>프로젝트 등록</span>
          <button type="button" className={styles.modalCloseButton} onClick={onClose}>
            <Image src="/close.svg" alt="닫기" width={24} height={24} />
          </button>
        </div>
        <div className={styles.modalContent}>
          <input
            type="text"
            className={styles.modalInput}
            placeholder="프로젝트명을 입력해주세요."
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={`${styles.modalConfirmButton} ${!projectName.trim() ? styles.modalConfirmButtonDisabled : ''}`}
            onClick={handleConfirm}
            disabled={!projectName.trim() || isLoading}
          >
            <span className={styles.modalConfirmButtonText}>
              {isLoading ? '생성 중...' : '확인'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectNameEditModal = ({
  isOpen,
  projectId,
  currentName,
  onClose,
  onSuccess,
}: ProjectNameEditModalProps) => {
  const [value, setValue] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setValue(currentName);
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!value.trim() || value === currentName) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      await updateProjectName(projectId, { projectName: value.trim() });
      onSuccess(value.trim());
      onClose();
    } catch (error) {
      console.error('프로젝트 이름 수정 실패:', error);
      alert('프로젝트 이름 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>프로젝트 이름 수정</span>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <Image src="/close.svg" alt="닫기" width={24} height={24} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <input
            className={styles.modalInput}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleConfirm()}
            autoFocus
          />
        </div>

        <div className={styles.modalFooter}>
          <button
            className={`${styles.modalConfirmButton} ${
              !value.trim() || value === currentName ? styles.modalConfirmButtonDisabled : ''
            }`}
            onClick={handleConfirm}
            disabled={isSaving || !value.trim() || value === currentName}
          >
            <span className={styles.modalConfirmButtonText}>
              {isSaving ? '저장 중...' : '저장'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectDeleteConfirmModal = ({
  isOpen,
  onCancel,
  onConfirm,
  isLoading,
}: ProjectDeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div
        className={styles.modalContainer}
        onClick={e => e.stopPropagation()}
        style={{ gap: '24px' }}
      >
        {/* 텍스트 영역 */}
        <div style={{ textAlign: 'center' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 700,
              lineHeight: '160%',
              color: '#040405',
            }}
          >
            프로젝트를 삭제하시겠습니까?
          </h2>
          <p
            style={{
              marginTop: '8px',
              fontSize: '16px',
              fontWeight: 500,
              color: '#7e8590',
              lineHeight: '160%',
            }}
          >
            삭제된 데이터는 복구할 수 없습니다.
          </p>
        </div>

        {/* 버튼 영역 */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            width: '100%',
          }}
        >
          <button
            type="button"
            className={styles.saveButton}
            onClick={onConfirm}
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            <span className={styles.saveButtonText}>예</span>
          </button>

          <button
            type="button"
            className={styles.editButton}
            onClick={onCancel}
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            <span className={styles.editButtonText}>아니요</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminProjectManagement: NextPage = () => {
  // 로딩/저장 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // 프로젝트 존재 여부
  const [hasProject, setHasProject] = useState<boolean | null>(null);

  // 프로젝트 데이터
  const [projectId, setProjectId] = useState<number | null>(null);
  const [projectName, setProjectName] = useState('');
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [topics, setTopics] = useState<string[]>([]);
  const [maxMembers, setMaxMembers] = useState(7);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [participantUserIds, setParticipantUserIds] = useState<number[]>([]); // 참여자 ID 목록

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
  const [isProjectRegisterModalOpen, setIsProjectRegisterModalOpen] = useState(false);
  const [isProjectNameEditModalOpen, setIsProjectNameEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const PARTS = ['기획', '디자인', '프론트엔드 (웹)', '프론트엔드 (모바일)', '백엔드', 'AI/ML'];

  const router = useRouter();

  const handleGoArchived = () => {
    console.log('clicked');
    router.push('/admin-project/AdminArchivedProject');
  };

  const mapSchedules = useCallback((schedules?: Schedule[]): ScheduleItem[] => {
    if (!schedules?.length) return INITIAL_SCHEDULES;

    return schedules.map(schedule => ({
      scheduleType: schedule.scheduleType,
      category: SCHEDULE_TYPE_TO_CATEGORY[schedule.scheduleType],
      status: getScheduleStatus(schedule.startAt, schedule.endAt),
      period: schedule.startAt
        ? schedule.endAt
          ? `${formatDateTime(schedule.startAt)} ~ ${formatDateTime(schedule.endAt)}`
          : formatDateTime(schedule.startAt)
        : '',
      startAt: schedule.startAt,
      endAt: schedule.endAt,
    }));
  }, []);

  const mapParticipantIds = useCallback(
    (participants?: Array<{ userId: number }>) =>
      Array.from(new Set(participants?.map(p => p.userId))),
    []
  );

  const mapActiveParts = useCallback(
    (parts?: Array<{ part: Part; available: boolean }>): string[] =>
      parts?.filter(p => p.available).map(p => PART_TO_KOREAN[p.part]) ?? [],
    []
  );

  const applyProjectData = useCallback(
    (projectData: ModifiableProject) => {
      setProjectId(projectData.projectId);

      setProjectName(prev =>
        projectData.projectName && projectData.projectName.trim() ? projectData.projectName : prev
      );

      setSchedules(mapSchedules(projectData.schedules));
      setTopics(projectData.topics ?? []);
      setMaxMembers(projectData.maxMemberCount ?? 7);
      setParticipantUserIds(mapParticipantIds(projectData.participants));
      setSelectedParts(mapActiveParts(projectData.availableParts));
    },
    [mapSchedules, mapParticipantIds, mapActiveParts]
  );

  const handleLoadError = useCallback((error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      setHasProject(false);
      return;
    }

    console.error('프로젝트 정보 조회 실패:', error);
  }, []);

  const loadProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const projectData = await getModifiableProject();
      applyProjectData(projectData);
      setHasProject(true);
    } catch (error) {
      handleLoadError(error);
    } finally {
      setIsLoading(false);
    }
  }, [applyProjectData, handleLoadError]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleCreateProject = async (projectName: string) => {
    setIsCreating(true);
    try {
      const project = await createProject({ projectName });

      setProjectId(project.projectId);
      setProjectName(projectName);
      setHasProject(true);
      setIsProjectRegisterModalOpen(false);
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      alert('프로젝트 생성에 실패했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

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
  const handleConfirm = (startAt: Date, endAt?: Date) => {
    const periodText = endAt
      ? `${formatDateTime(toLocalDateTimeString(startAt))} ~ ${formatDateTime(toLocalDateTimeString(endAt))}`
      : formatDateTime(toLocalDateTimeString(startAt));

    setSchedules(prev =>
      prev.map(schedule =>
        schedule.scheduleType === selectedSchedule?.scheduleType
          ? {
              ...schedule,
              status: '진행 전',
              period: periodText,
              startAt: toLocalDateTimeString(startAt),
              endAt: endAt ? toLocalDateTimeString(endAt) : null,
            }
          : schedule
      )
    );
  };

  const toLocalDateTimeString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  };

  const getModalType = (category: string): 'period' | 'single' => {
    if (category.includes('결과 발표') && category !== '최종 결과 발표') {
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
  const handleTopicConfirm = (topicName: string) => {
    if (topics.includes(topicName)) {
      alert('이미 등록된 주제입니다.');
      return;
    }
    setTopics(prev => [...prev, topicName]);
  };

  // 주제 삭제
  const handleDeleteTopic = (index: number) => {
    setTopics(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      // 선택된 파트만 Part[] 형태로 변환
      const availableParts: Part[] = selectedParts.map(koreanPart => KOREAN_TO_PART[koreanPart]);

      const schedulesData: Schedule[] = schedules.map(s => ({
        scheduleType: s.scheduleType,
        startAt: s.startAt,
        // 최종 결과 발표는 endAt 포함, 나머지 ANNOUNCEMENT는 null
        endAt:
          s.scheduleType === 'FINAL_RESULT_ANNOUNCEMENT'
            ? s.endAt
            : s.scheduleType.includes('ANNOUNCEMENT')
              ? null
              : s.endAt,
      }));

      await updateProject(projectId, {
        maxMemberCount: maxMembers,
        availableParts,
        topics,
        participantUserIds,
        schedules: schedulesData,
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

  const handleDeleteConfirm = async () => {
    if (!projectId) return;

    try {
      setIsSaving(true);
      await deleteProject(projectId);

      setProjectId(null);
      setProjectName('');
      setSchedules(INITIAL_SCHEDULES);
      setTopics([]);
      setMaxMembers(7);
      setSelectedParts([]);
      setParticipantUserIds([]);
      setHasProject(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
      alert('프로젝트 삭제에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <div className={styles.loadingContainer}>
            <span>로딩 중...</span>
          </div>
        </main>
      </div>
    );
  }

  // 프로젝트가 없을 때 - 초기 화면
  if (!hasProject) {
    return (
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <div className={styles.headerSection}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>프로젝트 관리</h1>
              <h3 className={styles.headerSubtitle}>
                역대 프로젝트의 일정, 참여자, 팀 조건을 관리할 수 있습니다.
              </h3>
            </div>
            <button type="button" className={styles.endedProjectButton} onClick={handleGoArchived}>
              <span className={styles.endedProjectButtonText}>종료 프로젝트 보기</span>
            </button>
          </div>

          <div className={styles.emptyContainer}>
            <p className={styles.emptyText}>
              프로젝트를 생성하고 일정과 팀빌딩을 관리할 수 있습니다.
            </p>
            <button
              type="button"
              className={styles.createProjectButton}
              onClick={() => setIsProjectRegisterModalOpen(true)}
            >
              <span className={styles.createProjectButtonText}>프로젝트 생성</span>
            </button>
          </div>
        </main>

        <ProjectRegisterModal
          isOpen={isProjectRegisterModalOpen}
          onClose={() => setIsProjectRegisterModalOpen(false)}
          onConfirm={handleCreateProject}
          isLoading={isCreating}
        />
      </div>
    );
  }

  // 프로젝트가 있을 때 - 편집 화면
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <div className={styles.headerSection}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>프로젝트 관리</h1>
            <h3 className={styles.headerSubtitle}>
              역대 프로젝트의 일정, 참여자, 팀 조건을 관리할 수 있습니다.
            </h3>
          </div>
          <button type="button" className={styles.endedProjectButton} onClick={handleGoArchived}>
            <span className={styles.endedProjectButtonText}>종료 프로젝트 보기</span>
          </button>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.projectNameContainer}>
            <h2 className={styles.projectName}>{projectName}</h2>
            <Image
              className={styles.editIcon}
              src="/edit.svg"
              alt="편집"
              width={24}
              height={24}
              onClick={() => setIsProjectNameEditModalOpen(true)}
            />
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
                  {[...schedules]
                    .sort(
                      (a, b) =>
                        SCHEDULE_ORDER.indexOf(a.scheduleType) -
                        SCHEDULE_ORDER.indexOf(b.scheduleType)
                    )
                    .map(schedule => (
                      <div key={schedule.scheduleType} className={styles.tableRow}>
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
                  {topics.map((topic, index) => (
                    <div key={index} className={styles.topicItem}>
                      <span className={styles.topicText}>{topic}</span>
                      <button
                        type="button"
                        className={styles.topicDeleteButton}
                        onClick={() => handleDeleteTopic(index)}
                      >
                        <span className={styles.topicDeleteButtonText}>삭제</span>
                      </button>
                    </div>
                  ))}

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
                {projectId !== null && (
                  <ParticipantManagement
                    projectId={projectId}
                    participantUserIds={participantUserIds}
                    onChangeParticipantUserIds={setParticipantUserIds}
                  />
                )}
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
          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isSaving}
          >
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
        initialStartAt={selectedSchedule?.startAt ?? null}
        initialEndAt={selectedSchedule?.endAt ?? null}
      />

      <TopicRegisterModal
        isOpen={isTopicModalOpen}
        onClose={handleCloseTopicModal}
        onConfirm={handleTopicConfirm}
      />

      {projectId && (
        <ProjectNameEditModal
          isOpen={isProjectNameEditModalOpen}
          projectId={projectId}
          currentName={projectName}
          onClose={() => setIsProjectNameEditModalOpen(false)}
          onSuccess={newName => {
            setProjectName(newName);
          }}
        />
      )}

      <ProjectDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSaving}
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
