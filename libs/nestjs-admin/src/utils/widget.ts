import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata'
import AdminSite from '../adminSite'
import { isClass } from './typechecks'
import {
  SimpleColumnType,
  PrimaryGeneratedColumnType,
  WithPrecisionColumnType,
} from 'typeorm/driver/types/ColumnTypes'

export function getWidgetTemplate(column: ColumnMetadata) {
  if (!!column.relationMetadata) {
    // the column is a foreign key
    return 'widget-foreign-key.njk'
  }

  /* tslint:disable:ban-types */
  // The restrict type is just to type-check that we're not making a typo
  type Restrict<T, U extends T> = U
  type ImplementedTypes =
    | Restrict<
        SimpleColumnType | PrimaryGeneratedColumnType | WithPrecisionColumnType,
        | 'int'
        | 'int2'
        | 'int4'
        | 'int8'
        | 'integer'
        | 'tinyint'
        | 'smallint'
        | 'mediumint'
        | 'bigint'
        | 'dec'
        | 'decimal'
        | 'fixed'
        | 'numeric'
        | 'number'
        | 'float'
        | 'double'
        | 'dec'
        | 'decimal'
        | 'fixed'
        | 'numeric'
        | 'real'
        | 'double precision'
        | 'number'
        | 'uuid'
        | 'simple-array'
        | 'int64'
        | 'unsigned big int'
        | 'tinytext'
        | 'mediumtext'
        | 'text'
        | 'ntext'
        | 'citext'
        | 'longtext'
        | 'long'
        | 'date'
        | 'boolean'
        | 'bool'
        // | 'datetime'
        // | 'datetime2'
        // | 'datetimeoffset'
        | 'time'
        // | 'time with time zone'
        | 'time without time zone'
        | 'timestamp'
        | 'timestamp without time zone'
        // | 'timestamp with time zone'
        // | 'timestamp with local time zone'
        // | 'simple-json'
        // | 'simple-enum'
        // | 'bit'
        // | 'float4'
        // | 'float8'
        // | 'smallmoney'
        // | 'money'
        // | 'tinyblob'
        // | 'mediumblob'
        // | 'blob'
        // | 'hstore'
        // | 'longblob'
        // | 'bytes'
        // | 'bytea'
        // | 'raw'
        // | 'long raw'
        // | 'bfile'
        // | 'clob'
        // | 'nclob'
        // | 'image'
        // | 'timetz'
        // | 'timestamptz'
        // | 'timestamp with local time zone'
        // | 'smalldatetime'
        // | 'interval year to month'
        // | 'interval day to second'
        // | 'interval'
        // | 'year'
        // | 'point'
        // | 'line'
        // | 'lseg'
        // | 'box'
        // | 'circle'
        // | 'path'
        // | 'polygon'
        // | 'geography'
        // | 'geometry'
        // | 'linestring'
        // | 'multipoint'
        // | 'multilinestring'
        // | 'multipolygon'
        // | 'geometrycollection'
        // | 'int4range'
        // | 'int8range'
        // | 'numrange'
        // | 'tsrange'
        // | 'tstzrange'
        // | 'daterange'
        // | 'enum'
        // | 'cidr'
        // | 'inet'
        // | 'macaddr'
        // | 'bit'
        // | 'bit varying'
        // | 'varbit'
        // | 'tsvector'
        // | 'tsquery'
        // | 'uuid'
        // | 'xml'
        // | 'json'
        // | 'jsonb'
        // | 'varbinary'
        // | 'hierarchyid'
        // | 'sql_variant'
        // | 'rowid'
        // | 'urowid'
        // | 'uniqueidentifier'
        // | 'rowversion'
        // | 'array'
      >
    | 'simple_array'

  const type: ImplementedTypes = column.type as any

  switch (type) {
    case 'text':
    case 'mediumtext':
    case 'longtext':
    case 'ntext':
    case 'citext':
      return 'widget-textarea.njk'
    // @ts-ignore
    case String:
    case 'tinytext':
    case 'uuid':
      return 'widget-text.njk'
    case 'simple-array':
    case 'simple_array':
      return 'widget-simple-array.njk'
    // @ts-ignore
    case Number:
    case 'number':
    case 'integer':
    case 'tinyint':
    case 'smallint':
    case 'mediumint':
    case 'bigint':
    case 'int':
    case 'int2':
    case 'int4':
    case 'int8':
    case 'int64':
    case 'unsigned big int':
    case 'long':
      return 'widget-integer.njk'
    case 'numeric':
    case 'float':
    case 'dec':
    case 'decimal':
    case 'real':
    case 'double':
    case 'double precision':
    case 'fixed':
      return 'widget-decimal.njk'
    case 'date':
      return 'widget-date.njk'
    // @ts-ignore
    case Date:
    case 'timestamp':
    case 'timestamp without time zone':
      return 'widget-datetime.njk'
    case 'boolean':
    case 'bool':
      return column.isNullable ? 'widget-boolean-nullable.njk' : 'widget-boolean.njk'
    case 'time':
    case 'time without time zone':
      return 'widget-time.njk'
    default:
      const guard: never = type
      return 'widget-text.njk'
  }
  /* tslint:enable:ban-types */
}

export async function getRelationOptions(
  adminSite: AdminSite,
  relation: RelationMetadata,
  cb: any,
) {
  if (!isClass(relation.type)) {
    throw new Error(`${relation.type} is not an entity, it cannot be used as relation`)
  }
  const repository = adminSite.getRepository(relation.type)
  const options = await repository.find()
  cb(null, options)
}
