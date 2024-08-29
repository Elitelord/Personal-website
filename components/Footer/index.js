import React from "react";
import Socials from "../Socials";
import Link from "next/link";
import Button from "../Button";

const Footer = ({}) => {
  return (
    <>
      <div className="mt-5 laptop:mt-40 p-2 laptop:p-0">
        <div>
          <h1 className="text-2xl text-bold">Contact.</h1>
          <div className="mt-10">
            <h1 className="text-3xl tablet:text-4xl laptop:text-4xl laptopl:text-4xl text-bold">
            Let&apos;s work
            </h1>
            <h1 className="text-3xl tablet:text-4xl laptop:text-4xl laptopl:text-4xl text-bold">
              together
            </h1>
            <Button type="primary">Schedule a call</Button>
            <div className="mt-10">
              <Socials />
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Footer;
