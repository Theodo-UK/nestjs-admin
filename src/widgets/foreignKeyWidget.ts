import { Widget, BaseWidget } from './widget.interface'

export default class ForeignKeyWidget extends BaseWidget implements Widget {
  template = 'widgets/foreign-key.njk'
}
