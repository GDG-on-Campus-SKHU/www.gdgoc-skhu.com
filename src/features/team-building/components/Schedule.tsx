import { icon, period, subject, textWrap, wrap } from '../styles/schedule';

interface ScheduleProps {
  /**
   * 일정 제목
   */
  title: string;
  /**
   * 시작 날짜
   */
  startDate: string;
  /**
   * 종료 날짜
   */
  endDate: string;
  /**
   * 일정 클릭 핸들러
   */
  onClick?: () => void;
}

export default function Schedule({ title, startDate, endDate, onClick }: ScheduleProps) {
  return (
    <div css={wrap} onClick={onClick}>
      <div css={icon} aria-hidden="true" />
      <div css={textWrap}>
        <p css={subject}>{title}</p>
        <p css={period}>
          {startDate} ~ {endDate}
        </p>
      </div>
    </div>
  );
}
