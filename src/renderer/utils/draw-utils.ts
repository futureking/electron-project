//时间转x值
export function timeToX(t: number, ppms: number) {
  return Math.round(t * ppms);
}

export function timeToWidth(t: number, ppms: number) {
  return Math.round(t * ppms);
}

//强度转y值
export function intensToY(intensity: number, height: number, yOffset: number) {
  return Math.round(yOffset + ((100 - intensity) / 100) * (height - yOffset));
}

export function intensToH(intensity: number, height: number, yOffset: number) {
  return Math.round(intensity / 100 * (height - yOffset));
}

//y值转强度
export function yToIntens(y: number, height: number, yOffset: number) {
  return Math.round(100 - ((y - yOffset) * 100 / (height - yOffset)));
}

export function hToIntens(h: number, height: number, yOffset: number) {
  return Math.round(h * 100 / (height - yOffset));
}

//x值转时间
export function xToTime(x: number, ppms: number) {
  return Math.round(x / ppms);
}

export function wToTime(w: number, ppms: number) {
  return Math.round(w / ppms);
}
