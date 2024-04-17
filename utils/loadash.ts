export function get(object: any, path: string | string[], defaultValue?: any): any {
  const pathArray = Array.isArray(path) ? path : path.split('.');

  let value: any = object;
  for (const key of pathArray) {
    if (value == null) return defaultValue;
    value = value[key];
  }

  return value !== undefined ? value : defaultValue;
}

export function groupBy<T>(array: T[], key: string | ((item: T) => string)): { [key: string]: T[] } {
  return array.reduce((acc, currentValue) => {
    const groupingKey = typeof key === 'function' ? key(currentValue) : currentValue[key as keyof T];
    if (!acc[groupingKey as string]) {
      acc[groupingKey as string] = [];
    }
    acc[groupingKey as string].push(currentValue);
    return acc;
  }, {} as { [key: string]: T[] });
}

export function find<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
  for (const item of array) {
    if (predicate(item)) {
      return item;
    }
  }
  return undefined;
}