import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import data from "../../data/portfolio.json";

const SkillsMarquee = () => {
    const { theme } = useTheme();

    // Initialize with default order to prevent hydration mismatch
    const [skills, setSkills] = useState([...data.skills, ...data.skills]);

    useEffect(() => {
        // Shuffle client-side only
        const shuffled = [...data.skills].sort(() => 0.5 - Math.random());
        setSkills([...shuffled, ...shuffled]);
    }, []);

    const getTextColors = (category) => {
        // Mineralist Text Only: bold distinct colors
        if (category === "Language") {
            return "text-blue-600 dark:text-blue-400";
        }
        if (category === "Framework") {
            return "text-violet-600 dark:text-violet-400";
        }
        if (category === "ML") {
            return "text-rose-600 dark:text-rose-400";
        }
        return "text-emerald-600 dark:text-emerald-400";
    }

    return (
        <div
            className="w-full relative overflow-hidden py-4"
            style={{
                maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
            }}
        >
            <div className="flex w-max animate-marquee gap-8">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className={`font-mono text-base font-medium whitespace-nowrap ${getTextColors(skill.category)}`}
                    >
                        {skill.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsMarquee;
