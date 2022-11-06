import React from "react";

const Footer: React.FC = () => {
  const Anchor = (text: string, href: string) => {
    return (
      <a className="underline" href={href} target="_blank" rel="noreferrer">
        {text}
      </a>
    );
  };

  return (
    <div className="w-full shadow bg-zinc-800 py-10">
      <div className="container mx-auto flex flex-col gap-3 md:gap-0 md:flex-row items-center justify-between text-sm">
        <p>Copyright &copy; 2022. All rights reserved.</p>
        <ul className="flex flex-col md:flex-row items-center gap-3">
          <li>{Anchor("Github", "https://github.com/saifulshihab/card-32")}</li>
          <li>{Anchor("Version 1.0", "https://card69.netlify.app/")}</li>
        </ul>
        <p>
          Design and developed by{" "}
          <a
            className="text-primary"
            href="https://github.com/saifulshihab"
            target="_blank"
            rel="noreferrer"
          >
            Saiful Islam Shihab.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
