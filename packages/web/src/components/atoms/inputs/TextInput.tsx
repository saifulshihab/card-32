import React from "react";

interface IProps {
  id?: string;
  name?: string;
  label?: string;
  type?: string;
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errorMessage?: string;
  infoMessage?: string;
}

const TextInput: React.FC<IProps> = (props) => {
  const { label, type, errorMessage, infoMessage, className } = props;
  return (
    <div className="w-full">
      {label ? <p className="text-sm mb-2 font-semibold">{label}</p> : null}
      <input
        type={type || "text"}
        {...(props as any)}
        className={`w-full outline-none bg-transparent p-1 px-3 text-sm ${
          className ? className : ""
        }`}
      />
      {errorMessage ? (
        <div className="mt-1">
          <p className="text-xs font-semibold text-red-500">{errorMessage}</p>
        </div>
      ) : infoMessage ? (
        <div className="mt-1">
          <p className="text-xs font-semibold text-green-500">{infoMessage}</p>
        </div>
      ) : null}
    </div>
  );
};

export default TextInput;
