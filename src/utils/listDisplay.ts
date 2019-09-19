export function getListDisplay(entity: any, listDisplay: string[]) {
  if (!listDisplay) {
    return []
  }
  return listDisplay.map(column => entity[column])
}
