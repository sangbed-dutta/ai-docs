export default function remarkFinalNewline() {
  return (tree, file) => {
    const contents = String(file.value ?? file);
    if (contents.length === 0) {
      return;
    }
    const normalized = contents.replace(/\r?\n*$/, '\n');
    if (normalized !== contents) {
      file.value = normalized;
    }
  };
}
