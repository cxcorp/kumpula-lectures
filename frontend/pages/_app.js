import { LocalizationContextContainer } from "../components/LocalizationContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <LocalizationContextContainer>
      <Component {...pageProps} />
    </LocalizationContextContainer>
  );
}

export default MyApp;
