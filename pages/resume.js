import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cursor from "../components/Cursor";
import Header from "../components/Header";
import Socials from "../components/Socials";
import Involvement from "../components/Involvement";
import { useHiddenPageRedirect } from "../utils/useHiddenPageRedirect";
import data from "../data/portfolio.json";

const SKILL_GROUPS = [
  { label: "Languages", match: (s) => s.category === "Language" },
  { label: "Frameworks", match: (s) => s.category === "Framework" },
  {
    label: "Tools",
    match: (s) => s.category !== "Language" && s.category !== "Framework",
  },
];

const Resume = () => {
  const router = useRouter();
  const [mount, setMount] = useState(false);
  const { name, showResume, resume } = data;
  const visible = useHiddenPageRedirect(showResume);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative min-h-screen z-0">
      {data.showCursor && <Cursor />}

      <div
        className={`container mx-auto mb-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header isBlog />
        {mount && (
          <div className="mt-10 w-full flex flex-col items-center">
            {/* Horizontal gutters come from the page container, so no padding here. */}
            <div className="w-full max-w-4xl">
              <h1 className="text-4xl font-semibold tracking-tight">{name}</h1>
              <h2 className="text-xl tablet:text-2xl mt-2 text-blue-600 dark:text-blue-400">{resume.tagline}</h2>
              <p className="w-full laptop:w-4/5 text-lg mt-5 opacity-70 leading-relaxed">
                {resume.description}
              </p>
              <div className="mt-6 mb-10">
                <Socials />
              </div>

              {/* Experience */}
              <div className="mt-10">
                <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-500 mb-2">
                  Experience
                </h2>
                <div className="border-t border-gray-200 dark:border-zinc-800">
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
                <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-500 mb-2">
                  Education
                </h2>
                <div className="border-t border-gray-200 dark:border-zinc-800">
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
                      <Involvement
                        key={index}
                        name={edu.universityName}
                        position={edu.universityPara}
                        dates={edu.universityDate}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                            GPA {edu.universityGPA}
                          </span>
                          <span className="text-sm opacity-60">Unweighted</span>
                        </div>
                      </Involvement>
                    ));
                  })()}
                </div>
              </div>

              {/* Skills — laid out as a spec sheet. The category label carries the
                  grouping, so the per-item color coding used elsewhere would be
                  redundant here. */}
              <div className="mt-16 mb-10">
                <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-500 mb-2">
                  Skills
                </h2>
                <dl className="border-t border-gray-200 dark:border-zinc-800">
                  {SKILL_GROUPS.map(({ label, match }) => {
                    const items = data.skills.filter(match);
                    if (!items.length) return null;
                    return (
                      <div
                        key={label}
                        className="grid grid-cols-1 tablet:grid-cols-[9rem_1fr] gap-x-8 gap-y-1 py-4 border-b border-gray-200 dark:border-zinc-800"
                      >
                        <dt className="font-mono text-xs uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-500 pt-0.5">
                          {label}
                        </dt>
                        <dd className="font-mono text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {items.map((s) => s.name).join(", ")}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
