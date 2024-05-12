export function getMillisecondsByFPS(fps: number) {
  return Math.ceil(1000 / fps);
}

export function getRandomElementId(length: any, prevElementId: number) {
  let newElementId = getRandomFromX(length) - 1;
  return newElementId != prevElementId ? newElementId : (prevElementId != (length-1) ? newElementId+1 : 0);
}

export function getRandomFromX(count: number) {
  return Math.ceil(Math.random() * count);
}