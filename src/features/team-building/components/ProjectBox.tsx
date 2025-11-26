import { img, wrap } from '../styles/projectBox';

interface ProjectBoxProps {
  /**
   * 프로젝트 제목
   */
  title: string;
  /**
   * 프로젝트 설명
   */
  description: string;
  /**
   * 프로젝트 이미지 URL
   */
  imageUrl: string;
  /**
   * 프로젝트 박스 클릭 핸들러
   */
  onClick?: () => void;
}

export default function ProjectBox({ title, description, imageUrl, onClick }: ProjectBoxProps) {
  return (
    <div css={wrap} onClick={onClick}>
      <div css={img}>
        <img src={imageUrl} alt={title} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
