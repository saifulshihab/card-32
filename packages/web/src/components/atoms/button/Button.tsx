import React, { PropsWithChildren } from "react";

interface IProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
}

const Button: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { className, disabled } = props;
  return (
    <button
      {...props}
      className={`btn-primary ${
        disabled ? "cursor-not-allowed bg-opacity-50" : ""
      } ${className}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
