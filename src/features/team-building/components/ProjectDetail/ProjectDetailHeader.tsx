import { css } from '@emotion/react';

import StatusBadge from '../ProjectGallery/StatusBadge';
import { ServiceStatus } from '../../types/gallery';

type Props = {
  title: string;
  subtitle: string;
  status?: ServiceStatus;
};

export default function ProjectDetailHeader({ title, subtitle, status }: Props) {
  const showBadge = status === 'IN_SERVICE';

  return (
    <section css={wrapCss}>
      <div css={titleRowCss}>
        <h2 css={titleCss}>{title}</h2>
        {showBadge && <StatusBadge status={status} />}
      </div>
      <p css={subtitleCss}>{subtitle}</p>
    </section>
  );
}

const wrapCss = css`
  margin-top: 24px;
`;
const titleRowCss = css`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;
const titleCss = css`
  font-size: 36px;
  font-weight: 700;
  line-height: 160%;
`;
const subtitleCss = css`
  font-size: 24px;
  font-weight: 500;
  color: #979ca5;
  line-height: 160%;
`;
