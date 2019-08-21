import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'
import { DefaultAdminSite } from '..'

export interface Widget {
  template: string
}

export class BaseWidget {
  constructor(
    public readonly column: ColumnMetadata,
    public readonly adminSite: DefaultAdminSite,
    public readonly entity?: object,
  ) {}

  getValue() {
    if (!this.entity) {
      return null
    }
    return this.column.getEntityValue(this.entity)
  }
}
