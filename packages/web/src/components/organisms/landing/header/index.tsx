import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full px-2 sm:px-0 py-3 bg-zinc-800 shadow">
      <div className="container mx-auto  flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-2xl sm:text-3xl font-extrabold">Card 32</p>
          <span className="text-xs text-gray-300 px-1.5 bg-zinc-700 rounded-full">
            v2.0
          </span>
        </div>

        <ul className="flex items-center gap-3">
          <li>
            <a href="#gameplay" className="text-xs text-gray-400">
              How to play?
            </a>
          </li>
          <li>
            <a
              href="https://github.com/saifulshihab/card-32"
              rel="noreferrer"
              target="_blank"
            >
              <i className="text-xl fa-brands fa-github" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
