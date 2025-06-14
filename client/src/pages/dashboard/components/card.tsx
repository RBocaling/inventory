import React from 'react';

type props = {
    label: string;
    value: string | number;
    Icon: any;
    isMain?: boolean;
    key:number
}
const CardDashboard = ({Icon,isMain,label,value, key}: props) => {
  return (
    <div
      key={key}
      className={`rounded-xl ${
        isMain ? "bg-[#FDCAA2]" : "bg-[#C1A48C]"
      } p-7 flex items-center justify-between gap-7`}
    >
      <div className="flex flex-col gap-4">
        <p className="text-xl">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <img src={Icon} alt="" className='w-16 h-16 border rounded-full p-1' />
    </div>
  );
};

export default CardDashboard;
