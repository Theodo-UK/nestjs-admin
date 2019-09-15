import { Widget, BaseWidget } from './widget.interface'

export default class TextWidget extends BaseWidget implements Widget {
  template = 'widget-text.njk'
}
