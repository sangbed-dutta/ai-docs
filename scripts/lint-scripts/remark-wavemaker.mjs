import { visit } from 'unist-util-visit';

export default function remarkWaveMaker() {
  const BRAND = 'WaveMaker';
  const regex = /\bwavemaker\b/gi;

  return (tree) => {
    visit(tree, 'text', (node) => {
      if (node.value) {
        node.value = node.value.replace(regex, BRAND);
      }
    });
  };
}
