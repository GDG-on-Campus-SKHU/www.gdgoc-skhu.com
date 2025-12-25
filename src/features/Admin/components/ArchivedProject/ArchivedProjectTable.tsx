import { colors } from '@/styles/constants';
import { css } from '@emotion/react';

import ArchivedProjectRow from './ArchivedProjectRow';

export type ColumnDef<T> = {
  /** thead에 표시할 라벨 */
  header: string;

  /** row에서 꺼낼 키 (render가 있으면 없어도 됨) */
  key?: keyof T;

  /** px or css string ("240px", "20%") */
  width?: number | string;

  /** th/td 정렬 */
  align?: 'left' | 'center' | 'right';

  /** 셀 커스텀 렌더 */
  render?: (row: T) => React.ReactNode;

  /** th/td 추가 css(필요 시) */
  thCss?: ReturnType<typeof css>;
  tdCss?: ReturnType<typeof css>;
};

type Props<T> = {
  columns: Array<ColumnDef<T>>;
  rows: T[];
  getRowKey: (row: T, index: number) => string | number;

  /** row click이 필요한 페이지(상세 이동 등) */
  onRowClick?: (row: T) => void;

  /** rows 없을 때 */
  emptyText?: string;
};

export default function ArchivedTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  emptyText = '데이터가 없습니다.',
}: Props<T>) {
  return (
    <div css={tableOuterCss}>
      <table css={tableCss}>
        <thead>
          <tr>
            {columns.map((c, idx) => (
              <th
                key={`${String(c.header)}-${idx}`}
                css={[thCss, colWidthCss(c.width), alignCss(c.align), c.thCss]}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td css={emptyTdCss} colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <ArchivedProjectRow<T>
                key={getRowKey(row, index)}
                row={row}
                columns={columns}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const tableOuterCss = css`
  width: 100%;
  overflow: hidden;
`;

const tableCss = css`
  width: 100%;
  border-collapse: collapse;
`;

const thCss = css`
  padding: 10px 17px;
  background: ${colors.grayscale[200]};
  font-size: 18px;
  font-weight: 500;
  line-height: 28.8px;
  word-wrap: break-word;
  color: #6b7280;
  text-align: left;
`;

const emptyTdCss = css`
  padding: 22px 28px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

const colWidthCss = (w?: number | string) => css`
  width: ${typeof w === 'number' ? `${w}px` : w || 'auto'};
`;

const alignCss = (align?: 'left' | 'center' | 'right') => css`
  text-align: ${align || 'left'};
`;
