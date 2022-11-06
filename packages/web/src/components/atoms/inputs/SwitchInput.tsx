import { Switch } from "@headlessui/react";
import React from "react";

interface IProps {
  checked: boolean;
  onChange?: (checked: ConstrainBoolean) => void;
  label?: string;
  labelClassName?: string;
}

const SwitchInput: React.FC<IProps> = (props) => {
  const { label, labelClassName, checked, onChange } = props;
  return (
    <div className="flex items-center">
      {label ? <p className={`${labelClassName} text-sm`}>{label}</p> : null}
      <Switch
        checked={checked}
        onChange={() => onChange && onChange(!checked)}
        className={`${
          checked ? "bg-primary" : "bg-zinc-700"
        } relative inline-flex h-5 w-10 items-center rounded-full`}
      >
        <span
          className={`${
            checked ? "translate-x-6" : "translate-x-1"
          } inline-block h-3 w-3 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
};

export { SwitchInput };
