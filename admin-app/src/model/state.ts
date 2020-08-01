export type Fetched<T> = T | 'loading' | 'error' | 'forbidden';

export function isLoaded<T>(value: Fetched<T>): value is T {
  return typeof value !== 'string';
}
