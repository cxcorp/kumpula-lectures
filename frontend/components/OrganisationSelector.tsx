import React from "react";
import ReactSelect from "react-select";

interface OrganisationSelectorProps<TOption extends object> {
  value: string[];
  options: TOption[];
  onChange: (option: TOption[] | null) => void;
}

function OrganisationSelector<
  TOption extends object = { value: string; label: string }
>({ value, options, onChange }: OrganisationSelectorProps<TOption>) {
  return (
    <>
      <label>Responsible unit</label>
      <ReactSelect onChange={onChange} options={options} isMulti />
    </>
  );
}

export default OrganisationSelector;
