import { v4 } from "uuid"

export function timeAtMin(t: number) {
  return Math.floor(t / 60000)
}

export function timeAtSec(t: number) {
  return Math.floor((t % 60000) / 1000 )
}

export function timeAtMSec(t: number) {
  return (t % 1000)
}

export function randomUuid() {
  return v4();
}

