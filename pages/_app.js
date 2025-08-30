import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
// import { SpeedInsights } from "@vercel/speed-insights/next"

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
