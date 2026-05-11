import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import data from "../../data/portfolio.json";

const StarRating = ({ count, max = 5 }) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < count ? "text-amber-400" : "text-zinc-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const CodingProfiles = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { codingProfiles } = data;
  const { leetcode, hackerrank } = codingProfiles;

  useEffect(() => { setMounted(true); }, []);

  const cardTheme = mounted && resolvedTheme === "light" ? "light" : "dark";
  const leetcardUrl = `https://leetcard.jacoblin.cool/${leetcode.username}?theme=${cardTheme}&font=Inter&border=0&radius=16&ext=heatmap`;

  return (
    <div className="grid grid-cols-1 laptop:grid-cols-2 gap-6">
      {/* LeetCode Card */}
      <a
        href={leetcode.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black border border-gray-200 dark:border-zinc-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer block"
      >
        {/* Glow effect on hover */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <div className="p-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">LeetCode</h3>
            </div>
            <span className="text-xs font-medium text-gray-400 dark:text-zinc-500 group-hover:text-blue-500 dark:group-hover:text-fuchsia-400 transition-colors duration-300 flex items-center gap-1">
              View Profile
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          <div className="rounded-xl overflow-hidden">
            <img
              src={leetcardUrl}
              alt="LeetCode Stats"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </a>

      {/* HackerRank Card */}
      <a
        href={hackerrank.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black border border-gray-200 dark:border-zinc-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer block"
      >
        {/* Glow effect on hover */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <div className="relative z-10 p-5 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M454.843,141.001c-13.019-22.417-172.832-115-198.859-115c-26.019,0-185.895,92.351-198.84,115c-12.947,22.649-13.019,207.358,0,230.009c13.018,22.639,172.839,114.989,198.84,114.989c26,0,185.841-92.466,198.851-114.999C467.842,348.467,467.851,163.417,454.843,141.001z M309.862,398.15c-3.559,0-36.756-32.137-34.141-34.762c0.781-0.78,5.625-1.328,15.768-1.644c0-23.564,0.53-61.622,0.844-77.553c0.038-1.814-0.395-3.081-0.395-5.256h-71.812c0,6.379-0.412,32.523,1.232,65.479c0.205,4.078-1.42,5.353-5.158,5.335c-9.102-0.025-18.211-0.099-27.321-0.071c-3.683,0.009-5.274-1.374-5.157-5.488c0.826-30.043,2.66-75.488-0.134-191.07v-2.849c-8.688-0.314-14.717-0.862-15.508-1.652c-2.624-2.624,31.032-34.76,34.581-34.76c3.558,0,36.989,32.145,34.383,34.76c-0.782,0.781-7.098,1.338-15.067,1.652v2.84c-2.174,23.135-1.823,71.506-2.362,94.686h72.107c0-4.089,0.351-31.212-1.077-75.145c-0.091-3.047,0.853-4.646,3.781-4.672c9.945-0.072,19.9-0.117,29.855-0.055c3.108,0.019,4.105,1.546,4.043,4.834c-3.28,171.861-0.594,159.867-0.594,188.975c7.97,0.315,15.112,0.864,15.895,1.655C346.213,366.004,313.42,398.15,309.862,398.15L309.862,398.15z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">HackerRank</h3>
            </div>
            <span className="text-xs font-medium text-gray-400 dark:text-zinc-500 group-hover:text-blue-500 dark:group-hover:text-fuchsia-400 transition-colors duration-300 flex items-center gap-1">
              View Profile
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Star Ratings */}
          <div className="mb-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3">Skill Ratings</h4>
            <div className="space-y-2.5">
              {hackerrank.stars.map((item) => (
                <div key={item.domain} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.domain}</span>
                  <StarRating count={item.stars} />
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3">Certifications</h4>
            <div className="flex flex-wrap gap-2">
              {hackerrank.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default CodingProfiles;
