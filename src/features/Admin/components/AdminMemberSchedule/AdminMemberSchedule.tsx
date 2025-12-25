/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';

import styles from '../../styles/AdminMemberSchedule.module.css';

type ScheduleItem = {
  id: number;
  category: string;
  status: '등록 전' | '진행 중' | '완료';
  period: string;
};

const INITIAL_SCHEDULES: ScheduleItem[] = [
  { id: 1, category: '아이디어 등록', status: '등록 전', period: '' },
  { id: 2, category: '1차 팀빌딩', status: '등록 전', period: '' },
  { id: 3, category: '1차 팀빌딩 결과 발표', status: '등록 전', period: '' },
  { id: 4, category: '2차 팀빌딩', status: '등록 전', period: '' },
  { id: 5, category: '2차 팀빌딩 결과 발표', status: '등록 전', period: '' },
  { id: 6, category: '3차 팀빌딩', status: '등록 전', period: '' },
  { id: 7, category: '최종 결과 발표', status: '등록 전', period: '' },
];

const AdminProjectManagement: NextPage = () => {
  const [projectName] = useState('그로우톤');
  const [schedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);

  const [isScheduleOpen, setIsScheduleOpen] = useState(true);
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [isParticipantOpen, setIsParticipantOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  const handleRegister = (id: number) => {
    console.log('Register schedule:', id);
  };

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
          <div className={styles.accordionSection}>
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
                          className={styles.registerButton}
                          onClick={() => handleRegister(schedule.id)}
                        >
                          <span className={styles.registerButtonText}>등록하기</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 주제 관리 */}
          <div className={styles.accordionSection}>
            <div className={styles.accordionHeader} onClick={() => setIsTopicOpen(!isTopicOpen)}>
              <span className={styles.accordionTitle}>주제 관리</span>
              <div
                className={`${styles.accordionArrow} ${isTopicOpen ? styles.accordionArrowOpen : ''}`}
              >
                <Image src="/dropdownarrow.svg" alt="" width={24} height={24} />
              </div>
            </div>

            {isTopicOpen && <div className={styles.accordionContent}>{/* 주제 관리 콘텐츠 */}</div>}
          </div>

          {/* 참여자 관리 */}
          <div className={styles.accordionSection}>
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
              <div className={styles.accordionContent}>{/* 참여자 관리 콘텐츠 */}</div>
            )}
          </div>

          {/* 팀 관리 */}
          <div className={styles.accordionSection}>
            <div className={styles.accordionHeader} onClick={() => setIsTeamOpen(!isTeamOpen)}>
              <span className={styles.accordionTitle}>팀 관리</span>
              <div
                className={`${styles.accordionArrow} ${isTeamOpen ? styles.accordionArrowOpen : ''}`}
              >
                <Image src="/dropdownarrow.svg" alt="" width={24} height={24} />
              </div>
            </div>

            {isTeamOpen && <div className={styles.accordionContent}>{/* 팀 관리 콘텐츠 */}</div>}
          </div>
        </div>

        <div className={styles.actionRow}>
          <button type="button" className={styles.deleteButton}>
            <span className={styles.deleteButtonText}>프로젝트 삭제하기</span>
          </button>
          <button type="button" className={styles.saveButton}>
            <span className={styles.saveButtonText}>저장하기</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminProjectManagement;
