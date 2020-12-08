import { ColumnType } from 'typeorm';

export type IntegerColumnType =
  | NumberConstructor
  | 'number'
  | 'integer'
  | 'tinyint'
  | 'smallint'
  | 'mediumint'
  | 'bigint'
  | 'int'
  | 'int2'
  | 'int4'
  | 'int8'
  | 'int64'
  | 'unsigned big int'
  | 'long';

export type DecimalColumnType =
  | 'numeric'
  | 'float'
  | 'dec'
  | 'decimal'
  | 'real'
  | 'double'
  | 'double precision'
  | 'fixed';

export type NumberColumnType = IntegerColumnType | DecimalColumnType;

export type DateType =
  | 'date'
  | 'datetime'
  | 'datetime2'
  | 'datetimeoffset'
  | 'time'
  | 'time with time zone'
  | 'time without time zone'
  | 'timestamp'
  | 'timestamp without time zone'
  | 'timestamp with time zone'
  | 'timestamp with local time zone';

export type BooleanType = 'boolean' | 'bool';
export type EnumType = 'enum';

export function isIntegerType(type: ColumnType): type is IntegerColumnType {
  return [
    Number,
    'number',
    'integer',
    'tinyint',
    'smallint',
    'mediumint',
    'bigint',
    'int',
    'int2',
    'int4',
    'int8',
    'int64',
    'unsigned big int',
    'long',
    // @ts-ignore
  ].includes(type);
}

export function isDecimalType(type: ColumnType): type is DecimalColumnType {
  return [
    'numeric',
    'float',
    'dec',
    'decimal',
    'real',
    'double',
    'double precision',
    'fixed',
    // @ts-ignore
  ].includes(type);
}

export function isNumberType(type: ColumnType): type is NumberColumnType {
  return isDecimalType(type) || isIntegerType(type);
}

export function isDateType(type: ColumnType): type is DateType {
  return [
    Date,
    'date',
    'datetime',
    'datetime2',
    'datetimeoffset',
    'time',
    'time with time zone',
    'time without time zone',
    'timestamp',
    'timestamp without time zone',
    'timestamp with time zone',
    'timestamp with local time zone',
    // @ts-ignore
  ].includes(type);
}

export function isBooleanType(type: ColumnType): type is BooleanType {
  return [
    Boolean,
    'boolean',
    'bool',
    // @ts-ignore
  ].includes(type);
}

export function isEnumType(type: ColumnType): type is EnumType {
  return [
    'enum',
    'simple-enum',
    // @ts-ignore
  ].includes(type);
}
