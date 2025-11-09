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
        <img src={imageUrl} alt={title} />
      </div>
      <h3 css={{ color: '#040405' }}>{title}</h3>
      <p css={{ color: '#979CA5' }}>{description}</p>
    </div>
  );
}
