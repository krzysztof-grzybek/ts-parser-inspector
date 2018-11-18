import * as ts from 'typescript';
const debug = false;

interface Token {
  tokenKind: string,
  tokenValue: string,
  tokenText: string,
  startPos: number,
  textPos: number,
  tokenPos: number,
};

// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstAssignment] = "EqualsToken";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastAssignment] = "CaretEqualsToken";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstCompoundAssignment] = "PlusEqualsToken";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastCompoundAssignment] = "CaretEqualsToken";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstReservedWord] = "BreakKeyword";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastReservedWord] = "WithKeyword";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstKeyword] = "BreakKeyword";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastKeyword] = "OfKeyword";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstFutureReservedWord] = "ImplementsKeyword";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastFutureReservedWord] = "YieldKeyword";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstTypeNode] = "TypePredicate";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastTypeNode] = "ImportType";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstPunctuation] = "OpenBraceToken";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastPunctuation] = "CaretEqualsToken";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstToken] = "Unknown";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastToken] = "LastKeyword";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstTriviaToken] = "SingleLineCommentTrivia";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastTriviaToken] = "ConflictMarkerTrivia";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstLiteralToken] = "NumericLiteral";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastLiteralToken] = "NoSubstitutionTemplateLiteral";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstTemplateToken] = "NoSubstitutionTemplateLiteral";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastTemplateToken] = "TemplateTail";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstBinaryOperator] = "LessThanToken";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastBinaryOperator] = "CaretEqualsToken";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstNode] = "QualifiedName";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstJSDocNode] = "JSDocTypeExpression";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastJSDocNode] = "JSDocPropertyTag";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstJSDocTagNode] = "JSDocTag";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastJSDocTagNode] = "JSDocPropertyTag";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.FirstContextualKeyword] = "AbstractKeyword";
// @ts-ignore
ts.SyntaxKind[ts.SyntaxKind.LastContextualKeyword] = "OfKeyword";

class Compiler {
  private text: string;
  public tokenList: Token[] = [];

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

  compile(fileContent: string): Token[] {
    this.tokenList = [];
    this.text = fileContent;
    const options = {
      noEmitOnError: true,
      noImplicitAny: true,
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      lib: ['es2016', 'dom'],
    };
    const fileNameMain = 'main.ts';

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
    // internal ts methods
    const lineStarts = (<any>ts).computeLineStarts(this.text);
    const lineAndPos = (<any>ts).computeLineAndCharacterOfPosition(lineStarts, pos);
    return {
      line: lineAndPos.line,
      ch: lineAndPos.character,
    };
  }

  pushTokenIfNeeded(scanner, currToken) {
    const token = this.getFullToken(scanner, currToken);
    const existingTokenIndex = this.tokenList.findIndex(t => t.tokenPos === token.tokenPos);

    if (existingTokenIndex !== -1) {
      this.tokenList.splice(existingTokenIndex, 1);
    }

    this.tokenList.unshift(token);
  }

  getFullToken(scanner, token): Token {
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

export { Compiler, Token }
