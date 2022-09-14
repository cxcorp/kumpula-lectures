import { useState, useCallback, useMemo, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

import "@itcenteratunihelsinki/huds-lib/dist/fonts/fonts.css";
import "@itcenteratunihelsinki/huds-lib/dist/huds-lib/huds-lib.css";
import styles from "../styles/Home.module.scss";
import { useLocalizationContext } from "../components/LocalizationContext";
import WeekCalendar from "../components/WeekCalendar";
import OrganisationSelector from "../components/OrganisationSelector";
import LandingBlock from "../components/LandingBlock";
import organizations from "../data/organizations.json";
import hyBlack from "../public/hy_black2.png";

export async function getServerSideProps(context) {
  // const organizations = await import("../data/organizations.json");

  return {
    props: {
      organizations: organizations,
    },
  };
}

function Lectures({ organizations }) {
  const { l } = useLocalizationContext();

  const [events, setEvents] = useState({
    events: [],
    "organisations-by-id": {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const events = await import("../data/events_by_org.json");
      setEvents(events);
      setLoading(false);
    }
    loadEvents();
  }, []);

  const [selectedOrganisations, setSelectedOrganisations] = useState([
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

  const organizationOptions = useMemo(
    () =>
      organizations.map((org) => ({
        value: org.id,
        label: l(org.name),
      })),
    [organizations]
  );

  const eventList = useMemo(
    () => selectedOrganisations.flatMap((id) => events.events[id] || []),
    [events, selectedOrganisations]
  );

  return (
    <div>
      <div>
        <OrganisationSelector
          className={styles.org_selector}
          options={organizationOptions}
          value={selectedOrganisations}
          onChange={handleOrganisationChange}
        />
      </div>
      <div style={{ marginTop: "1rem", position: "relative" }}>
        {loading && (
          <div
            style={{
              left: 0,
              right: 0,
              width: "100%",
              height: "100%",
              background: "rgba(128,128,128,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              zIndex: 19,
            }}
          >
            <span
              className="icon icon--spinner spinner"
              style={{
                fontSize: "26px",
                color: "#107eab",
              }}
              aria-label="Loading..."
            />
          </div>
        )}
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

export default function Home({ organizations }) {
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
          <Lectures organizations={organizations} />
        </div>
      </main>
    </div>
  );
}
