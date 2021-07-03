
export function intensToY(intensity: number, height: number, yOffset: number) {
  return Math.round(yOffset + ((1 - intensity)) * (height - yOffset));
}

export function yToIntens(y: number, height: number):number {
  return Number((1 - (y/height)).toFixed(2));
}