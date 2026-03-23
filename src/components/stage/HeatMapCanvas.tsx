import { useEffect, useRef } from 'react';
import { heatColorAt } from '../../lib/colors';
import type { BlanketProfile, HeatField } from '../../types';

interface HeatMapCanvasProps {
  heatField: HeatField;
  blanket: BlanketProfile;
}

export const HeatMapCanvas = ({ heatField, blanket }: HeatMapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const { width, height } = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(74, 56, 41, 0.1)';
    ctx.fillRect(0, 0, width, height);

    const offscreen = document.createElement('canvas');
    offscreen.width = heatField.cols;
    offscreen.height = heatField.rows;
    const offscreenContext = offscreen.getContext('2d');
    if (!offscreenContext) return;

    for (let row = 0; row < heatField.rows; row += 1) {
      for (let col = 0; col < heatField.cols; col += 1) {
        const index = row * heatField.cols + col;
        const normalized = heatField.field[index] / (heatField.maxValue || 1);
        offscreenContext.fillStyle = heatColorAt(normalized);
        offscreenContext.fillRect(col, row, 1, 1);
      }
    }

    ctx.save();
    ctx.filter = `blur(${Math.max(width, height) * 0.012}px)`;
    ctx.globalAlpha = 0.92;
    ctx.drawImage(offscreen, 0, 0, width, height);
    ctx.restore();

    ctx.globalAlpha = 0.72;
    ctx.drawImage(offscreen, 0, 0, width, height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = blanket.stageTint;
    ctx.fillRect(0, 0, width, height);
  }, [blanket, heatField]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full rounded-[1.65rem]" />;
};
