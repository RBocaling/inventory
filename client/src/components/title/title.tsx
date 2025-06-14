import React from 'react';

const Title = ({ title, description }: { title:string, description:string }) => {
  return (
    <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{ title}</h1>
      <p className="text-[#1f1e1e] text-lg">
       {description}
      </p>
    </div>
  );
};

export default Title;
