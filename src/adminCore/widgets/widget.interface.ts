import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import DefaultAdminSite from '../adminSite';

export interface WidgetConstructor {
  new (column: ColumnMetadata, adminSite: DefaultAdminSite, entity?: object);
}

export interface Widget {
  template: string;
}

export abstract class BaseWidget {
  constructor(
    public readonly column: ColumnMetadata,
    public readonly adminSite: DefaultAdminSite,
    public readonly entity?: object,
  ) {}

  abstract template: string;

  getLabel() {
    return this.column.propertyName;
  }

  isRequired() {
    return !this.column.isNullable;
  }

  getValue() {
    if (!this.entity) {
      return null;
    }
    return this.column.getEntityValue(this.entity);
  }
}
