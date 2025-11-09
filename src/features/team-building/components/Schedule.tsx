import { icon, period, subject, textWrap, wrap } from '../styles/schedule';

interface ScheduleProps {
  title: string;
  startDate: string;
  endDate: string;
}

export default function Schedule({ title, startDate, endDate }: ScheduleProps) {
  return (
    <div css={wrap}>
      <div css={icon}></div>
      <div css={textWrap}>
        <h2 css={subject}>{title}</h2>
        <p css={period}>
          {startDate} ~ {endDate}
        </p>
      </div>
    </div>
  );
}
