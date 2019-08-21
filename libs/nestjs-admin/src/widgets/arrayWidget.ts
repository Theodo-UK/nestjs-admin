import { Widget, BaseWidget } from './widget.interface'

export default class ArrayWidget extends BaseWidget implements Widget {
  template = 'widget-simple-array.njk'
}
