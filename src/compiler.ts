import * as ts from 'typescript';
const debug = false;

class Compiler {
  private text: string;
  public tokenList = [];

  constructor() {
    (<any>ts).onNextToken = this.pushTokenIfNeeded.bind(this);
  }

  createCompilerHost(fileName, fileContent): ts.CompilerHost {
    return {
      fileExists: () => true,
      getCanonicalFileName: (filename: string) => filename,
      getCurrentDirectory: () => '',
      getDefaultLibFileName: () => '../node_modules/typescript/lib/lib.d.ts',
      getDirectories: (_path: string) => [],
      getNewLine: () => '\n',
      getSourceFile: (filenameToGet: string) => {
        return filenameToGet === fileName ? ts.createSourceFile(filenameToGet, fileContent, ts.ScriptTarget.ES5, true) : undefined;
      },
      readFile: () => undefined,
      useCaseSensitiveFileNames: () => true,
      writeFile: () => undefined
    };
  }

  compile(fileContent: string): any[] {
    this.text = fileContent;
    const options = {
      noEmitOnError: true,
      noImplicitAny: true,
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      lib: ['es2016', 'dom'],
    };
    const fileNameMain = 'main.ts';

    (<any>window).tokenList = [];
    const compilerHost: ts.CompilerHost = this.createCompilerHost(fileNameMain, fileContent);
    let program = ts.createProgram([fileNameMain], options, compilerHost);
    let emitResult = program.emit();

    let allDiagnostics = ts
      .getPreEmitDiagnostics(program)
      .concat(emitResult.diagnostics);

    if(debug) {
      this.emitDiagnostics(allDiagnostics);

      let exitCode = emitResult.emitSkipped ? 1 : 0;
      console.log(`Process exiting with code '${exitCode}'.`);
    }

    return this.tokenList;
  }

  private emitDiagnostics(diagnostics: ts.Diagnostic[]) {
    diagnostics.forEach(diagnostic => {
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start!
        );
        let message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          '\n'
        );
        console.log(
          `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
        );
      } else {
        console.log(
          `${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`
        );
      }
    });
  }

  posToLineAndPos(pos: number) {
    const lineStarts = (<any>ts).computeLineStarts(this.text);
    const lineAndPos = (<any>ts).computeLineAndCharacterOfPosition(lineStarts, pos);
    return {
      line: lineAndPos.line,
      ch: lineAndPos.character,
    };
  }

  pushTokenIfNeeded(scanner, currToken) {
    const token = this.getFullToken(scanner, currToken);
    const isTokenOnList = this.tokenList.some(t => t.tokenPos === token.tokenPos);
    if (!isTokenOnList) {
      this.tokenList.unshift(token);
    }
  }

  getFullToken(scanner, token) {
    return {
      tokenKind: ts.SyntaxKind[token],
      tokenValue: scanner.getTokenValue(),
      tokenText: scanner.getTokenText(),
      startPos: scanner.getStartPos(),
      textPos: scanner.getTextPos(),
      tokenPos: scanner.getTokenPos(),
    };
  }
}

export { Compiler }
