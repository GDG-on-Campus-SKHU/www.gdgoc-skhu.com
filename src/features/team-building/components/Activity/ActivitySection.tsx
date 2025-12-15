import { Activity } from '@/lib/activity.api';
import { css } from '@emotion/react';

import ActivityCard from './ActivityCard';

interface ActivitySectionProps {
  categoryName: string;
  activities: Activity[];
}

export default function ActivitySection({ categoryName, activities }: ActivitySectionProps) {
  return (
    <div>
      <h2 css={categoryCss}>{categoryName}</h2>
      <div css={gridCss}>
        {activities.map((activity, index) => (
          <ActivityCard
            key={`${categoryName}-${index}`}
            title={activity.title}
            author={activity.speaker}
            youtubeId={activity.youtubeId}
            year={activity.generation}
          />
        ))}
      </div>
    </div>
  );
}

const categoryCss = css`
  font-size: 24px;
  line-height: 160%;
  color: #111111;
  margin-bottom: 2.5rem;
`;

const gridCss = css`
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;
