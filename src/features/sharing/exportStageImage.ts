import * as htmlToImage from 'html-to-image';

export const exportStageImage = async (node: HTMLElement) => {
  const dataUrl = await htmlToImage.toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: '#0c0e14',
  });

  const link = document.createElement('a');
  link.download = 'bed-heat-scene.png';
  link.href = dataUrl;
  link.click();
};
