export function getListDisplay(entity: object, listDisplay: string[]) {
  if (!listDisplay) {
    return []
  }
  return listDisplay.map(column => entity[column])
}
