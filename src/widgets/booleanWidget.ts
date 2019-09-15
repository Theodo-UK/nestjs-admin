import { Widget, BaseWidget } from './widget.interface'

export default class BooleanWidget extends BaseWidget implements Widget {
  get template() {
    return this.column.isNullable ? 'widget-boolean-nullable.njk' : 'widget-boolean.njk'
  }
}
