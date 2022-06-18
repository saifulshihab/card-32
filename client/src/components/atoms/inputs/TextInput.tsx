import React from "react";

interface IProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  className?: string;
  onChange?: () => void;
  placeholder?: string;
}

const TextInput: React.FC<IProps> = (props) => {
  const { label } = props;
  return (
    <div>
      {label ? <p>{label}</p> : null}
      <input {...(props as any)} />
    </div>
  );
};

export default TextInput;
