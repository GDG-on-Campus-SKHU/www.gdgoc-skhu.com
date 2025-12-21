import { useEffect, useState } from 'react';
import { checkYoutubeExists } from '@/lib/activity.api';
import { css } from '@emotion/react';

import StatusBadge from './Badge';

interface ActivityCardProps {
  title: string;
  author: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  year: string;
}

const FALLBACK_THUMB = '/gdgoc_logo.svg';

export default function ActivityCard({ title, author, youtubeId, year }: ActivityCardProps) {
  const [isValidVideo, setIsValidVideo] = useState<boolean | null>(null);

  useEffect(() => {
    if (!youtubeId) {
      setIsValidVideo(false);
      return;
    }

    checkYoutubeExists(youtubeId).then(setIsValidVideo);
  }, [youtubeId]);

  const thumbnailUrl =
    youtubeId && isValidVideo
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : FALLBACK_THUMB;

  return (
    <article css={articleCss}>
      <div css={thumbFrameCss}>
        {isValidVideo ? (
          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={thumbnailUrl} alt={title} css={thumbnailImgCss} />
          </a>
        ) : (
          <img src={thumbnailUrl} alt="기본 썸네일" css={thumbnailImgCss} />
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
