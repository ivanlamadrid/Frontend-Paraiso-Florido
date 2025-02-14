export function makePlainObject<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
  