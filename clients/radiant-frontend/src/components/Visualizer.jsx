import React from "react";

export default function Visualizer({ volume }) {
  const size = 100 + volume * 200;

  return (
    <div className="w-full h-32 flex items-center justify-center relative">
      <div
        className="absolute rounded-full bg-blue-500 opacity-30 transition-all duration-300 ease-out"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
        }}
      />
      <div className="z-10 text-sm text-white">🎙️ Listening...</div>
    </div>
  );
}
