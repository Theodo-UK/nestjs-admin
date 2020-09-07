"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widget_interface_1 = require("./widget.interface");
class TimeWidget extends widget_interface_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.template = 'widgets/time.njk';
    }
}
exports.default = TimeWidget;
//# sourceMappingURL=timeWidget.js.map