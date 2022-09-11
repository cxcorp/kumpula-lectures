import { HySiteLogo } from "../vendor/react-huds-wrapper/src/components";
import {
  ColorVariant,
  SiteLogoSize,
  FooterVariant,
} from "../vendor/design-system-lib/src/utils/utils";
import styles from "../styles/Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <HySiteLogo
          className={styles.logo}
          color={ColorVariant.black}
          isGroup={true}
          isLuomusGroup={false}
          size={SiteLogoSize.small}
          type={FooterVariant.header}
          url="/"
          label="Luentolista"
        />
      </div>
    </header>
  );
}
