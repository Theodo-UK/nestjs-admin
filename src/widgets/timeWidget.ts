import { Widget, BaseWidget } from './widget.interface'

export default class TimeWidget extends BaseWidget implements Widget {
  template = 'widgets/time.njk'
}
