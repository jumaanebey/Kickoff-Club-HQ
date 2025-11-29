import React from 'react';

export const FootballFieldBg = () => {
    return (
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-3xl">
            {/* Grass Base */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-700 to-green-600" />

            {/* Grass Texture/Pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 49px,
              #ffffff 49px,
              #ffffff 50px
            )`
                }}
            />

            {/* Yard Lines Container */}
            <div className="absolute inset-0 flex flex-col justify-between py-10">
                {/* End Zone Top */}
                <div className="h-24 bg-green-800/30 border-b-4 border-white/50 flex items-center justify-center">
                    <span className="text-6xl font-black text-white/20 tracking-[1em] rotate-180">KICKOFF</span>
                </div>

                {/* Mid Field Logo Area */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-white/30 rounded-full flex items-center justify-center">
                    <div className="w-40 h-40 bg-white/10 rounded-full backdrop-blur-sm" />
                </div>

                {/* 50 Yard Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/50" />

                {/* Hash Marks (Simplified) */}
                <div className="absolute inset-0 flex justify-center gap-40">
                    <div className="w-1 h-full border-l-2 border-dashed border-white/20" />
                    <div className="w-1 h-full border-r-2 border-dashed border-white/20" />
                </div>

                {/* End Zone Bottom */}
                <div className="h-24 bg-green-800/30 border-t-4 border-white/50 flex items-center justify-center">
                    <span className="text-6xl font-black text-white/20 tracking-[1em]">CLUB</span>
                </div>
            </div>
        </div>
    );
};
