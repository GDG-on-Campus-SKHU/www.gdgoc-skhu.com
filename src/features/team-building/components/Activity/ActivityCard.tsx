import { css } from '@emotion/react';

import { Activity } from '../../types/activity';
import StatusBadge from './Badge';

interface ActivityCardProps
  extends Pick<Activity, 'title' | 'author' | 'thumbnailUrl' | 'youtubeId' | 'year'> {}

export default function ActivityCard({
  title,
  author,
  thumbnailUrl,
  youtubeId,
  year,
}: ActivityCardProps & { youtubeId?: string }) {
  const resolvedThumbnail = thumbnailUrl
    ? thumbnailUrl
    : youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : undefined;

  return (
    <article css={articleCss}>
      <div css={thumbFrameCss}>
        {resolvedThumbnail && (
          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={resolvedThumbnail} alt={title} css={thumbnailImgCss} />
          </a>
        )}
      </div>
      <div css={metaCss}>
        <h3 css={contentTitleCss}>{title}</h3>
        <div css={badgeContainerCss}>
          <p css={descCss}>{author}</p>
          <StatusBadge year={year} />
        </div>
      </div>
    </article>
  );
}

const articleCss = css`
  margin-bottom: 0;
  width: calc((100% - 60px) / 3);
  @media (max-width: 1024px) {
    width: calc((100% - 30px) / 2);
  }
  @media (max-width: 640px) {
    width: 100%;
  }
`;

const thumbFrameCss = css`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  border: 1px solid var(--grayscale-900, #25282c);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const thumbnailImgCss = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const metaCss = css`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const contentTitleCss = css`
  font-size: 20px;
  font-weight: 700;
  color: #111111;
  line-height: 160%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const descCss = css`
  font-size: 16px;
  line-height: 160%;
`;

const badgeContainerCss = css`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
`;
