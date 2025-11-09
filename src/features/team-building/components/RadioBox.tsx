import { useState } from 'react';

import { boxOff, boxOn } from '../styles/radioBox';

interface RadioBoxProps {
  text: string;
  isSelected: boolean;
}

export default function RadioBox({ text, isSelected }: RadioBoxProps) {
  const [click, setClick] = useState(isSelected);
  return (
    <div
      css={click ? boxOn : boxOff}
      onClick={() => {
        setClick(!click);
      }}
    >
      {text}
    </div>
  );
}
