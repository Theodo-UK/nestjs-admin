import { Widget, BaseWidget } from './widget.interface'

export default class DateWidget extends BaseWidget implements Widget {
  template = 'widgets/date.njk'
}
