import * as htmlToImage from 'html-to-image';

export const exportStageImage = async (node: HTMLElement) => {
  const dataUrl = await htmlToImage.toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: '#fff8ef',
  });

  const link = document.createElement('a');
  link.download = 'bed-heat-simulator.png';
  link.href = dataUrl;
  link.click();
};
