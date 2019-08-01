/* tslint:disable:ban-types */
export function isFunction(maybeFunction: unknown): maybeFunction is Function {
  return typeof maybeFunction === 'function'
}
