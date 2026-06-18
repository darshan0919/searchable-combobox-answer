export function getFocusedIndex(currentIndex, itemCount, direction) {
  if (itemCount === 0) {
    return 0;
  }

  if (direction === "down") {
    return (currentIndex + 1) % itemCount;
  }

  return (currentIndex - 1 + itemCount) % itemCount;
}
