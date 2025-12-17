// 마크다운에서 첫 번째 이미지 URL 추출
export function extractFirstImageUrl(md: string): string | null {
  if (!md) return null;

  const mdImage = /!\[[^\]]*]\((https?:\/\/[^)\s]+)\)/i.exec(md);
  if (mdImage?.[1]) return mdImage[1];

  // 이미지 확장자 기반으로 첫 URL 찾기
  // - 공백/개행/괄호/따옴표로 잘리기 전까지를 URL로 간주
  // - 뒤에 querystring이 붙어도 허용
  const urlImage = /(https?:\/\/[^\s"')\]]+\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s"')\]]*)?)/i.exec(
    md
  );

  return urlImage?.[1] ?? null;
}
