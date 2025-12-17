import { forwardRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { ko } from 'date-fns/locale';
import ReactDatePicker from 'react-datepicker';

import styles from '../../styles/ScheduleRegisterModal.module.css';

import 'react-datepicker/dist/react-datepicker.css';

type ScheduleRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: 'period' | 'single';
  onConfirm: (startDate: Date, endDate?: Date) => void;

  initialStartAt?: string | null;
  initialEndAt?: string | null;
};

const formattingDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${year}.${month}.${day} ${displayHours}${period}`;
};

const ScheduleRegisterModal = ({
  isOpen,
  onClose,
  title,
  type = 'period',
  onConfirm,
  initialStartAt,
  initialEndAt
}: ScheduleRegisterModalProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [singleDate, setSingleDate] = useState<Date | null>(null);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) return;

    if (type === 'single') {
      setSingleDate(initialStartAt ? new Date(initialStartAt) : null);
    } else {
      setStartDate(initialStartAt ? new Date(initialStartAt) : null);
      setEndDate(initialEndAt ? new Date(initialEndAt) : null);
    }
  }, [isOpen, type, initialStartAt, initialEndAt]);

  const handleConfirm = () => {
    if (type === 'single' && singleDate) {
      onConfirm(singleDate);
      onClose();
    } else if (type === 'period' && startDate && endDate) {
      onConfirm(startDate, endDate);
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 시작일 Input (기간 모드용)
  const StartDateInput = forwardRef<HTMLDivElement, { onClick?: () => void }>(
    ({ onClick }, ref) => (
      <div className={styles.dateInputBox} onClick={onClick} ref={ref}>
        <Image src="/calendar.svg" alt="달력" width={24} height={24} />
        <span className={startDate ? styles.dateInputValue : styles.dateInputPlaceholder}>
          {startDate ? formattingDate(startDate) : '시작일'}
        </span>
      </div>
    )
  );
  StartDateInput.displayName = 'StartDateInput';

  // 종료일 Input (기간 모드용)
  const EndDateInput = forwardRef<HTMLDivElement, { onClick?: () => void }>(({ onClick }, ref) => (
    <div className={styles.dateInputBox} onClick={onClick} ref={ref}>
      <Image src="/calendar.svg" alt="달력" width={24} height={24} />
      <span className={endDate ? styles.dateInputValue : styles.dateInputPlaceholder}>
        {endDate ? formattingDate(endDate) : '종료일'}
      </span>
    </div>
  ));
  EndDateInput.displayName = 'EndDateInput';

  // 단일 날짜 Input (단일 모드용)
  const SingleDateInput = forwardRef<HTMLDivElement, { onClick?: () => void }>(
    ({ onClick }, ref) => (
      <div className={styles.dateInputBoxFull} onClick={onClick} ref={ref}>
        <Image src="/calendar.svg" alt="달력" width={24} height={24} />
        <span className={singleDate ? styles.dateInputValue : styles.dateInputPlaceholder}>
          {singleDate ? formattingDate(singleDate) : '시작일'}
        </span>
      </div>
    )
  );
  SingleDateInput.displayName = 'SingleDateInput';

  if (!isOpen) return null;

  const isConfirmEnabled =
    type === 'single' ? singleDate !== null : startDate !== null && endDate !== null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.contentContainer}>
          {/* 제목과 닫기 버튼 */}
          <div className={styles.headerRow}>
            <div className={styles.infoContainer}>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.subtitle}>기간을 등록해주세요.</p>
            </div>
            <button type="button" className={styles.closeButton} onClick={onClose}>
              <Image src="/close.svg" alt="닫기" width={24} height={24} />
            </button>
          </div>

          {/* 날짜 선택 영역 */}
          {type === 'single' ? (
            // 단일 날짜 선택 모드
            <div className={styles.singleDatePickerContainer}>
              <div className={styles.datePickerWrapperFull}>
                <ReactDatePicker
                  locale={ko}
                  customInput={<SingleDateInput />}
                  name="single_date"
                  selected={singleDate}
                  onChange={(date: Date | null) => setSingleDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  dateFormat="yyyy.MM.dd ha"
                  placeholderText="시작일"
                  autoComplete="off"
                />
              </div>
            </div>
          ) : (
            // 기간 선택 모드
            <div className={styles.datePickerContainer}>
              <div className={styles.datePickerWrapper}>
                <ReactDatePicker
                  locale={ko}
                  customInput={<StartDateInput />}
                  name="start_date"
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  dateFormat="yyyy.MM.dd ha"
                  placeholderText="시작일"
                  autoComplete="off"
                />
              </div>
              <span className={styles.wave}>~</span>
              <div className={styles.datePickerWrapper}>
                <ReactDatePicker
                  locale={ko}
                  customInput={<EndDateInput />}
                  name="end_date"
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={60}
                  dateFormat="yyyy.MM.dd ha"
                  placeholderText="종료일"
                  autoComplete="off"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`${styles.confirmButton} ${isConfirmEnabled ? styles.confirmButtonActive : ''}`}
          onClick={handleConfirm}
          disabled={!isConfirmEnabled}
        >
          <span
            className={`${styles.confirmButtonText} ${isConfirmEnabled ? styles.confirmButtonTextActive : ''}`}
          >
            확인
          </span>
        </button>
      </div>
    </div>
  );
};

export default ScheduleRegisterModal;
