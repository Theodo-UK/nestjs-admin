"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class TextareaWidget extends widget_interface_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.template = 'widgets/textarea.njk';
    }
}
exports.default = TextareaWidget;
//# sourceMappingURL=textareaWidget.js.map