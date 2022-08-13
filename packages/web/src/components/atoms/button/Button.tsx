import React, { PropsWithChildren } from "react";

interface IProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
  loading?: boolean;
}

const Button: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { loading, className, disabled } = props;
  return (
    <button
      {...props}
      className={`btn-primary ${
        disabled ? "cursor-wait bg-opacity-50" : ""
      } ${className}`}
      disabled={loading}
    >
      {props.children}
      {loading ? "..." : null}
    </button>
  );
};

export default Button;
