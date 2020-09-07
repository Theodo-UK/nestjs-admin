"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class ForeignKeyWidget extends widget_interface_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.template = 'widgets/foreign-key.njk';
    }
}
exports.default = ForeignKeyWidget;
//# sourceMappingURL=foreignKeyWidget.js.map