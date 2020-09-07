"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class ArrayWidget extends widget_interface_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.template = 'widgets/simple-array.njk';
    }
}
exports.default = ArrayWidget;
//# sourceMappingURL=arrayWidget.js.map