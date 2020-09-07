"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class DateWidget extends widget_interface_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.template = 'widgets/date.njk';
    }
}
exports.default = DateWidget;
//# sourceMappingURL=dateWidget.js.map