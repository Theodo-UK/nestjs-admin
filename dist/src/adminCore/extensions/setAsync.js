"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAsyncExtension = void 0;
class SetAsyncExtension {
    constructor() {
        this.tags = ['setAsync'];
        this.parse = function (parser, nodes, lexer) {
            let args;
            const tok = parser.nextToken();
            try {
                args = parser.parseSignature(null, false);
            }
            catch (e) {
                args = parser.parseSignature(null, true);
            }
            parser.advanceAfterBlockEnd(tok.value);
            return new nodes.CallExtensionAsync(this, 'run', args);
        };
        this.run = (context, variable, func, args, callback) => {
            args.push((err, data) => {
                context.ctx[variable] = data;
                callback(err, null);
            });
            func.apply(null, args);
        };
    }
}
exports.SetAsyncExtension = SetAsyncExtension;
//# sourceMappingURL=setAsync.js.map