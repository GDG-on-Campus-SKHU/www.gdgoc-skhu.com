import React, { forwardRef } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';

import { quillWrapperCss } from '../styles/quillWrapper';

import 'react-quill/dist/quill.snow.css';

export interface ReQuillProps extends ReactQuillProps {
  /**
   * placeholder 텍스트
   */
  placeholder?: string;

  /**
   * 퀼 disabled 옵션
   */
  disabled?: boolean;

  /**
   * 추가 className 지정
   */
  className?: string;

  /**
   * 에디터 높이
   * @default 300px
   */
  height?: string | number;
}

const ReQuill = forwardRef<ReactQuill, ReQuillProps>(
  ({ placeholder, className, disabled = false, height = 300, style, ...rest }, ref) => {
    return (
      <div css={quillWrapperCss} className={className} style={{ height, ...style }}>
        <ReactQuill ref={ref} readOnly={disabled} placeholder={placeholder} {...rest} />
      </div>
    );
  }
);

ReQuill.displayName = 'ReQuill';

export default ReQuill;
