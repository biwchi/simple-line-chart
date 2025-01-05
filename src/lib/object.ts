export type KeyOfDistributive<T> = T extends unknown ? keyof T : never

export interface Dictionary<T = any> {
  [key: string]: T
}

export function extend<T extends Dictionary<any>, S extends Dictionary<any>>(
  target: T,
  source: S,
): T & S {
  if (Object.assign) {
    Object.assign(target, source)
  }

  return target as T & S
}

export function keys<T extends object>(
  obj: T,
): (KeyOfDistributive<T> & string)[] {
  if (!obj) {
    return []
  }
  // Return type should be `keyof T` but exclude `number`, becuase
  // `Object.keys` only return string rather than `number | string`.
  type TKeys = KeyOfDistributive<T> & string
  if (Object.keys) {
    return Object.keys(obj) as TKeys[]
  }
  const keyList: TKeys[] = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      keyList.push(key as any)
    }
  }
  return keyList
}
