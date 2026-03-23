import { useEffect, useRef } from 'react';
import type { BlanketProfile, HeatField } from '../../types';

interface HeatMapCanvasProps {
  heatField: HeatField;
  blanket: BlanketProfile;
}

// Richer dark-mode heat gradient: deep dark → electric blue → amber → orange → hot red/white
const heatStops = [
  { t: 0.00, r: 0,   g: 0,   b: 0,   a: 0 },
  { t: 0.12, r: 10,  g: 20,  b: 60,  a: 0.25 },
  { t: 0.28, r: 20,  g: 80,  b: 160, a: 0.55 },
  { t: 0.46, r: 60,  g: 140, b: 220, a: 0.75 },
  { t: 0.60, r: 220, g: 170, b: 40,  a: 0.88 },
  { t: 0.74, r: 255, g: 110, b: 20,  a: 0.94 },
  { t: 0.88, r: 255, g: 50,  b: 10,  a: 0.97 },
  { t: 1.00, r: 255, g: 240, b: 220, a: 1.0 },
];

function heatColor(t: number): [number, number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const upper = heatStops.findIndex((s) => s.t >= clamped);
  if (upper <= 0) return [heatStops[0].r, heatStops[0].g, heatStops[0].b, heatStops[0].a];
  const lo = heatStops[upper - 1];
  const hi = heatStops[upper];
  const f = (clamped - lo.t) / (hi.t - lo.t || 1);
  return [
    Math.round(lo.r + (hi.r - lo.r) * f),
    Math.round(lo.g + (hi.g - lo.g) * f),
    Math.round(lo.b + (hi.b - lo.b) * f),
    lo.a + (hi.a - lo.a) * f,
  ];
}

export const HeatMapCanvas = ({ heatField, blanket }: HeatMapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const { width, height } = parent.getBoundingClientRect();
    if (!width || !height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const cols = heatField.cols;
    const rows = heatField.rows;
    const maxV = heatField.maxValue || 1;

    // Create offscreen pixel buffer
    const offscreen = document.createElement('canvas');
    offscreen.width = cols;
    offscreen.height = rows;
    const oCtx = offscreen.getContext('2d');
    if (!oCtx) return;

    const imageData = oCtx.createImageData(cols, rows);
    const data = imageData.data;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        const v = heatField.field[idx] / maxV;
        const [r, g, b, a] = heatColor(v);
        const pix = (row * cols + col) * 4;
        data[pix] = r;
        data[pix + 1] = g;
        data[pix + 2] = b;
        data[pix + 3] = Math.round(a * 255);
      }
    }

    oCtx.putImageData(imageData, 0, 0);

    // Soft blur pass
    const blurPx = Math.max(width, height) * 0.018;
    ctx.save();
    ctx.filter = `blur(${blurPx.toFixed(1)}px)`;
    ctx.globalAlpha = 0.88;
    ctx.drawImage(offscreen, 0, 0, width, height);
    ctx.restore();

    // Second sharper pass
    ctx.save();
    ctx.filter = `blur(${(blurPx * 0.4).toFixed(1)}px)`;
    ctx.globalAlpha = 0.55;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(offscreen, 0, 0, width, height);
    ctx.restore();

    // Bloom for hottest cells
    ctx.save();
    ctx.filter = `blur(${(blurPx * 3).toFixed(1)}px)`;
    ctx.globalAlpha = 0.28;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(offscreen, 0, 0, width, height);
    ctx.restore();

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // Blanket tint overlay
    ctx.fillStyle = blanket.stageTint;
    ctx.fillRect(0, 0, width, height);
  }, [blanket, heatField]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        mixBlendMode: 'normal',
      }}
    />
  );
};
