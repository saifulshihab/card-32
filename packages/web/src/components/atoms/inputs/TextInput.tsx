import { useField, FieldHookConfig } from "formik";
import React from "react";

type IProps = FieldHookConfig<string> & {
  label?: string;
};

const TextInput: React.FC<IProps> = ({ label, type, className, ...props }) => {
  const [field, meta] = useField(props as any);
  return (
    <div className="w-full">
      {label ? <p className="text-sm mb-2 font-semibold">{label}</p> : null}
      <input
        {...field}
        type={type || "text"}
        {...(props as any)}
        className={`w-full outline-none bg-transparent p-1 px-3 text-sm border-b border-primary ${
          className ? className : ""
        }`}
      />
      {meta.touched && meta.error ? (
        <div className="mt-1">
          <p className="text-xs font-semibold text-red-500">{meta.error}</p>
        </div>
      ) : null}
    </div>
  );
};

export default TextInput;
