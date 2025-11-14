import { useState } from 'react';

import {
  addButton,
  addButtonContainer,
  fieldContainer,
  fieldWrap,
  selectBoxContainer,
  wrap,
} from '../styles/selectBoxLink';
import Field from './Field';
import SelectBoxBasic from './SelectBoxBasic';

export default function SelectBoxLink() {
  const [links, setLinks] = useState([{ id: 0, platform: '', url: '' }]);

  const handleAddLink = () => {
    setLinks([...links, { id: links.length, platform: '', url: '' }]);
  };

  return (
    <div css={wrap}>
      {links.map(link => (
        <div key={link.id} css={fieldWrap}>
          <div css={selectBoxContainer}>
            <SelectBoxBasic options={['GitHub', 'LinkedIn', 'Twitter', 'Website']} />
          </div>
          <div css={fieldContainer}>
            <Field placeholder="PlaceHolder" />
          </div>
        </div>
      ))}
      <div css={addButtonContainer}>
        <button css={addButton} onClick={handleAddLink}>
          +
        </button>
      </div>
    </div>
  );
}
