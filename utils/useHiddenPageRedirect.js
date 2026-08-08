import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Pages gated behind a visibility flag in portfolio.json must not be reachable
 * by direct URL, only hidden from the nav. Sends the visitor home when the flag
 * is off and returns whether the page should render at all.
 *
 * Uses router.replace rather than push so the hidden URL never enters history —
 * with push, the back button lands on the hidden page and bounces again.
 *
 * Lives in its own module rather than utils/index.js so that pages importing
 * unrelated helpers from that barrel don't pull next/router in with them.
 */
export function useHiddenPageRedirect(visible) {
  const router = useRouter();

  useEffect(() => {
    if (!visible) {
      router.replace("/");
    }
  }, [visible, router]);

  return Boolean(visible);
}

export default useHiddenPageRedirect;
