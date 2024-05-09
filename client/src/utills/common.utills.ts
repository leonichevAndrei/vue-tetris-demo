export function getMillisecondsByFPS(fps: number) {
  return Math.ceil(1000 / fps);
}