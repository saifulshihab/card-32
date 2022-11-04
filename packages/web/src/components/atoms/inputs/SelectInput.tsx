import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

interface ISelectOption {
  key: string;
  name: string;
  value: string;
}

interface IProps {
  value?: string;
  options?: ISelectOption[];
  onChange?: (value: string) => void;
}

const SelectInput: React.FC<IProps> = (props) => {
  const { value, options, onChange } = props;

  const handleSelect = (value: string) => {
    onChange && onChange(value);
  };

  return (
    <Listbox value={value} onChange={handleSelect}>
      <div className="relative mt-1 cursor-pointer">
        <Listbox.Button className="relative w-full rounded bg-zinc-700 py-2 px-8 shadow-md focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-sm">
          <span className="block truncate">{value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="z-20 absolute mt-1 max-h-60 w-full overflow-auto rounded bg-zinc-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options?.map((option) => (
              <Listbox.Option
                key={option.key}
                className={({ active, selected }) =>
                  `relative select-none py-2 px-8 ${
                    active ? "bg-zinc-800 text-white" : "text-white"
                  } ${selected ? "bg-zinc-800" : ""}`
                }
                value={option.value}
              >
                <span className="span">{option.value}</span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default SelectInput;
