import React from "react";

// This is the reusable loading component
export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Inline SVG for loading animation */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="64" // Adjust the size as needed
        height="64"
        style={{ shapeRendering: "auto", display: "block" }}
      >
        <g>
          <circle
            strokeLinecap="round"
            fill="none"
            strokeDasharray="50.26548245743669 50.26548245743669"
            stroke="#1e4abc" // Adjust the color if needed
            strokeWidth="8"
            r="32"
            cy="50"
            cx="50"
          >
            <animateTransform
              values="0 50 50;360 50 50"
              keyTimes="0;1"
              dur="1s"
              repeatCount="indefinite"
              type="rotate"
              attributeName="transform"
            />
          </circle>
        </g>
      </svg>
      <p className="text-lg text-gray-500 mt-4">{message}</p>
    </div>
  );
}
