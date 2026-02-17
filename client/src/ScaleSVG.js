import React from 'react';

// Animated SVG for scales (static, but can be rotated)
export default function ScaleSVG({ angle = 0, children }) {
  return (
    <svg width="520" height="200" viewBox="0 0 520 200" style={{ display: 'block', margin: '0 auto' }}>
      {/* Base */}
      <rect x="250" y="170" width="20" height="30" fill="#888" />
      {/* Stand */}
      <rect x="258" y="80" width="4" height="90" fill="#aaa" />
      {/* Arm (rotates) */}
      <g transform={`rotate(${angle} 260 100)`}>
        <rect x="80" y="95" width="360" height="16" rx="8" fill="#c9a" />
        {/* Left bowl */}
        <ellipse cx="120" cy="140" rx="60" ry="22" fill="#eee" stroke="#888" strokeWidth="3" />
        {/* Right bowl */}
        <ellipse cx="400" cy="140" rx="60" ry="22" fill="#eee" stroke="#888" strokeWidth="3" />
        {/* Children for left and right bowls */}
        <g transform="translate(120,140)">{children && children[0]}</g>
        <g transform="translate(400,140)">{children && children[1]}</g>
      </g>
    </svg>
  );
}
