import { Check, Copy } from "lucide-react";
import React, { useState, useEffect } from "react";

interface CopyComponentProps {
    text: string;
    className?: string
}

const CopyButton: React.FC<CopyComponentProps> = ({ text, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
    });
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <button
      onClick={handleCopy}
          className={`relative  transition cursor-pointer ${className}`}
      aria-label="Copy text"
    >
      {copied ? (
        <Check className="text-primary" />
      ) : (
        <Copy className="text-primary" />
      )}
    </button>
  );
};

export default CopyButton;
