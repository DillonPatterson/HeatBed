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
        const [r, g, b, a] = heatColorAt(v);
        const pix = (row * cols + col) * 4;
        data[pix] = r;
        data[pix + 1] = g;
        data[pix + 2] = b;
        data[pix + 3] = Math.round(a * 255);
      }
    }

    oCtx.putImageData(imageData, 0, 0);

    // Soft blur pass
    const blurPx = Math.max(width, height) * 0.0115;
    ctx.save();
    ctx.filter = `blur(${blurPx.toFixed(1)}px)`;
    ctx.globalAlpha = 0.76;
    ctx.drawImage(offscreen, 0, 0, width, height);
    ctx.restore();

    // Second sharper pass
    ctx.save();
    ctx.filter = `blur(${(blurPx * 0.4).toFixed(1)}px)`;
    ctx.globalAlpha = 0.42;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(offscreen, 0, 0, width, height);
    ctx.restore();

    // Bloom for hottest cells
    ctx.save();
    ctx.filter = `blur(${(blurPx * 1.8).toFixed(1)}px)`;
    ctx.globalAlpha = 0.14;
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
        zIndex: 2,
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        mixBlendMode: 'normal',
      }}
    />
  );
};
