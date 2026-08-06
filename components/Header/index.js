import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../Button";
// Local Data
import data from "../../data/portfolio.json";

const Header = ({ handleWorkScroll, handleAboutScroll, handleExperiencesScroll, isBlog }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false)
  const { name, showBlog, showResume, showContact} = data;
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // setIsClient(true);
    // const storedTheme = localStorage.getItem('theme');
    // if (storedTheme) {
    //   setTheme(storedTheme);
    // }
  }, []);

  return (
    <>
      <Popover className="block tablet:hidden sticky top-0 z-50 mt-5 p-2 rounded-xl backdrop-blur-lg bg-white/70 dark:bg-black/60 border border-transparent dark:border-zinc-800/50 shadow-sm transition-all duration-300">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between p-2 laptop:p-0">
              <h1
                onClick={() => router.push("/")}
                className="font-medium p-2 laptop:p-0 link text-gray-900 dark:text-white"
              >
                {name}.
              </h1>

              <div className="flex items-center gap-2">
                {data.darkMode && (
                  <Button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <img
                      className="h-6"
                      src={theme === "dark" ? "/images/moon.svg" : "/images/sun.svg"}
                      alt="theme"
                    ></img>
                  </Button>
                )}

                <Popover.Button className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                  {open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  )}
                </Popover.Button>
              </div>
            </div>
            <Popover.Panel
              className="absolute inset-x-0 mx-auto z-50 w-[95%] mt-2 p-4 backdrop-blur-xl bg-white/90 dark:bg-black/90 shadow-2xl border border-slate-200 dark:border-zinc-800 rounded-2xl"
            >
              {!isBlog ? (
                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={handleExperiencesScroll}>Experiences</Button>
                  <Button onClick={handleWorkScroll}>Projects</Button>
                  <Button onClick={handleAboutScroll}>About</Button>
                  {showBlog && (
                    <Button onClick={() => router.push("/blog")}>Blog</Button>
                  )}
                  {showContact && (
                    <Button onClick={() => router.push("/contact")}>Contact</Button>
                  )}
                  {showResume && (
                    <Button
                      onClick={() => router.push("/resume")}
                    >
                      Resume
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={() => router.push("/")} classes="first:ml-1">
                    Home
                  </Button>
                  {showBlog && (
                    <Button onClick={() => router.push("/blog")}>Blog</Button>
                  )}
                  {showResume && (
                    <Button
                      onClick={() => router.push("/resume")}
                      classes="first:ml-1"
                    >
                      Resume
                    </Button>
                  )}
                  {showContact && (
                    <Button onClick={() => router.push("/contact")}>Contact</Button>
                  )}
                </div>
              )}
            </Popover.Panel>
          </>
        )}
      </Popover>
      <div
        className="mt-10 hidden flex-row items-center justify-between sticky top-0 z-40 tablet:flex p-2 rounded-xl backdrop-blur-lg bg-white/70 dark:bg-black/60 border border-transparent dark:border-zinc-800/50 shadow-sm transition-all duration-300 dark:text-white"
      >
        <h1
          onClick={() => router.push("/")}
          className="font-medium cursor-pointer mob:p-2 laptop:p-0"
        >
          {name}.
        </h1>
        {!isBlog ? (
          <div className="flex">
            <Button onClick={handleExperiencesScroll}>Experiences</Button>
            <Button onClick={handleWorkScroll}>Projects</Button>
            <Button onClick={handleAboutScroll}>About</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}

            {showResume && (
              <Button
                onClick={() => router.push("/resume")}
                classes="first:ml-1"
              >
                Resume
              </Button>
            )}

            {/* <Button onClick={() => window.open("mailto:hello@chetanverma.com")}>
              Contact
            </Button> */}
            {mounted && theme && data.darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <img
                  className="h-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                ></img>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex">
            <Button onClick={() => router.push("/")}>Home</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Blog</Button>
            )}

            {showResume && (
              <Button
                onClick={() => router.push("/resume")}
                classes="first:ml-1"
              >
                Resume
              </Button>
            )}

            {/* <Button onClick={() => window.open("mailto:hello@chetanverma.com")}>
              Contact
            </Button> */}

            {mounted && theme && data.darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <img
                  className="h-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                ></img>
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
