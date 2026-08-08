import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next"
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import GridBackground from "../components/GridBackground";
// import { SpeedInsights } from "@vercel/speed-insights/next"

// Self-hosted via next/font: no render-blocking request to fonts.googleapis.com
// and no layout shift, unlike the @import this replaced.
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

// Reserved for machine data — dates, tags, GPAs, timeline metadata.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class">
      {/* Published as variables on :root so no wrapper element is needed —
          a wrapper would sit between the fixed grid background and the page. */}
      <style jsx global>{`
        :root {
          --font-sans: ${sans.style.fontFamily};
          --font-mono: ${mono.style.fontFamily};
        }
      `}</style>
      <GridBackground />
      <Component {...pageProps} />
      <Analytics />
    </ThemeProvider>
  );
};

export default App;
