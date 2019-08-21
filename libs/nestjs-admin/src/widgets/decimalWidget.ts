import { Widget, BaseWidget } from './widget.interface'

export default class DecimalWidget extends BaseWidget implements Widget {
  template = 'widget-decimal.njk'
}
