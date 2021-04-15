
const XOFFSET = 16;

const YOFFSET = 16;

export function timeToX(t: number, ppms: number, factor: number) {
  return Math.floor(XOFFSET + t * ppms * factor);
}

export function timeToWidth(t: number, ppms: number, factor: number) {
  return Math.floor(t * ppms * factor);
}

export function intensToY(intensity: number, height: number) {
  return Math.floor(YOFFSET + (100 - intensity) / 100 * (height -YOFFSET));
}

export function intensToH(intensity: number, height: number) {
  return Math.floor(intensity / 100 * (height-YOFFSET));
}

export function yToIntens(y: number, height: number) {
  return Math.floor(100 - ((y - YOFFSET) * 100 / (height-YOFFSET)));
}

export function xToTime(x: number, ppms: number, factor: number) {
  return Math.floor((x - XOFFSET) / ppms / factor);
}

export function wToTime(w: number, ppms: number, factor: number) {
  return Math.floor(w / ppms / factor);
}
