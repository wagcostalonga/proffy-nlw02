import React, { InputHTMLAttributes } from 'react';

import './styles.css';

// O InputHTMLAttributes recebe todos os parâmetros que um input pode ter
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

const Input: React.FC<InputProps> = ({ label, name, ...rest }) => {
  return (
    <div className="input-block">
      <label htmlFor={name}>{label}</label>
      <input type="text" id={name} {...rest}/>
    </div>
  );
}

export default Input;