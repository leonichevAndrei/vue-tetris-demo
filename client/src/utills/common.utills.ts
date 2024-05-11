export function getMillisecondsByFPS(fps: number) {
  return Math.ceil(1000 / fps);
}

export function getRandomElementId(length: any, prevElementId: number) {
  let newElementId = getRandomFromX(length);
  // console.log('elms: ' + length + ' / rand: ' + newElementId);
  return newElementId != prevElementId ? newElementId : newElementId + 1;
}

export function getRandomFromX(count: number) {
  return Math.ceil(Math.random() * count);
}

export function getMiddlePosition(width: number) {
  return (Math.ceil(width/2));
}