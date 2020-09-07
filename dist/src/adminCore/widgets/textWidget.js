"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class TextWidget extends widget_interface_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.template = 'widgets/text.njk';
    }
}
exports.default = TextWidget;
//# sourceMappingURL=textWidget.js.map