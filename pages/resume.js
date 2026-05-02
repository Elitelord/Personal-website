import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cursor from "../components/Cursor";
import Header from "../components/Header";
import Socials from "../components/Socials";
import Involvement from "../components/Involvement";
import BackgroundAccents from "../components/BackgroundAccents";
import data from "../data/portfolio.json";

const Resume = () => {
  const router = useRouter();
  const [mount, setMount] = useState(false);
  const { name, showResume, resume } = data;

  useEffect(() => {
    setMount(true);
    if (!showResume) {
      router.push("/");
    }
  }, [router, showResume]);

  return (
    <div className="relative min-h-screen z-0">
      {data.showCursor && <Cursor />}
      
      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <BackgroundAccents />

      <div
        className={`container mx-auto mb-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog />
        {mount && (
          <div className="mt-10 w-full flex flex-col items-center">
            <div className="w-full max-w-4xl p-5 laptop:p-0">
              <h1 className="text-4xl font-bold">{name}</h1>
              <h2 className="text-2xl mt-3 text-blue-600 dark:text-blue-400">{resume.tagline}</h2>
              <p className="w-full laptop:w-4/5 text-lg mt-5 opacity-70 leading-relaxed">
                {resume.description}
              </p>
              <div className="mt-6 mb-10">
                <Socials />
              </div>

              {/* Experience */}
              <div className="mt-10">
                <h1 className="text-3xl font-bold mb-6">Experience</h1>
                <div className="flex flex-col gap-6">
                  {resume.experiences.map((exp) => (
                    <Involvement
                      key={exp.id}
                      name={exp.org}
                      position={exp.position}
                      dates={exp.dates}
                      description={exp.bullets}
                    />
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mt-16">
                <h1 className="text-3xl font-bold mb-6">Education</h1>
                <div className="flex flex-col gap-6">
                  {(() => {
                    // Group education entries by university name to avoid duplicates
                    // from academic-year splits used for the timeline
                    const grouped = [];
                    const seen = new Map();
                    [...resume.education].reverse().forEach((edu) => {
                      if (seen.has(edu.universityName)) {
                        const existing = seen.get(edu.universityName);
                        // Combine date ranges
                        const dates = [existing._allDates, edu.universityDate].flat();
                        existing._allDates = dates;
                        // Build combined date string from earliest start to latest end
                        const starts = dates.map(d => d.split("-")[0].trim());
                        const ends = dates.map(d => d.split("-")[1]?.trim() || "Present");
                        existing.universityDate = `${starts[starts.length - 1]}-${ends[0]}`;
                      } else {
                        const entry = { ...edu, _allDates: [edu.universityDate] };
                        seen.set(edu.universityName, entry);
                        grouped.push(entry);
                      }
                    });
                    return grouped.map((edu, index) => (
                      <div 
                        key={index} 
                        className="cursor-pointer overflow-hidden rounded-lg p-5 laptop:p-6 transition-all duration-300 hover:scale-[1.02] backdrop-blur-md bg-gray-50/80 dark:bg-zinc-900/60 border border-gray-200/70 dark:border-zinc-800/50 shadow-sm hover:shadow-lg"
                      >
                        <div className="flex flex-col laptop:flex-row justify-between items-start mb-3">
                          <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                              {edu.universityName}
                            </h1>
                            <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">
                              {edu.universityPara}
                            </h2>
                          </div>
                          <div className="mt-2 laptop:mt-0">
                            <h2 className="text-sm font-medium opacity-60 bg-gray-200 dark:bg-zinc-800 px-3 py-1 rounded-full inline-block">
                              {edu.universityDate}
                            </h2>
                          </div>
                        </div>
                        <div className="text-base opacity-70 mt-4 flex items-center gap-2">
                          <span className="font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                            GPA: {edu.universityGPA}
                          </span>
                          <span>Unweighted</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Skills */}
              <div className="mt-16 mb-10">
                <h1 className="text-3xl font-bold mb-6">Skills</h1>
                <div className="flex flex-col gap-8">
                  {/* Languages */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Languages</h2>
                    <div className="flex flex-wrap gap-3">
                      {data.skills.filter(s => s.category === "Language").map((skill, index) => (
                        <span key={index} className="px-4 py-2 text-sm font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full hover:shadow-md transition-all">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Frameworks */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Frameworks</h2>
                    <div className="flex flex-wrap gap-3">
                      {data.skills.filter(s => s.category === "Framework").map((skill, index) => (
                        <span key={index} className="px-4 py-2 text-sm font-bold bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-full hover:shadow-md transition-all">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools / Others */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Tools</h2>
                    <div className="flex flex-wrap gap-3">
                      {data.skills.filter(s => s.category === "Tool" || (s.category !== "Language" && s.category !== "Framework")).map((skill, index) => (
                        <span key={index} className="px-4 py-2 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full hover:shadow-md transition-all">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
