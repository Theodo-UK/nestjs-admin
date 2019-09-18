import { Widget, BaseWidget } from './widget.interface'

export default class EnumWidget extends BaseWidget implements Widget {
  template = 'widgets/enum.njk'
}
