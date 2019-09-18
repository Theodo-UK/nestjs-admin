import { Widget, BaseWidget } from './widget.interface'

export default class BooleanWidget extends BaseWidget implements Widget {
  get template() {
    return this.column.isNullable ? 'widgets/boolean-nullable.njk' : 'widgets/boolean.njk'
  }
}
