import React from "react";

function Button({
  text,
  onClick,
  className = "",
}: {
  text: string;
  onClick?: any;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-10 py-2 overflow-hidden text-white transition-all duration-700 ease-out transform border-2 border-[#286d7c] rounded-sm group group-hover:scale-105 group-hover:text-black ${className}`}
    >
      <span className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out transform translate-x-0 bg-[#286d7c] group-hover:-translate-x-full"></span>
      <span className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out transform translate-x-0 bg-[#286d7c] group-hover:translate-x-full"></span>
      <span className="relative z-10 transition-colors duration-500 ease-in-out group-hover:text-teal-900">
        {text}
      </span>
    </button>
  );
}

export default Button;
