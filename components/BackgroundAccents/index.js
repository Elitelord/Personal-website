import React from "react";

const BackgroundAccents = () => {
  return (
    <>
      {/* Decorative Accents — abstract shapes scattered throughout */}
      {/* Upper area */}
      <div className="accent-pink w-[500px] h-[300px] top-[5%] right-[5%]"></div>
      <div className="accent-teal w-[400px] h-[220px] top-[18%] left-[-2%]"></div>

      {/* Mid area */}
      <div className="accent-purple w-[600px] h-[400px] top-[38%] right-[-5%]"></div>
      <div className="accent-blue w-[450px] h-[250px] top-[50%] left-[3%]"></div>
      <div className="accent-pink w-[350px] h-[500px] top-[60%] left-[25%]"></div>

      {/* Lower area */}
      <div className="accent-teal w-[500px] h-[320px] top-[76%] right-[5%]"></div>
      <div className="accent-purple w-[400px] h-[250px] top-[90%] left-[0%]"></div>
    </>
  );
};

export default BackgroundAccents;
