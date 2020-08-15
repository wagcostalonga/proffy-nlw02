import React, { SelectHTMLAttributes } from 'react';

import './styles.css';

// O SelectHTMLAttributes recebe todos os parâmetros que um Select pode ter
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const Select: React.FC<SelectProps> = ({ label, name, options, ...rest }) => {
  return (
    <div className="select-block">
      <label htmlFor={name}>{label}</label>
      <select value="" id={name} {...rest}>
        <option value="" disabled hidden >Selecione...</option>
        {options.map(option => {
        return <option key={option.value} value={option.value}>{option.label}</option>
      })}</select>
    </div>
  );
}

export default Select;