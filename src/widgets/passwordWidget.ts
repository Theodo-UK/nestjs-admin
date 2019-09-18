import { Widget, BaseWidget } from './widget.interface'

export default class PasswordWidget extends BaseWidget implements Widget {
  template = 'widgets/password.njk'
}
