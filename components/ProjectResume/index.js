import React from "react";

const ProjectResume = ({ dates, org, position, bullets }) => {
  // const [bulletsLocal, setBulletsLocal] = React.useState(bullets.split(","));
  const bulletsLocal = bullets;
  return (
    <div className="mt-5 w-full flex mob:flex-col desktop:flex-row justify-between">
      <div className="text-lg font-bold">
        <h2>{org}</h2>
      </div>
      <div className="text-md w-2/5">
        <h2>{dates}</h2>
      </div>
      <div className="w-3/5">
        <h2 className="text-lg font-bold">{position}</h2>
        {bulletsLocal && bulletsLocal.length > 0 && (
          <ul className="list-disc">
            {bulletsLocal.map((bullet, index) => (
              <li key={index} className="text-sm my-1 opacity-70">
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectResume;
