import React from 'react';

export const HindiOverlay = ({
  showText = true,
  titleLine1 = "दिल्ली से",
  titleLine2 = "लद्दाख"
}) => {
  if (!showText) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none px-4 pb-28 sm:pb-16">
      <div className="text-center transform -translate-y-2 sm:-translate-y-4 transition-all duration-500 max-w-full">
        <h1 className="devanagari-title text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-normal sm:tracking-wider leading-[0.95] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
          <span className="block text-white filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
            {titleLine1}
          </span>
          <span className="block text-white/95 mt-0.5 sm:mt-1 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
            {titleLine2}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default HindiOverlay;
