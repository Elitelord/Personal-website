import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Cursor from "../components/Cursor";
import Header from "../components/Header";
import Minesweeper from "../components/Minesweeper";
import MinesweeperStats from "../components/Minesweeper/Stats";
import PersonalBests from "../components/Minesweeper/PersonalBests";
import data from "../data/portfolio.json";

const MinesweeperPage = () => {
  const router = useRouter();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  // Prefer going back to wherever they detonated from; fall back to home when
  // this page was opened directly (no history to return to).
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-screen z-0">
      {data.showCursor && <Cursor />}
      <Head>
        <title>{`Minesweeper — ${data.name}`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div
        className={`container mx-auto mb-10 ${data.showCursor && "cursor-none"}`}
      >
        <Header isBlog />

        {mount && (
          <div className="ms-enter mt-10 w-full flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control border border-gray-300 dark:border-zinc-700 text-sm text-gray-600 dark:text-zinc-300 hover:border-gray-500 dark:hover:border-zinc-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-black"
              >
                <span aria-hidden="true">&#8592;</span> Back to home
              </button>

              <h1 className="mt-8 text-4xl font-semibold tracking-tight">
                Secret Minesweeper Page
              </h1>
              <p className="mt-3 w-full laptop:w-4/5 text-base opacity-70 leading-relaxed">
                Congratulations! You found the hidden minesweeper page. I really
                enjoy playing Minesweeper, so I built a version into my website
                that you can play below. Additionally, some of my stats on
                minesweeper.online are below.
              </p>

              <div className="mt-10">
                <Minesweeper />
              </div>

              <PersonalBests />
              <MinesweeperStats />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinesweeperPage;
