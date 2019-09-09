export function isDevEnvironment() {
  return ['development', 'dev'].includes(process.env.NODE_ENV)
}
