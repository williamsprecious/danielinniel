type SwipeInfo = {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
};

/** Left swipes advance; right swipes go back. Vertical gestures stay page scrolls. */
export function getSwipeDirection(
  { offset, velocity }: SwipeInfo,
  viewportWidth: number,
): -1 | 0 | 1 {
  const distance = Math.abs(offset.x);
  if (distance < 12 || distance <= Math.abs(offset.y)) return 0;

  const threshold = Math.min(100, Math.max(40, viewportWidth * 0.2));
  const isFlick =
    Math.abs(velocity.x) >= 500 &&
    Math.sign(velocity.x) === Math.sign(offset.x);

  if (distance < threshold && !isFlick) return 0;
  return offset.x < 0 ? 1 : -1;
}
