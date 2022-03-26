import React, { HTMLAttributes } from "react";

type TButtonSize = "small" | "middle" | "large";

interface IProps extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: TButtonSize;
  loading?: boolean;
}

const Button: React.FC<IProps> = (props) => {
  const { className, size, loading, children, onClick } = props;
  return (
    <button
      onClick={onClick}
      className={`      
      ${className}
      ${
        size === "small"
          ? "py-1 px-1.5 text-xs"
          : size === "large"
          ? "py-2.5 px-3.5"
          : "py-1.5 px-2.5 text-sm"
      }      
       bg-gray-800 rounded shadow     
      border border-transparent
       active:scale-95
       `}
      disabled={loading}
    >
      {loading ? <span>Loading...</span> : <span>{children}</span>}
    </button>
  );
};

export default Button;
