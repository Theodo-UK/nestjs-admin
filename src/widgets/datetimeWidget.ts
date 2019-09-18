import { Widget, BaseWidget } from './widget.interface'

export default class DatetimeWidget extends BaseWidget implements Widget {
  template = 'widgets/datetime.njk'
}
