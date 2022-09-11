import "normalize.css";
import { LocalizationContextContainer } from "../components/LocalizationContext";
import "../styles/globals.scss";
import "../styles/OrganisationSelector.scss";

function MyApp({ Component, pageProps }) {
  return (
    <LocalizationContextContainer>
      <Component {...pageProps} />
    </LocalizationContextContainer>
  );
}

export default MyApp;
