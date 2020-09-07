"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class DatetimeWidget extends widget_interface_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.template = 'widgets/datetime.njk';
    }
}
exports.default = DatetimeWidget;
//# sourceMappingURL=datetimeWidget.js.map