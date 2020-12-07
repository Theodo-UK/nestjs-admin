/**
 * In your template, call the extension as follow:
 * {% setAsync 'variable', functionName, [functionArguments] %}
 * `variable` is the name of the variable that will hold the results of functionName
 * with [functionArguments].
 * If the function functionName does not take any arguments, you need to still pass
 * an empty array {% setAsync 'variable', functionName, [] %}.
 */
export class SetAsyncExtension {
  tags = ['setAsync'];

  parse = function (parser: any, nodes: any, lexer: any) {
    let args;
    const tok = parser.nextToken();

    try {
      args = parser.parseSignature(null, false);
    } catch (e) {
      args = parser.parseSignature(null, true);
    }

    parser.advanceAfterBlockEnd(tok.value);

    return new nodes.CallExtensionAsync(this, 'run', args);
  };

  run = (context: any, variable: any, func: any, args: any, callback: any) => {
    args.push((err: any, data: any) => {
      context.ctx[variable] = data;

      callback(err, null);
    });

    func.apply(null, args);
  };
}
