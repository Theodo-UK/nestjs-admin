"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class BooleanWidget extends widget_interface_1.BaseWidget {
    get template() {
        return this.column.isNullable ? 'widgets/boolean-nullable.njk' : 'widgets/boolean.njk';
    }
    isRequired() {
        return false;
    }
}
exports.default = BooleanWidget;
//# sourceMappingURL=booleanWidget.js.map