import React from 'react';

interface WheelProps {
  participants: string[];
  colors: string[];
  rotation: number;
  onSpinEnd: () => void;
  isSpinning: boolean;
  onSpin: () => void;
}

const LABEL_FONT_FAMILY = `'Inter', system-ui, -apple-system, sans-serif`;
const LABEL_FONT_WEIGHT = 600;
const BASE_FONT_PX = 18;
const RADIAL_PADDING = 12;
const MIN_FONT_PX = 12;
const MAX_FONT_PX = 22;

let measureCanvas: HTMLCanvasElement | null = null;
let measureContext: CanvasRenderingContext2D | null = null;

const getMeasureContext = () => {
  if (typeof document === 'undefined') {
    return null;
  }
  if (!measureCanvas) {
    measureCanvas = document.createElement('canvas');
  }
  if (!measureContext) {
    measureContext = measureCanvas.getContext('2d');
  }
  return measureContext;
};

const measureTextWidth = (label: string, fontPx: number) => {
  const ctx = getMeasureContext();
  if (!ctx) {
    return label.length * fontPx * 0.6;
  }
  ctx.font = `${LABEL_FONT_WEIGHT} ${fontPx}px ${LABEL_FONT_FAMILY}`;
  return ctx.measureText(label).width;
};

const computeLabelFontPx = (
  label: string,
  numSegments: number
) => {
  // Adaptive font sizing based on segment count and label length
  let baseFontSize = BASE_FONT_PX;

  // Reduce font size for more segments
  if (numSegments > 12) baseFontSize = 14;
  else if (numSegments > 8) baseFontSize = 16;

  // Further reduce for long labels
  const labelLength = label.length;
  if (labelLength > 15) baseFontSize = Math.max(MIN_FONT_PX, baseFontSize - 2);
  else if (labelLength > 10) baseFontSize = Math.max(MIN_FONT_PX, baseFontSize - 1);

  return Math.min(MAX_FONT_PX, Math.max(MIN_FONT_PX, baseFontSize));
};

const Wheel: React.FC<WheelProps> = ({ participants, colors, rotation, onSpinEnd, isSpinning, onSpin }) => {
  const numSegments = participants.length;
  const anglePerSegment = 360 / numSegments;
  const radius = 180;
  const textRadius = radius * 0.7;

  const getCoordinatesForPercent = (percent: number) => {
    const x = radius * Math.cos(2 * Math.PI * percent);
    const y = radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  if (numSegments === 0) {
    return (
      <div className="wheel-shell relative flex items-center justify-center">
        <div className="absolute w-full h-full border-4 border-dashed border-slate-300 rounded-full"></div>
        <p className="text-slate-500">Add names to see the wheel</p>
      </div>
    );
  }

  const segments = participants.map((name, index) => {
    const startAngle = anglePerSegment * index;
    const endAngle = startAngle + anglePerSegment;
    const startPercent = startAngle / 360;
    const endPercent = endAngle / 360;

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

    const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0 Z`;

    // Position text in the middle of the segment
    const textAngle = startAngle + anglePerSegment / 2;
    const textX = textRadius * Math.cos(textAngle * (Math.PI / 180));
    const textY = textRadius * Math.sin(textAngle * (Math.PI / 180));

    const fontPx = computeLabelFontPx(name, numSegments);
    const needsEllipsis = name.length > 18;
    const displayName = needsEllipsis ? `${name.slice(0, 16)}…` : name;

    return (
      <g key={index}>
        <path d={pathData} fill={colors[index % colors.length]} />
        {/* Segment divider line */}
        <line
          x1="0"
          y1="0"
          x2={startX}
          y2={startY}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
        />
        {/* Horizontal text - always readable */}
        <g transform={`translate(${textX}, ${textY})`}>
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-semibold select-none"
            style={{
              fill: '#1e293b',
              stroke: 'white',
              strokeWidth: '3px',
              paintOrder: 'stroke',
              fontSize: `${fontPx}px`,
              fontWeight: LABEL_FONT_WEIGHT,
              fontFamily: LABEL_FONT_FAMILY,
              letterSpacing: '0.01em'
            }}
          >
            {displayName}
          </text>
        </g>
      </g>
    );
  });
  
  const canSpin = !isSpinning && participants.length > 0;

  return (
    <div className="wheel-shell relative flex items-center justify-center">
      {/* Pointer/Arrow */}
      <div className="absolute top-[-12px] z-10 drop-shadow-lg">
        <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 48L35 12H1L18 48Z" fill="#dc2626"/>
          <path d="M18 48L35 12H1L18 48Z" stroke="#991b1b" strokeWidth="2"/>
        </svg>
      </div>

      {/* Wheel */}
      <div
        className="w-full h-full rounded-full transition-transform duration-[4000ms] ease-out relative"
        style={{
          transform: `rotate(${rotation}deg)`,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 0 0 8px white, 0 0 0 10px #e2e8f0',
        }}
        onTransitionEnd={onSpinEnd}
      >
        <svg viewBox="-180 -180 360 360" transform="rotate(-90)" className="w-full h-full">
          {segments}
        </svg>
      </div>

      {/* Center button */}
      <button
        type="button"
        onClick={canSpin ? onSpin : undefined}
        onKeyDown={(event) => {
          if (!canSpin) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSpin();
          }
        }}
        disabled={!canSpin}
        aria-label={canSpin ? 'Spin the wheel' : 'Cannot spin the wheel'}
        className="absolute flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full border-4 border-white shadow-xl hover:from-slate-600 hover:to-slate-800 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ cursor: canSpin ? 'pointer' : 'not-allowed' }}
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
        </svg>
        <span className="sr-only">Spin the wheel</span>
      </button>
    </div>
  );
};

export default Wheel;
