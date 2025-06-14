import React from 'react';
import {ClimbingBoxLoader} from "react-spinners"
const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-start pt-32 bg-black/30 z- main overflow-hidden">
      <ClimbingBoxLoader
        color="#7C5650" size={20} speedMultiplier={1} />
      <p className="m2 text-neutral-400 font-light animate-custom-pulse text-lg">
        Loading..
      </p>
    </div>
  );
};

export default Loader;
