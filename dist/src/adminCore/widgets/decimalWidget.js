"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class DecimalWidget extends widget_interface_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.template = 'widgets/decimal.njk';
    }
}
exports.default = DecimalWidget;
//# sourceMappingURL=decimalWidget.js.map