import { Widget, BaseWidget } from './widget.interface'

export default class IntegerWidget extends BaseWidget implements Widget {
  template = 'widget-integer.njk'
}
