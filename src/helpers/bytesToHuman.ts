function bytesToHuman(size: number, suffixIndex: number = 0) {
  const SIZE_SUFFIX = ['B', 'kB', 'mB', 'gB'] as const;
  if (size < 1024) {
    return `${Number(size.toFixed(2))}${SIZE_SUFFIX[suffixIndex]}`;
  }
  return bytesToHuman(size / 1024, suffixIndex + 1);
}

export { bytesToHuman };
