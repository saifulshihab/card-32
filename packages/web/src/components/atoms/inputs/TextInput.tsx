import React from "react";

interface IProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

const TextInput: React.FC<IProps> = (props) => {
  const { label, error, className } = props;
  return (
    <div className="w-full">
      {label ? <p className="text-sm mb-2 font-semibold">{label}</p> : null}
      <input
        {...(props as any)}
        className={`w-full outline-none bg-transparent p-1 px-3 text-sm ${
          className ? className : ""
        }`}
      />
      {error ? (
        <div className="mt-1">
          <p className="text-xs font-semibold text-red-500">{error}</p>
        </div>
      ) : null}
    </div>
  );
};

export default TextInput;
