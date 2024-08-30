'use client'
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
import Involvement from "../components/Involvement"
import { useTheme } from "next-themes";
// Local Data
import data from "../data/portfolio.json";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ISOToDate, useIsomorphicLayoutEffect } from "../utils";
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Field, Label, Switch } from '@headlessui/react';
import ContactForm from "../components/ContactForm";
export default function Contact(){
    const [agreed, setAgreed] = useState(false)
    const theme = useTheme();
    const router = useRouter();
    const [mount, setMount] = useState(false);
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
  useEffect(() => {
    setMount(true);
  }, []);

//   useIsomorphicLayoutEffect(() => {
//     stagger(
//       [textOne.current, textTwo.current, textThree.current, textFour.current],
//       { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
//       { y: 0, x: 0, transform: "scale(1)" }
//     );
//   }, []);
    return(<>
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>{data.name}</title>
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
          isBlog={true}
        />
        <div className="laptop:mt-20 mt-10">
            <div className="mt-5">
            <h1
              className="text-xl tablet:text-6xl laptop:text-4xl laptopl:text-4xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5"
            >
                Get in Contact
            </h1>
            </div>
        </div>
        <Socials />
        <ContactForm />

    </div>
    </div>
    </>);
}