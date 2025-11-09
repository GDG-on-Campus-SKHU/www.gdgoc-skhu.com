import { errorText, field } from '../styles/field';

interface FieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
}

export default function Field({
  placeholder = 'PlaceHolder',
  value,
  onChange,
  disabled = false,
  error = false,
  errorMessage = '실패 힌트 텍스트',
}: FieldProps) {
  return (
    <div>
      <input
        css={field(error)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <div css={errorText}>{errorMessage}</div>}
    </div>
  );
}
