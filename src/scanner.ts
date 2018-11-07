import * as ts from 'typescript';

class Scanner {
  private del: ts.Scanner;

  constructor(private text = '') {
    this.reset(text);
  }

  scan() {
    const tokenKind = ts.SyntaxKind[this.del.scan()];
    const tokenValue = this.del.getTokenValue();
    const tokenText = this.del.getTokenText();

    const startPos = this.del.getStartPos();
    const textPos = this.del.getTextPos();
    const tokenPos = this.del.getTokenPos();

    return ({
      tokenKind,
      tokenValue,
      tokenText,
      startPos,
      textPos,
      tokenPos
    });
  }

  reset(text = '') {
    this.text = text;
    this.del = ts.createScanner(
      ts.ScriptTarget.ES5,
      true,
      ts.LanguageVariant.Standard, text
    );
  }

  posToLineAndPos(pos: number) {
    const lineStarts = (<any>ts).computeLineStarts(this.text);
    const lineAndPos = (<any>ts).computeLineAndCharacterOfPosition(lineStarts, pos);
    return {
      line: lineAndPos.line,
      ch: lineAndPos.character,
    };
  }
}

export { Scanner }
