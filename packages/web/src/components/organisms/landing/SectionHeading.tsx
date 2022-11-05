import React from "react";

interface IProps {
  text: string;
}

const SectionHeading: React.FC<IProps> = (props) => {
  const { text } = props;
  return (
    <p className="w-max text-3xl md:text-5xl font-extrabold mb-4 md:mb-8 gradient_text">
      {text}
    </p>
  );
};

export { SectionHeading };
