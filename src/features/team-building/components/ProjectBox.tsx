import Image from 'next/image';

import { colors } from '../../../styles/constants/colors';
import { img, wrap } from '../styles/projectBox';

interface ProjectBoxProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function ProjectBox({ title, description, imageUrl }: ProjectBoxProps) {
  return (
    <div css={wrap}>
      <div css={img}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover', borderRadius: '8px' }}
          sizes="(max-width: 768px) 100vw, 420px"
        />
      </div>
      <h3 css={{ color: colors.grayscale[1000] }}>{title}</h3>
      <p css={{ color: colors.grayscale[500] }}>{description}</p>
    </div>
  );
}
