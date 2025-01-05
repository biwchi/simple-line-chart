export const PI = Math.PI
export const PI2 = PI * 2

const EPSILON = 1e-4
export function isAroundZero(value: number) {
  return Math.abs(value) < EPSILON
}
