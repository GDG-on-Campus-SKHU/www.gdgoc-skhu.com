import Link from 'next/link';
import { css } from '@emotion/react';
import { colors } from '../../../../styles/constants';

export default function DropdownMenu() {
  return (
    <div
      css={css`
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 1rem;
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
        min-width: 116px;
        min-height: 146px;
        z-index: 110;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        &::before {
          content: '';
          position: absolute;
          top: -1rem; 
          left: 0;
          right: 0;
          height: 1rem; 
          background: transparent;
        }
        
        a {
          flex: 1;
          padding-left: 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          &:hover {
            background-color: ${colors.grayscale[200]};
          }
          &:active {
            background-color: ${colors.grayscale[300]};
          }
        }
      `}
    >
      <Link href="/mypage/profile" scroll={false}>
        Profile
      </Link> 
      <Link href="/mypage/myproject" scroll={false}>
        MyProject
      </Link>
      <Link href="/mypage/myteam" scroll={false}>
        My team
      </Link>
    </div>
  );
}