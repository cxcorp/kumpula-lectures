import React from "react";
import ReactSelect from "react-select";

import { useLocalizationContext } from "./LocalizationContext";
import styles from "../styles/OrganisationSelector.module.scss";

interface OrganisationSelectorProps<TOption extends object> {
  className?: string;
  value: string[];
  options: TOption[];
  onChange: (option: TOption[] | null) => void;
}

function OrganisationSelector({
  className,
  value,
  options,
  onChange,
}: OrganisationSelectorProps<{ value: string; label: string }>) {
  const { t } = useLocalizationContext();

  return (
    <div className={className}>
      <label className={styles.label}>{t("Responsible unit")}</label>
      <ReactSelect
        className="organisation-selector"
        classNamePrefix="organisation-selector"
        onChange={onChange}
        options={options}
        value={options.filter((opt) => value.includes(opt.value))}
        isMulti
      />
    </div>
  );
}

export default OrganisationSelector;
