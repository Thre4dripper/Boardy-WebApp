export function deepCopy<T>(source: T): T {
  // Check if the source is null or undefined
  if (source === null || source === undefined) {
    return source;
  }

  // Check if the source is a primitive type (string, number, boolean, etc.)
  if (typeof source !== 'object') {
    return source;
  }

  // Handle Date
  if (source instanceof Date) {
    return new Date(source.getTime()) as T;
  }

  // Handle Array
  if (Array.isArray(source)) {
    const arrayCopy = [] as T[];
    for (let i = 0; i < source.length; i++) {
      arrayCopy[i] = deepCopy(source[i]);
    }
    return arrayCopy as any;
  }

  // Handle Set
  if (source instanceof Set) {
    const setCopy = new Set<any>();
    source.forEach((item) => {
      setCopy.add(deepCopy(item));
    });
    return setCopy as any;
  }

  // Handle Map
  if (source instanceof Map) {
    const mapCopy = new Map<any, any>();
    source.forEach((value, key) => {
      mapCopy.set(deepCopy(key), deepCopy(value));
    });
    return mapCopy as any;
  }

  // Handle HTML Elements
  if (source instanceof HTMLElement) {
    return source.cloneNode(true) as T;
  }

  // Handle Object and Class instances
  const objectCopy = Object.create(Object.getPrototypeOf(source));
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      objectCopy[key] = deepCopy((source as T)[key]);
    }
  }
  return objectCopy;
}