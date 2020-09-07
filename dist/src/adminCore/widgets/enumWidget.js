"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class EnumWidget extends widget_interface_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.template = 'widgets/enum.njk';
    }
}
exports.default = EnumWidget;
//# sourceMappingURL=enumWidget.js.map