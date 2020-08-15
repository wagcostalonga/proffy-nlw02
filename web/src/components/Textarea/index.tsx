import React, { TextareaHTMLAttributes } from 'react';

import './styles.css';

// O TextareaHTMLAttributes recebe todos os parâmetros que um textarea pode ter
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, name, ...rest }) => {
  return (
    <div className="textarea-block">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} {...rest}/>
    </div>
  );
}

export default Textarea;