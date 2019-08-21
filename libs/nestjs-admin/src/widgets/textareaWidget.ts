import { Widget, BaseWidget } from './widget.interface'

export default class TextareaWidget extends BaseWidget implements Widget {
  template = 'widget-textarea.njk'
}
