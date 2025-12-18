import { css } from '@emotion/react';

import type { ColumnDef } from './ArchivedProjectTable';

type Props<T> = {
  row: T;
  columns: Array<ColumnDef<T>>;
  onClick?: () => void;
};

export default function ArchivedProjectRow<T>({ row, columns, onClick }: Props<T>) {
  return (
    <tr css={[trCss, onClick && clickableCss]} onClick={onClick}>
      {columns.map((col, idx) => {
        const content =
          typeof col.render === 'function'
            ? col.render(row)
            : col.key
              ? (row[col.key] as any)
              : null;

        return (
          <td
            key={`${String(col.header)}-${idx}`}
            css={[tdCss, colWidthCss(col.width), alignCss(col.align), col.tdCss]}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}

const trCss = css`
  border-bottom: 1px solid #e5e7eb;
`;

const clickableCss = css`
  cursor: pointer;
  &:hover {
    background: rgba(59, 130, 246, 0.04);
  }
`;

const tdCss = css`
  padding: 25px 17px;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  word-wrap: break-word;
  color: #111827;
  vertical-align: middle;
`;

const colWidthCss = (w?: number | string) => css`
  width: ${typeof w === 'number' ? `${w}px` : w || 'auto'};
`;

const alignCss = (align?: 'left' | 'center' | 'right') => css`
  text-align: ${align || 'left'};
`;
