export default class Utilities {
  static pickFromObjectProperties<T extends object>(
    obj: T,
    properties: (keyof T)[],
  ) {
    return Object.fromEntries(
      properties.filter((key) => key in obj).map((key) => [key, obj[key]]),
    );
  }

  static omitFromObjectProperties<T extends object>(
    obj: T,
    properties: (keyof T)[],
  ): {
    [k: string]: T[keyof T];
  } {
    return Object.fromEntries(
      Object.keys(obj)
        .filter((key) => !properties.includes(key as keyof T))
        .map((key) => [key, obj[key as keyof T]]),
    );
  }
}
