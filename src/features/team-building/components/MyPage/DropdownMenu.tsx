import Link from 'next/link';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

interface Props {
  role: string | null;
}

export default function DropdownMenu({ role }: Props) {
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
          padding-left: 8px;
          height: 36px;
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

      {(role === 'ROLE_SKHU_MEMBER' || role === 'ROLE_SKHU_ADMIN') && (
        <Link href="/mypage/myproject" scroll={false}>
          My project
        </Link>
      )}

      <Link href="/mypage/myteam" scroll={false}>
        My team
      </Link>
    </div>
  );
}
