/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { field } from '../styles/field';

interface FieldOfLoginProps {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasError?: boolean;
}

export default function FieldOfLogin({
    placeholder,
    value,
    onChange,
    hasError,
}: FieldOfLoginProps) {
    return (
        <div css={css`width: 100%;`}>
            <input
                type={placeholder.toLowerCase() === 'password' ? 'password' : 'text'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                css={field(hasError)}
            />
        </div>
    );
}
