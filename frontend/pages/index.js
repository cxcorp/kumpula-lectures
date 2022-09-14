import { useState, useCallback, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";

import "@itcenteratunihelsinki/huds-lib/dist/fonts/fonts.css";
import "@itcenteratunihelsinki/huds-lib/dist/huds-lib/huds-lib.css";
import styles from "../styles/Home.module.scss";
import { useLocalizationContext } from "../components/LocalizationContext";
import WeekCalendar from "../components/WeekCalendar";
import OrganisationSelector from "../components/OrganisationSelector";
import LandingBlock from "../components/LandingBlock";
import hyBlack from "../public/hy_black2.png";
import { useRouter } from "next/router";
import Link from "next/link";

export async function getServerSideProps(context) {
  const res = await axios.get(
    "http://127.0.0.1:3001/api/events-by-organisation"
  );
  if (res.data.status !== "ok") {
    return {
      props: {
        events: {
          "organisations-by-id": {},
          events: {},
        },
      },
    };
  }

  return {
    props: {
      events: res.data.data,
    },
  };
}

/**
 * @param {{ events: import("../api").Data }} props
 */
function Lectures({ events }) {
  const { l } = useLocalizationContext();

  const sortedOrganizations = Object.values(events["organisations-by-id"]).sort(
    (a, b) => l(a.name).localeCompare(l(b.name))
  );

  const [selectedOrganisations, setSelectedOrganisations] = useState([
    // sortedOrganizations[0].id,
    // pre-select CS BSc and MSc
    "hy-org-116716376",
    "hy-org-116738259",
  ]);

  const handleOrganisationChange = useCallback(
    (newValues) => {
      setSelectedOrganisations(newValues.map((kv) => kv.value));
    },
    [setSelectedOrganisations]
  );

  const eventList = useMemo(
    () => selectedOrganisations.flatMap((id) => events.events[id] || []),
    [selectedOrganisations]
  );

  return (
    <div>
      <div>
        <OrganisationSelector
          className={styles.org_selector}
          options={sortedOrganizations.map((org) => ({
            value: org.id,
            label: l(org.name),
          }))}
          value={selectedOrganisations}
          onChange={handleOrganisationChange}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <WeekCalendar events={eventList} />
      </div>
    </div>
  );
}

const localeToName = {
  fi: "suomi",
  sv: "svenska",
  en: "English",
};

/**
 * @param {{ events: import("../api").Data }} props
 */
export default function Home({ events }) {
  const { locale, locales } = useRouter();
  const availableLocales = locales.filter((value) => value !== locale);
  const { t } = useLocalizationContext();

  return (
    <div className={styles.container}>
      <Head>
        <title>{t("<title>")}</title>
        <meta
          name="description"
          content="Search for scheduled lectures in Exactum and explore other units at the University of Helsinki"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/" locale={locale}>
            <a>
              <Image
                width={64}
                height={64}
                src={hyBlack}
                alt="Blursed University of Helsinki logo, artistically rendered in MS Paint to make sure nobody thinks this is an actual site sponsored by UH"
              />
            </a>
          </Link>
          <p className={styles.header__title}>INTERNET-PALVELU</p>
          <div className={styles.lang_buttons}>
            {availableLocales.map((otherLocale) => (
              <Link
                key={otherLocale}
                href="/"
                locale={otherLocale}
                lang={otherLocale}
              >
                <a className={styles.lang_button}>
                  {localeToName[otherLocale]}
                </a>
              </Link>
            ))}
          </div>
        </div>

        <LandingBlock />

        <div className={styles.description}>
          <Lectures events={events} />
        </div>
      </main>
    </div>
  );
}
