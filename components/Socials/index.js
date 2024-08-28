import React from "react";
import Button from "../Button";

import yourData from "../../data/portfolio.json";

const Socials = ({ className }) => {
  return (<>
    <div class="bg-white w-full h-auto py-8 flex items-center justify-center gap-4 flex-wrap">
      
      
      
      
      
      
      
      
      
     
      
      <button class="w-10 h-10 flex items-center relative overflow-hidden justify-center rounded-full bg-white shadow-md shadow-gray-200 group transition-all duration-300">
      <svg class="fill-gray-900 relative z-10 transition-all duration-300 group-hover:fill-white"  xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 72 72" fill="none">
      <path d="M24.7612 55.999V28.3354H15.5433V55.999H24.7621H24.7612ZM20.1542 24.5591C23.3679 24.5591 25.3687 22.4348 25.3687 19.7801C25.3086 17.065 23.3679 15 20.2153 15C17.0605 15 15 17.065 15 19.7799C15 22.4346 17.0001 24.5588 20.0938 24.5588H20.1534L20.1542 24.5591ZM29.8633 55.999H39.0805V40.5521C39.0805 39.7264 39.1406 38.8985 39.3841 38.3088C40.0502 36.6562 41.5668 34.9455 44.1138 34.9455C47.4484 34.9455 48.7831 37.4821 48.7831 41.2014V55.999H58V40.1376C58 31.6408 53.4532 27.6869 47.3887 27.6869C42.4167 27.6869 40.233 30.4589 39.0198 32.347H39.0812V28.3364H29.8638C29.9841 30.9316 29.8631 56 29.8631 56L29.8633 55.999Z" 
      fill=""/>
      </svg>
      <div class="absolute top-full left-0 w-full h-full rounded-full bg-[#006699] z-0 transition-all duration-500 group-hover:top-0"></div>
      </button>
      
      
      
      
      
      
      
      
      
      
      <button class="w-10 h-10 flex relative overflow-hidden items-center justify-center rounded-full bg-white shadow-md bg-opacity-0 shadow-gray-200 group transition-all duration-500">
      <svg class="fill-gray-900 relative z-10 transition-all duration-300 group-hover:fill-white" 
      xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 54 41" fill="none">
      <path class=""
        d="M4.00654 40.1236H12.4893V19.5227L0.371094 10.4341V36.4881C0.371094 38.4997 2.00099 40.1236 4.00654 40.1236Z"
        fill="" />
      <path class=""
        d="M41.5732 40.1236H50.056C52.0676 40.1236 53.6914 38.4937 53.6914 36.4881V10.4341L41.5732 19.5227"
        fill="" />
      <path class=""
        d="M41.5732 3.7693V19.5229L53.6914 10.4343V5.58702C53.6914 1.09118 48.5594 -1.47181 44.9663 1.22448"
        fill="" />
      <path  class=""
       d="M12.4893 19.5227V3.76904L27.0311 14.6754L41.5729 3.76904V19.5227L27.0311 30.429"
        fill="" />
      <path class=""
        d="M0.371094 5.58702V10.4343L12.4893 19.5229V3.7693L9.09617 1.22448C5.49708 -1.47181 0.371094 1.09118 0.371094 5.58702Z"
        fill="" />
      </svg>
      <div class="absolute top-full left-0 w-full h-full rounded-full bg-red-500 z-0 transition-all duration-500 group-hover:top-0"></div>
      </button>
      
      
      </div>
                          
    <div className={`${className} flex flex-wrap mob:flex-nowrap link`}>
      
        <Button key={0} onClick={() => window.open("https://github.com/Elitelord")}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
        </Button>
        <Button key={1} onClick={() => window.open("https://www.linkedin.com/in/sameer-a-1157a2286/")}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="currentColor"
        style={{ color: "#0077b5" }}
        viewBox="0 0 24 24"
      >
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
      </svg>
        </Button>
        <Button key={2} onClick={() => window.open("https://www.instagram.com/sam.eer.agarwal/")} >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="currentColor"
        style={{ color: "#c13584" }}
        viewBox="0 0 24 24"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
        </Button>
        <Button key={3} onClick={() => window.open("")} >
        Blog
        </Button>
          <Button key={4} onClick={() => window.open("mailto:elitelord3007@gmail.com")}>
          <svg class="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"> 
             <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />  <polyline points="22,6 12,13 2,6" /></svg>
        </Button>
     
    </div>
    </>
  );
};

export default Socials;
