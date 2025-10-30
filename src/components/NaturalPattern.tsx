import React from 'react';

export function NaturalPattern() {
  return (
    <div className="absolute inset-0 opacity-5 pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="leaf-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Leaf 1 */}
            <path
              d="M 25 50 Q 30 40, 35 50 Q 30 60, 25 50 Z"
              fill="#A8CBB7"
              opacity="0.3"
            />
            {/* Leaf 2 */}
            <path
              d="M 70 20 Q 75 15, 80 20 Q 75 25, 70 20 Z"
              fill="#E5C17A"
              opacity="0.3"
            />
            {/* Flower */}
            <circle cx="50" cy="80" r="3" fill="#F7E6C3" opacity="0.4" />
            <circle cx="53" cy="77" r="2" fill="#F7E6C3" opacity="0.4" />
            <circle cx="47" cy="77" r="2" fill="#F7E6C3" opacity="0.4" />
            <circle cx="53" cy="83" r="2" fill="#F7E6C3" opacity="0.4" />
            <circle cx="47" cy="83" r="2" fill="#F7E6C3" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
      </svg>
    </div>
  );
}
