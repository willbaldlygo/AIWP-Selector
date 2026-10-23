import React from 'react';
import { WHEEL_COLORS } from '../constants';

interface WheelProps {
  names: string[];
  rotation: number;
  spinMs: number;
  isSpinning: boolean;
  highlight: string | null;
  onSpin: () => void;
}

const R = 190;
const LABEL_OUTER = R - 16;
const LABEL_INNER = R * 0.3;
const MAX_FONT = 30;
const MIN_FONT = 10;
const FONT = `700 {size}px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`;

let ctx: CanvasRenderingContext2D | null = null;
const measure = (text: string, size: number) => {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return text.length * size * 0.6;
  ctx.font = FONT.replace('{size}', String(size));
  return ctx.measureText(text).width;
};

// Point on the rim, with 0° at the top and angles running clockwise.
const polar = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180;
  return [r * Math.sin(rad), -r * Math.cos(rad)];
};

// Pick a colour per slice so neighbours never match, including the
// wrap-around between the last slice and the first.
const sliceColor = (i: number, n: number) => {
  const len = WHEEL_COLORS.length;
  if (n > 1 && i === n - 1 && n % len === 1) return WHEEL_COLORS[2 % len];
  return WHEEL_COLORS[i % len];
};

// Labels run along the radius, so the space they get is the slice's
// thickness (for font size) and the radius itself (for length).
const fitLabel = (name: string, sliceDeg: number) => {
  const length = LABEL_OUTER - LABEL_INNER;
  const midR = (LABEL_OUTER + LABEL_INNER) / 2;
  const thickness = sliceDeg >= 180 ? R : 2 * midR * Math.sin((sliceDeg * Math.PI) / 360);
  let size = Math.min(MAX_FONT, thickness * 0.62);
  const width = measure(name, size);
  if (width > length) size = Math.max(MIN_FONT, (size * length) / width);

  let label = name;
  while (label.length > 1 && measure(label, size) > length) {
    label = label.slice(0, -1);
  }
  if (label !== name) label = `${label.slice(0, -1).trimEnd()}…`;
  return { label, size };
};

const Wheel: React.FC<WheelProps> = ({ names, rotation, spinMs, isSpinning, highlight, onSpin }) => {
  const n = names.length;

  if (n === 0) {
    return (
      <div className="wheel wheel--empty">
        <p>Nobody left on the wheel</p>
      </div>
    );
  }

  const slice = 360 / n;

  return (
    <div className="wheel">
      <svg className="wheel__pointer" viewBox="0 0 40 48" aria-hidden="true">
        <path d="M20 46 L38 6 Q20 0 2 6 Z" />
      </svg>

      <div
        className="wheel__disc"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionDuration: `${spinMs}ms`,
        }}
      >
        <svg viewBox={`${-R - 6} ${-R - 6} ${2 * R + 12} ${2 * R + 12}`} aria-hidden="true">
          <circle r={R + 4} className="wheel__rim" />
          {/* Dimmed slices fade towards white rather than muddy dark. */}
          <circle r={R} fill="#fff" />
          {names.map((name, i) => {
            const start = i * slice;
            const mid = start + slice / 2;
            const [x1, y1] = polar(start, R);
            const [x2, y2] = polar(start + slice, R);
            const path =
              n === 1
                ? `M 0 ${-R} A ${R} ${R} 0 1 1 0 ${R} A ${R} ${R} 0 1 1 0 ${-R} Z`
                : `M 0 0 L ${x1} ${y1} A ${R} ${R} 0 ${slice > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;

            // Slices that come to rest on the left half are flipped so their
            // text reads upright. `rotation` is already the final resting angle.
            const flip = (((mid + rotation) % 360) + 360) % 360 > 180;
            const { label, size } = fitLabel(name, slice);
            const dimmed = highlight !== null && name !== highlight;

            return (
              <g key={name} className={dimmed ? 'wheel__slice is-dimmed' : 'wheel__slice'}>
                <path d={path} fill={sliceColor(i, n)} />
                <text
                  transform={`rotate(${mid - 90 + (flip ? 180 : 0)})`}
                  x={flip ? -LABEL_OUTER : LABEL_OUTER}
                  y={0}
                  textAnchor={flip ? 'start' : 'end'}
                  dominantBaseline="central"
                  fontSize={size}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <button
        type="button"
        className="wheel__hub"
        onClick={onSpin}
        disabled={isSpinning}
        aria-label="Spin the wheel"
      >
        Spin
      </button>
    </div>
  );
};

export default Wheel;
