export default function Loader({
  size = 60,
  strokeWidth = 6,
  color = "#3B82F6", // Tailwind blue-500
}) {
  return (
    <div className="flex items-center justify-center min-h-[100px]">
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
      >
        <defs>
          {/* Gradient for spinning path */}
          <linearGradient id="gradientGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer soft shadow circle */}
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke={color}
          strokeWidth={strokeWidth}
          opacity="0.15"
          className="animate-pulse"
        />

        {/* Gradient spinner path with glow */}
        <path
          d="M45 25a20 20 0 00-20-20"
          stroke="url(#gradientGlow)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Center glowing dot */}
        <circle cx="25" cy="25" r="4" fill={color} className="animate-pulse" />
      </svg>
    </div>
  );
}
