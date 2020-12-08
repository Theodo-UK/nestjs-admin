/* tslint:disable:ban-types */
export function isFunction(maybeFunction: unknown): maybeFunction is Function {
  return typeof maybeFunction === 'function';
}

export function isClass<ClassType = new () => unknown>(
  maybeClass: unknown,
): maybeClass is ClassType {
  return isFunction(maybeClass) && !!maybeClass.constructor;
}
