import { useRef } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
import Timeline from "../components/Timeline";
import SkillsMarquee from "../components/SkillsMarquee";
import BackgroundAccents from "../components/BackgroundAccents";
import CodingProfiles from "../components/CodingProfiles";

// Local Data
import data from "../data/portfolio.json";

export default function Home() {
  // Ref
  const workRef = useRef();
  const aboutRef = useRef();
  const experiencesRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();

  // Handling Scroll
  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleExperiencesScroll = () => {
    window.scrollTo({
      top: experiencesRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    stagger(
      [textOne.current, textTwo.current, textThree.current, textFour.current],
      { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
      { y: 0, x: 0, transform: "scale(1)" }
    );
  }, []);

  return (
    <div className={`relative min-h-screen z-0 ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>{data.name}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>
      
      <BackgroundAccents />

      <div className="container mx-auto mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
          handleExperiencesScroll={handleExperiencesScroll}
        />
        <div className="laptop:mt-14 mt-8">
          <div className="mt-3">
            <p
              ref={textOne}
              className="text-base laptop:text-lg font-medium tracking-widest uppercase text-blue-600/80 dark:text-blue-400/60 mb-3"
            >
              {data.headerTaglineOne}
            </p>
            <h1
              ref={textTwo}
              className="text-4xl tablet:text-5xl laptop:text-6xl laptopl:text-7xl font-semibold tracking-tight text-gray-900 dark:text-white"
            >
              {data.headerTaglineTwo}
            </h1>
            <h2
              ref={textThree}
              className="mt-2 text-2xl tablet:text-3xl laptop:text-4xl laptopl:text-5xl font-normal text-gray-500 dark:text-gray-400 leading-snug"
            >
              {data.headerTaglineThree}
            </h2>
            {data.headerTaglineFour && (
              <p
                ref={textFour}
                className="mt-1 text-2xl tablet:text-3xl laptop:text-4xl laptopl:text-5xl font-light text-gray-400 dark:text-gray-500"
              >
                {data.headerTaglineFour}
              </p>
            )}
          </div>

          <Socials className="mt-5 laptop:mt-7" />
        </div>

        {/* Skills Marquee */}
        <div className="mt-8 mb-8">
          <SkillsMarquee />
        </div>

        {/* Coding Profiles Section */}
        <div className="mt-10 laptop:mt-16 p-2 laptop:p-0">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200">Problem Solving</h1>
            <div className="h-1 lg:h-0.5 bg-gradient-to-r from-blue-500 to-transparent flex-1 opacity-50 rounded-full"></div>
          </div>
          <CodingProfiles />
        </div>

        {/* Timeline Section */}
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={experiencesRef}>
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200">Experiences</h1>
            <div className="h-1 lg:h-0.5 bg-gradient-to-r from-blue-500 to-transparent flex-1 opacity-50 rounded-full"></div>
          </div>
          <Timeline
            experiences={data.resume.experiences}
            education={data.resume.education}
          />
        </div>

        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200">Projects</h1>
            <div className="h-1 lg:h-0.5 bg-gradient-to-r from-blue-500 to-transparent flex-1 opacity-50 rounded-full"></div>
          </div>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {data.projects
              .filter((project) => !["OnTime", "NotABum", "CurrencyConverter", "QuickNotes"].includes(project.title.trim()))
              .map((project) => (
              <WorkCard
                key={project.id}
                img={project.imageSrc}
                name={project.title}
                description={project.description}
                onClick={() => window.open(project.url)}
              />
            ))}
          </div>
        </div>

        {/* <div className="mt-10 laptop:mt-30 p-2 laptop:p-0">
          <h1 className="tablet:m-10 text-2xl text-bold">Services.</h1>
          <div className="mt-5 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
            {data.services.map((service, index) => (
              <ServiceCard
                key={index}
                name={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div> */}
        {/* This button should not go into production */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-5 right-5">
            <Link href="/edit">
              <Button type="primary">Edit Data</Button>
            </Link>
          </div>
        )}
        <div className="mt-20 laptop:mt-30 pb-10" ref={aboutRef}>
          <div className="flex items-center gap-4 mb-10 p-2 laptop:p-0">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200">About</h1>
            <div className="h-1 lg:h-0.5 bg-gradient-to-r from-blue-500 to-transparent flex-1 opacity-50 rounded-full"></div>
          </div>
          
          <div className="relative overflow-hidden group w-full rounded-2xl laptop:rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black border border-gray-200 dark:border-zinc-800 shadow-xl p-8 laptop:p-12 transition-all duration-300 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <p className="relative z-10 text-xl laptop:text-2xl leading-relaxed text-gray-600 dark:text-gray-300 font-normal">
              {data.aboutpara}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
