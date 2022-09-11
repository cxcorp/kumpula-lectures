import s from "../styles/LandingBlock.module.scss";
import { useLocalizationContext } from "./LocalizationContext";

interface LandingBlockProps {
  className?: string;
}

function LandingBlock({}: LandingBlockProps) {
  const { t } = useLocalizationContext();

  return (
    <div className={s.landing_block}>
      <h1 className={s.title}>{t("Lecture listing")}</h1>
      <p className={s.text}>{t("Search for available lectures...")}</p>
    </div>
  );
}

export default LandingBlock;
