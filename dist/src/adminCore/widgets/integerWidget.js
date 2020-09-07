"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class IntegerWidget extends widget_interface_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.template = 'widgets/integer.njk';
    }
}
exports.default = IntegerWidget;
//# sourceMappingURL=integerWidget.js.map