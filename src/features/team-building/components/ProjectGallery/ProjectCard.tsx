import Link from 'next/link';
import { css } from '@emotion/react';

import StatusBadge from './StatusBadge';
import { ProjectGalleryListItem } from '../../types/gallery';

type Props = { item: ProjectGalleryListItem };

export default function ProjectCard({ item }: Props) {
  return (
    <Link href={`/project-gallery/${item.id}`}>
      <article css={articleCss}>
        <div css={thumbFrameCss}>
          <img src={item.thumbnailUrl ?? '/gdgoc_logo.svg'} alt={item.title} css={logoCss} />
        </div>
        <div css={metaCss}>
          <h3 css={titleCss}>{item.title}</h3>
          <p css={descCss}>{item.description}</p>
          <div css={badgeRowCss}>{item.status && <StatusBadge status={item.status} />}</div>
        </div>
      </article>
    </Link>
  );
}

const articleCss = css`
  margin-bottom: 50px;
`;

const thumbFrameCss = css`
  height: 245px;
  border-radius: 12px;
  border: 1px solid var(--grayscale-900, #25282c);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const logoCss = css`
  width: 200px;
  height: 200px;
  object-fit: contain;
  display: block;
`;

const metaCss = css`
  margin-top: 15px;
`;

const titleCss = css`
  font-size: 18px;
  font-weight: 700;
  color: #111111;
  line-height: 160%;
`;

const descCss = css`
  font-size: 14px;
  color: #979ca5;
  line-height: 160%;
`;

const badgeRowCss = css`
  margin-top: 5px;
  min-height: 28px;
  display: flex;
  align-items: center;
`;
