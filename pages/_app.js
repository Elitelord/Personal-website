import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/next"
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import GridBackground from "../components/GridBackground";
import { DetonationProvider } from "../components/Detonation";
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
  const router = useRouter();
  // The minesweeper page is its own board — a second grid behind it (with live
  // bombs in it) competes with the one you're actually playing.
  const showGridBackground = router.pathname !== "/minesweeper";

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
      {/* Wraps the page so the blast overlay outlives the route change. */}
      <DetonationProvider>
        {showGridBackground && <GridBackground />}
        <Component {...pageProps} />
      </DetonationProvider>
      <Analytics />
    </ThemeProvider>
  );
};

export default App;
