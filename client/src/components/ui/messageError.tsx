import { Info } from "lucide-react";

const MessageError = ({ message , className}:{message:string, className?:string}) => {
  return (
    <div className={`w-full p-4 flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-600/10 text-sm text-red-500 tracking-wider ${className}`}>
      <Info />
      {message}
    </div>
  );
};

export default MessageError;
