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
const LABEL_FONT_WEIGHT = 700;
const BASE_FONT_PX = 26;
const RADIAL_PADDING = 8;
const MIN_FONT_PX = 11;
const MAX_FONT_FACTOR = 1.2;

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
  angleDeg: number,
  labelRadius: number,
  outerRadius: number
) => {
  const angleRad = angleDeg * (Math.PI / 180);
  const radialSpace = Math.max(0, (outerRadius - labelRadius) - RADIAL_PADDING);
  const maxByRadial = Math.max(MIN_FONT_PX, radialSpace);

  const arc = labelRadius * angleRad;
  const arcUsable = Math.max(0, arc * 0.9);
  const measuredAtBase = Math.max(1, measureTextWidth(label, BASE_FONT_PX));
  const maxByArc = BASE_FONT_PX * (arcUsable / measuredAtBase);

  const raw = Math.min(maxByRadial, maxByArc);
  const capped = Math.min(raw, BASE_FONT_PX * MAX_FONT_FACTOR);
  return Math.max(MIN_FONT_PX, capped);
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
    
    const textAngle = startAngle + anglePerSegment / 2;
    const textX = textRadius * Math.cos(textAngle * (Math.PI / 180));
    const textY = textRadius * Math.sin(textAngle * (Math.PI / 180));
    const fontPx = computeLabelFontPx(name, anglePerSegment, textRadius, radius);
    const needsEllipsis = name.length > 20 && fontPx <= MIN_FONT_PX + 0.5;
    const displayName = needsEllipsis ? `${name.slice(0, 18)}…` : name;
    
    return (
      <g key={index}>
        <path d={pathData} fill={colors[index % colors.length]} />
        <g transform={`translate(${textX}, ${textY}) rotate(${textAngle})`}>
           <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#000"
            className="font-bold select-none"
            style={{
              fill: 'white',
              stroke: 'rgba(0,0,0,0.28)',
              strokeWidth: '1.5px',
              paintOrder: 'stroke',
              fontSize: `${fontPx}px`,
              letterSpacing: '0.02em'
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
      <div className="absolute top-[-10px] z-10">
        <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 40L29.7224 10H0.277568L15 40Z" fill="#1e293b"/>
        </svg>
      </div>
      <div
        className="w-full h-full rounded-full shadow-2xl transition-transform duration-[4000ms] ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
        onTransitionEnd={onSpinEnd}
      >
        <svg viewBox="-180 -180 360 360" transform="rotate(-90)" className="w-full h-full">
          {segments}
        </svg>
      </div>
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
        className="absolute flex items-center justify-center w-12 h-12 bg-white rounded-full border-4 border-slate-800 shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-600 disabled:cursor-not-allowed"
        style={{ cursor: canSpin ? 'pointer' : 'not-allowed' }}
      >
        <span className="sr-only">Spin the wheel</span>
      </button>
    </div>
  );
};

export default Wheel;
